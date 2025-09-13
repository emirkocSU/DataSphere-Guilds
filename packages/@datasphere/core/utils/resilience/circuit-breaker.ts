/**
 * @fileoverview A robust circuit breaker implementation to prevent repeated failures.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { Logger } from '../logging/logger';

enum CircuitBreakerState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  recoveryTimeout: number;
}

export class CircuitBreaker {
  private state = CircuitBreakerState.CLOSED;
  private failures = 0;
  private lastFailureTime: number | null = null;
  private logger: Logger;

  constructor(private name: string, private options: CircuitBreakerOptions) {
    this.logger = new Logger(`CircuitBreaker:${name}`);
  }

  async execute<T>(asyncFunction: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.options.recoveryTimeout) {
        this.state = CircuitBreakerState.HALF_OPEN;
        this.logger.warn('State changed to HALF_OPEN');
      } else {
        throw new Error('CircuitBreaker is open');
      }
    }

    try {
      const result = await asyncFunction();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.options.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.logger.error('State changed to OPEN');
    }
  }

  private reset() {
    if (this.state !== CircuitBreakerState.CLOSED) {
      this.logger.info('State changed to CLOSED');
    }
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = CircuitBreakerState.CLOSED;
  }
} 