/**
 * @fileoverview Performance monitoring and usage analytics for the validation system.
 *
 * This module provides utilities to wrap validation functions, measure their
 * performance, and emit events for consumption by analytics and monitoring tools.
 *
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

// Simple cross-platform event emitter for React Native compatibility
class SimpleEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(listener => listener(data));
  }

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
}

export interface ValidationEvent {
  validatorName: string;
  durationMs: number;
  success: boolean;
  context?: Record<string, any>;
}

// A simple event emitter to act as a decoupled monitoring bus.
// In a larger application, this could be replaced with a more robust message queue.
export const validationMonitor = new SimpleEventEmitter();

/**
 * A higher-order function that wraps a validation function to monitor its performance.
 *
 * @template T The type of the function to wrap.
 * @param {T} fn The asynchronous validation function to monitor.
 * @param {string} validatorName A unique name for this validator for tracking purposes.
 * @returns {T} The wrapped function with monitoring capabilities.
 */
export function monitor<T extends (...args: any[]) => Promise<any>>(fn: T, validatorName: string): T {
  const wrappedFn = async (...args: any[]): Promise<any> => {
    const startTime = performance.now();
    let success = false;
    try {
      const result = await fn(...args);
      // Assuming a standard result object with an `isValid` or `isConsistent` property.
      success = result.isValid ?? result.isConsistent ?? true;
      return result;
    } catch (error) {
      success = false;
      throw error; // Re-throw the error after capturing it
    } finally {
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      
      const event: ValidationEvent = {
        validatorName,
        durationMs,
        success,
      };

      validationMonitor.emit('validation_completed', event);
    }
  };

  return wrappedFn as T;
}
