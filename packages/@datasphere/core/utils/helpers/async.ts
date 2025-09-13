/**
 * @fileoverview Enterprise-grade async utilities with advanced concurrency patterns
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('AsyncUtils');

/**
 * High-precision delay with cancellation support
 */
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms < 0) throw new ValidationError('Delay must be non-negative');
  
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Delay aborted'));
      return;
    }
    
    const timeoutId = setTimeout(resolve, ms);
    
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Delay aborted'));
      });
    }
  });
}

/**
 * Execute promises with controlled concurrency
 */
export async function concurrent<T>(
  tasks: Array<() => Promise<T>>, 
  concurrency: number = 5
): Promise<T[]> {
  if (concurrency <= 0) throw new ValidationError('Concurrency must be positive');
  if (!Array.isArray(tasks)) throw new ValidationError('Tasks must be an array');
  
  return monitor.measure('concurrent', async () => {
    const results: T[] = new Array(tasks.length);
    const executing: Promise<void>[] = [];
    let index = 0;
    
    async function executeTask(taskIndex: number): Promise<void> {
      try {
        results[taskIndex] = await tasks[taskIndex]();
      } catch (error) {
        results[taskIndex] = error as T;
      }
    }
    
    while (index < tasks.length) {
      const taskPromise = executeTask(index++);
      executing.push(taskPromise);
      
      if (executing.length >= concurrency) {
        const completed = await Promise.race(executing.map((p, i) => p.then(() => i)));
        executing.splice(completed, 1);
      }
    }
    
    await Promise.all(executing);
    return results;
  });
}

/**
 * Batch process items with controlled concurrency and progress tracking
 */
export async function batch<T, R>(
  items: T[], 
  processor: (item: T, index: number) => Promise<R>, 
  options: {
    batchSize?: number;
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
    onError?: (error: Error, item: T, index: number) => void;
  } = {}
): Promise<R[]> {
  const { batchSize = 10, concurrency = 3, onProgress, onError } = options;
  
  if (!Array.isArray(items)) throw new ValidationError('Items must be an array');
  if (batchSize <= 0) throw new ValidationError('Batch size must be positive');
  
  return monitor.measure('batch', async () => {
    const results: R[] = new Array(items.length);
    let completed = 0;
    
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    const processBatch = async (batch: T[], batchStartIndex: number): Promise<void> => {
      const batchPromises = batch.map(async (item, localIndex) => {
        const globalIndex = batchStartIndex + localIndex;
        try {
          results[globalIndex] = await processor(item, globalIndex);
          completed++;
          onProgress?.(completed, items.length);
        } catch (error) {
          onError?.(error as Error, item, globalIndex);
          results[globalIndex] = error as R;
        }
      });
      
      await Promise.all(batchPromises);
    };
    
    const batchTasks = batches.map((batch, batchIndex) => 
      () => processBatch(batch, batchIndex * batchSize)
    );
    
    await concurrent(batchTasks, concurrency);
    return results;
  });
}

/**
 * Advanced timeout with custom error handling
 */
export function timeout<T>(
  promise: Promise<T>, 
  ms: number, 
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  if (ms <= 0) throw new ValidationError('Timeout must be positive');
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
    
    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/**
 * Debounce async function calls
 */
export function debounce<T extends any[], R>(
  fn: (...args: T) => Promise<R>, 
  delay: number
): (...args: T) => Promise<R> {
  if (delay < 0) throw new ValidationError('Delay must be non-negative');
  
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<R> | null = null;
  let resolveCallback: ((value: R) => void) | null = null;
  let rejectCallback: ((error: any) => void) | null = null;
  
  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      resolveCallback = resolve;
      rejectCallback = reject;
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolveCallback?.(result);
        } catch (error) {
          rejectCallback?.(error);
        }
      }, delay);
    });
  };
}

/**
 * Throttle async function calls
 */
export function throttle<T extends any[], R>(
  fn: (...args: T) => Promise<R>, 
  interval: number
): (...args: T) => Promise<R | null> {
  if (interval <= 0) throw new ValidationError('Interval must be positive');
  
  let lastCall = 0;
  let pendingPromise: Promise<R> | null = null;
  
  return async (...args: T): Promise<R | null> => {
    const now = Date.now();
    
    if (now - lastCall >= interval) {
      lastCall = now;
      pendingPromise = fn(...args);
      return pendingPromise;
    }
    
    return null;
  };
}

/**
 * Create a semaphore for limiting concurrent access
 */
export class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];
  
  constructor(permits: number) {
    if (permits <= 0) throw new ValidationError('Permits must be positive');
    this.permits = permits;
  }
  
  async acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.permits > 0) {
        this.permits--;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }
  
  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.permits++;
    }
  }
  
  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * Execute with automatic retry on failure
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    jitter?: boolean;
    abortSignal?: AbortSignal;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 100,
    maxDelay = 5000,
    backoffFactor = 2,
    jitter = true,
    abortSignal
  } = options;
  
  return monitor.measure('withRetry', async () => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (abortSignal?.aborted) {
        throw new Error('Operation aborted');
      }
      
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) break;
        
        let delayMs = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt - 1),
          maxDelay
        );
        
        if (jitter) {
          delayMs = delayMs * (0.5 + Math.random() * 0.5);
        }
        
        await delay(delayMs, abortSignal);
      }
    }
    
    throw lastError!;
  });
}

/**
 * Race with timeout and fallback
 */
export async function raceWithFallback<T>(
  promises: Promise<T>[], 
  timeoutMs: number, 
  fallback: T
): Promise<T> {
  if (!Array.isArray(promises)) throw new ValidationError('Promises must be an array');
  if (timeoutMs <= 0) throw new ValidationError('Timeout must be positive');
  
  return monitor.measure('raceWithFallback', async () => {
    try {
      return await Promise.race([
        Promise.race(promises),
        timeout(new Promise<never>(() => {}), timeoutMs, 'Race timeout')
      ]);
    } catch {
      return fallback;
    }
  });
}

/**
 * Waterfall execution pattern
 */
export async function waterfall<T>(
  initial: T, 
  transforms: Array<(value: T) => Promise<T>>
): Promise<T> {
  if (!Array.isArray(transforms)) throw new ValidationError('Transforms must be an array');
  
  return monitor.measure('waterfall', async () => {
    let result = initial;
    
    for (const transform of transforms) {
      result = await transform(result);
    }
    
    return result;
  });
}

export { monitor as asyncUtilsMonitor };
