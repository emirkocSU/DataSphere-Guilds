/**
 * @fileoverview Lean, high-performance monitoring decorators for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor as PerformanceMonitorClass } from '../utils/performance/monitor';
import { MetricsCollector } from '../utils/performance/metrics-collector';
import { AlertManager } from '../utils/monitoring/alert-manager';
import { PerformanceThresholds } from '../types/performance/performance.types';

const monitor = new PerformanceMonitorClass('PerformanceDecorators');
const metricsCollector = new MetricsCollector();
const alertManager = new AlertManager();

export interface PerformanceMonitorConfig {
  sampleRate?: number;
  alwaysMonitor?: boolean;
  thresholds?: PerformanceThresholds;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
}

export interface RateLimitConfig {
  maxTokens: number;
  refillRate: number;
  keyExtractor?: (args: any[]) => string;
}

export interface MemoryMonitorConfig {
  threshold?: number;
}

export function PerformanceMonitor(config: PerformanceMonitorConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    const shouldSample = createSampler(config.sampleRate || 0.1);
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('performanceMonitorDecorator', async () => {
        const shouldMonitor = config.alwaysMonitor || shouldSample();
        
        if (!shouldMonitor) {
          return originalMethod.apply(this, args);
        }

        const startTime = performance.now();
        const startMemory = process?.memoryUsage?.()?.heapUsed || 0;
        let error: Error | null = null;
        
        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } catch (err) {
          error = err as Error;
          throw err;
        } finally {
          const executionTime = performance.now() - startTime;
          const memoryDelta = (process?.memoryUsage?.()?.heapUsed || 0) - startMemory;
          
          // Record metrics
          metricsCollector.record({
            name: 'method_execution_time',
            value: executionTime,
            labels: { method: methodName, status: error ? 'error' : 'success' }
          });
          
          if (memoryDelta > 0) {
            metricsCollector.record({
              name: 'method_memory_usage',
              value: memoryDelta,
              labels: { method: methodName }
            });
          }
          
          // Check thresholds
          checkThresholds(methodName, executionTime, memoryDelta, config.thresholds);
        }
      });
    };
    
    return descriptor;
  };
}

export function CircuitBreaker(config: CircuitBreakerConfig) {
  const state = {
    failures: 0,
    lastFailureTime: 0,
    state: 'CLOSED' as 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  };
  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('circuitBreakerDecorator', async () => {
        const now = Date.now();
        
        // Check circuit state
        if (state.state === 'OPEN') {
          if (now - state.lastFailureTime >= config.recoveryTimeout) {
            state.state = 'HALF_OPEN';
          } else {
            throw new Error(`Circuit breaker OPEN for ${methodName}`);
          }
        }
        
        const startTime = performance.now();
        
        try {
          const result = await originalMethod.apply(this, args);
          
          // Success - reset failures if in HALF_OPEN
          if (state.state === 'HALF_OPEN') {
            state.failures = 0;
            state.state = 'CLOSED';
          }
          
          const executionTime = performance.now() - startTime;
          metricsCollector.record({
            name: 'circuit_breaker_success',
            value: executionTime,
            labels: { method: methodName, state: state.state }
          });
          
          return result;
        } catch (error) {
          state.failures++;
          state.lastFailureTime = now;
          
          if (state.failures >= config.failureThreshold) {
            state.state = 'OPEN';
            alertManager.sendAlert({
              type: 'CIRCUIT_BREAKER_OPEN',
              method: methodName,
              threshold: config.failureThreshold,
              value: state.failures
            });
          }
          
          metricsCollector.record({
            name: 'circuit_breaker_failure',
            value: 1,
            labels: { method: methodName, state: state.state }
          });
          
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export function RateLimit(config: RateLimitConfig) {
  const buckets = new Map<string, TokenBucket>();
  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('rateLimitDecorator', async () => {
        const key = config.keyExtractor ? config.keyExtractor(args) : 'default';
        const bucketKey = `${methodName}:${key}`;
        
        let bucket = buckets.get(bucketKey);
        if (!bucket) {
          bucket = new TokenBucket(config.maxTokens, config.refillRate);
          buckets.set(bucketKey, bucket);
        }
        
        if (!bucket.consume()) {
          metricsCollector.record({
            name: 'rate_limit_exceeded',
            value: 1,
            labels: { method: methodName, key }
          });
          throw new Error(`Rate limit exceeded for ${methodName}`);
        }
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

export function MemoryMonitor(config: MemoryMonitorConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('memoryMonitorDecorator', async () => {
        const initialMemory = process?.memoryUsage?.() || { heapUsed: 0 };
        
        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } finally {
          const finalMemory = process?.memoryUsage?.() || { heapUsed: 0 };
          const memoryDelta = finalMemory.heapUsed - initialMemory.heapUsed;
          
          if (memoryDelta > (config.threshold || 10 * 1024 * 1024)) { // 10MB default
            console.warn(`Potential memory leak in ${methodName}`, {
              memoryDelta,
              initialMemory: initialMemory.heapUsed,
              finalMemory: finalMemory.heapUsed
            });
            
            metricsCollector.record({
              name: 'potential_memory_leak',
              value: memoryDelta,
              labels: { method: methodName }
            });
          }
        }
      });
    };
    
    return descriptor;
  };
}

// Helper classes and functions
class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  
  constructor(
    private maxTokens: number,
    private refillRate: number // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }
  
  consume(): boolean {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }
    
    return false;
  }
  
  private refill(): void {
    const now = Date.now();
    const timeDelta = (now - this.lastRefill) / 1000;
    const tokensToAdd = timeDelta * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

function createSampler(rate: number): () => boolean {
  return () => Math.random() < rate;
}

function checkThresholds(
  methodName: string,
  executionTime: number,
  memoryDelta: number,
  thresholds?: PerformanceThresholds
): void {
  if (!thresholds) return;
  
  if (thresholds.maxExecutionTime && executionTime > thresholds.maxExecutionTime) {
    alertManager.sendAlert({
      type: 'SLOW_EXECUTION',
      method: methodName,
      value: executionTime,
      threshold: thresholds.maxExecutionTime
    });
  }
  
  if (thresholds.maxMemoryUsage && memoryDelta > thresholds.maxMemoryUsage) {
    alertManager.sendAlert({
      type: 'HIGH_MEMORY_USAGE',
      method: methodName,
      value: memoryDelta,
      threshold: thresholds.maxMemoryUsage
    });
  }
}

export { monitor as performanceDecoratorMonitor };