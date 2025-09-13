/**
 * @fileoverview Lean, high-performance validation middleware for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('ValidationMiddleware');

export interface ValidationMiddlewareConfig {
  skipValidation?: boolean;
  enableCache?: boolean;
  maxCacheSize?: number;
}

export interface ValidationRequest {
  data: any;
  schema?: any;
  rules?: string[];
}

export interface ValidationResponse {
  isValid: boolean;
  errors?: string[];
  data?: any;
}

export function validationMiddleware(config: ValidationMiddlewareConfig = {}) {
  const cache = new Map<string, ValidationResponse>();
  
  return async (req: ValidationRequest): Promise<ValidationResponse> => {
    return monitor.measure('validationMiddleware', async () => {
      if (config.skipValidation) {
        return { isValid: true, data: req.data };
      }

      const cacheKey = JSON.stringify({ data: req.data, schema: req.schema });
      
      if (config.enableCache && cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      const result = await validateData(req.data, req.schema, req.rules);
      
      if (config.enableCache) {
        if (cache.size >= (config.maxCacheSize || 1000)) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(cacheKey, result);
      }

      return result;
    });
  };
}

export function errorHandlingMiddleware() {
  return (error: Error): ValidationResponse => {
    return monitor.measure('errorHandlingMiddleware', () => {
      console.error('[ValidationMiddleware] Error:', error.message);
      return {
        isValid: false,
        errors: [error.message]
      };
    });
  };
}

export function performanceMiddleware() {
  return async (fn: () => Promise<ValidationResponse>): Promise<ValidationResponse> => {
    return monitor.measure('performanceMiddleware', async () => {
      const startTime = performance.now();
      const startMemory = process?.memoryUsage?.()?.heapUsed || 0;
      
      try {
        const result = await fn();
        return result;
      } finally {
        const executionTime = performance.now() - startTime;
        const memoryDelta = (process?.memoryUsage?.()?.heapUsed || 0) - startMemory;
        
        if (executionTime > 100) {
          console.warn(`[ValidationMiddleware] Slow validation: ${executionTime}ms`);
        }
        
        if (memoryDelta > 10 * 1024 * 1024) {
          console.warn(`[ValidationMiddleware] High memory usage: ${memoryDelta} bytes`);
        }
      }
    });
  };
}

async function validateData(data: any, schema?: any, rules?: string[]): Promise<ValidationResponse> {
  if (!data) {
    return { isValid: false, errors: ['Data is required'] };
  }

  const errors: string[] = [];

  if (schema) {
    if (typeof data !== typeof schema.type) {
      errors.push(`Expected ${schema.type}, got ${typeof data}`);
    }
  }

  if (rules) {
    for (const rule of rules) {
      if (rule === 'required' && !data) {
        errors.push('Field is required');
      }
      if (rule === 'email' && typeof data === 'string' && !isValidEmail(data)) {
        errors.push('Invalid email format');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    data
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}