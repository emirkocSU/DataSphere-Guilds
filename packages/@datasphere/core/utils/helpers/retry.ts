/**
 * @fileoverview Lean, high-performance retry utilities for unicorn-level reliability
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { delay } from './async';
import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('RetryUtils');

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: boolean;
  retryIf?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 100,
    maxDelay = 5000,
    backoffFactor = 2,
    jitter = true,
    retryIf = () => true,
    onRetry
  } = options;

  if (maxAttempts <= 0) throw new ValidationError('Max attempts must be positive');

  return monitor.measure('retry', async () => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts || !retryIf(lastError)) {
          throw lastError;
        }

        onRetry?.(lastError, attempt);
        
        let delayMs = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt - 1),
          maxDelay
        );
        
        if (jitter) {
          delayMs *= (0.5 + Math.random() * 0.5);
        }
        
        await delay(delayMs);
      }
    }
    
    throw lastError!;
  });
}

export class CircuitBreaker<T> {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private fn: () => Promise<T>,
    private failureThreshold = 5,
    private recoveryTimeout = 60000
  ) {}
  
  async execute(): Promise<T> {
    return monitor.measure('circuitBreaker', async () => {
      if (this.state === 'OPEN') {
        if (Date.now() - this.lastFailureTime < this.recoveryTimeout) {
          throw new Error('Circuit breaker is OPEN');
        }
        this.state = 'HALF_OPEN';
      }
      
      try {
        const result = await this.fn();
        
        if (this.state === 'HALF_OPEN') {
          this.state = 'CLOSED';
          this.failures = 0;
        }
        
        return result;
      } catch (error) {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.failures >= this.failureThreshold) {
          this.state = 'OPEN';
        }
        
        throw error;
      }
    });
  }
  
  getState() { return this.state; }
  reset() { this.state = 'CLOSED'; this.failures = 0; }
}

export const RetryConditions = {
  networkErrors: (error: Error) => {
    const msg = error.message.toLowerCase();
    return msg.includes('network') || msg.includes('timeout') || msg.includes('connection');
  },
  serverErrors: (error: any) => error.statusCode >= 500,
  never: () => false,
  always: () => true
};

export { monitor as retryUtilsMonitor };
