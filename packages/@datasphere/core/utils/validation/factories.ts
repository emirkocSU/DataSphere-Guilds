/**
 * @fileoverview Lean, high-performance validation factories for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('ValidationFactories');

export interface ValidatorConfig {
  enableCache?: boolean;
  cacheSize?: number;
  timeout?: number;
}

export interface ValidationSchema {
  type: string;
  required?: boolean;
  rules?: string[];
}

export function createFastValidator(schema: ValidationSchema, config: ValidatorConfig = {}) {
  const cache = new Map<string, boolean>();
  
  return (data: any): boolean => {
    return monitor.measure('fastValidator', () => {
      const cacheKey = JSON.stringify(data);
      
      if (config.enableCache && cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }
      
      const isValid = validateBasic(data, schema);
      
      if (config.enableCache) {
        if (cache.size >= (config.cacheSize || 500)) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(cacheKey, isValid);
      }
      
      return isValid;
    });
  };
}

export function createSchemaValidator(schema: ValidationSchema) {
  return (data: any): { isValid: boolean; errors?: string[] } => {
    return monitor.measure('schemaValidator', () => {
      const errors: string[] = [];
      
      if (schema.required && !data) {
        errors.push('Field is required');
      }
      
      if (data && schema.type && typeof data !== schema.type) {
        errors.push(`Expected ${schema.type}, got ${typeof data}`);
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
      };
    });
  };
}

export function createAsyncValidator(schema: ValidationSchema, config: ValidatorConfig = {}) {
  return async (data: any): Promise<{ isValid: boolean; errors?: string[] }> => {
    return monitor.measure('asyncValidator', async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const validator = createSchemaValidator(schema);
          resolve(validator(data));
        }, 0);
      });
    });
  };
}

export function createCompositeValidator(validators: Array<(data: any) => boolean>) {
  return (data: any): boolean => {
    return monitor.measure('compositeValidator', () => {
      return validators.every(validator => validator(data));
    });
  };
}

export function createCachedValidator(validator: (data: any) => boolean, cacheSize = 1000) {
  const cache = new Map<string, boolean>();
  
  return (data: any): boolean => {
    return monitor.measure('cachedValidator', () => {
      const cacheKey = JSON.stringify(data);
      
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }
      
      const result = validator(data);
      
      if (cache.size >= cacheSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      cache.set(cacheKey, result);
      return result;
    });
  };
}

function validateBasic(data: any, schema: ValidationSchema): boolean {
  if (schema.required && !data) {
    return false;
  }
  
  if (data && schema.type && typeof data !== schema.type) {
    return false;
  }
  
  return true;
}