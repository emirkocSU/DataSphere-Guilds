/**
 * @fileoverview Lean, high-performance validation decorators for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('ValidationDecorators');

export interface ValidationConfig {
  schema?: any;
  rules?: string[];
  skipOnNull?: boolean;
  enableCache?: boolean;
}

export function ValidateInput(config: ValidationConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    const cache = new Map<string, boolean>();
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('validateInputDecorator', async () => {
        if (config.skipOnNull && args.every(arg => arg == null)) {
          return originalMethod.apply(this, args);
        }
        
        const cacheKey = config.enableCache ? JSON.stringify(args) : '';
        if (config.enableCache && cache.has(cacheKey)) {
          return originalMethod.apply(this, args);
        }
        
        const validation = await validateArgs(args, config);
        if (!validation.isValid) {
          throw new Error(`Validation failed for ${methodName}: ${validation.errors?.join(', ')}`);
        }
        
        if (config.enableCache) {
          cache.set(cacheKey, true);
        }
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

export function ValidateOutput(config: ValidationConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('validateOutputDecorator', async () => {
        const result = await originalMethod.apply(this, args);
        
        if (config.skipOnNull && result == null) {
          return result;
        }
        
        const validation = await validateArgs([result], config);
        if (!validation.isValid) {
          throw new Error(`Output validation failed for ${methodName}: ${validation.errors?.join(', ')}`);
        }
        
        return result;
      });
    };
    
    return descriptor;
  };
}

export function ValidateSchema(schema: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('validateSchemaDecorator', async () => {
        const validation = await validateArgs(args, { schema });
        if (!validation.isValid) {
          throw new Error(`Schema validation failed: ${validation.errors?.join(', ')}`);
        }
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

export function ValidateAsync(config: ValidationConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('validateAsyncDecorator', async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const validation = await validateArgs(args, config);
        if (!validation.isValid) {
          throw new Error(`Async validation failed: ${validation.errors?.join(', ')}`);
        }
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

export function ValidateWithCache(config: ValidationConfig & { cacheSize?: number } = {}) {
  const globalCache = new Map<string, boolean>();
  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cacheSize = config.cacheSize || 1000;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('validateWithCacheDecorator', async () => {
        const cacheKey = `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
        
        if (globalCache.has(cacheKey)) {
          return originalMethod.apply(this, args);
        }
        
        const validation = await validateArgs(args, config);
        if (!validation.isValid) {
          throw new Error(`Cached validation failed: ${validation.errors?.join(', ')}`);
        }
        
        if (globalCache.size >= cacheSize) {
          const firstKey = globalCache.keys().next().value;
          globalCache.delete(firstKey);
        }
        
        globalCache.set(cacheKey, true);
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

async function validateArgs(args: any[], config: ValidationConfig): Promise<{ isValid: boolean; errors?: string[] }> {
  const errors: string[] = [];
  
  for (const arg of args) {
    if (config.schema && typeof arg !== config.schema.type) {
      errors.push(`Expected ${config.schema.type}, got ${typeof arg}`);
    }
    
    if (config.rules) {
      for (const rule of config.rules) {
        if (rule === 'required' && arg == null) {
          errors.push('Argument is required');
        }
        if (rule === 'email' && typeof arg === 'string' && !isValidEmail(arg)) {
          errors.push('Invalid email format');
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}