/**
 * @fileoverview Lean, high-performance validator registry for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('ValidatorRegistry');

export interface ValidatorDefinition {
  name: string;
  validator: (value: any, ...params: any[]) => boolean | Promise<boolean>;
  async?: boolean;
  description?: string;
  parameters?: string[];
}

export interface ValidatorOptions {
  enableCache?: boolean;
  cacheSize?: number;
  timeout?: number;
}

export class ValidatorRegistry {
  private validators = new Map<string, ValidatorDefinition>();
  private cache = new Map<string, boolean>();
  private options: ValidatorOptions;
  
  constructor(options: ValidatorOptions = {}) {
    this.options = {
      enableCache: options.enableCache || false,
      cacheSize: options.cacheSize || 1000,
      timeout: options.timeout || 5000
    };
    
    this.registerBuiltInValidators();
  }
  
  register(definition: ValidatorDefinition): void {
    monitor.measure('validatorRegistryRegister', () => {
      this.validators.set(definition.name, definition);
    });
  }
  
  unregister(name: string): boolean {
    return monitor.measure('validatorRegistryUnregister', () => {
      return this.validators.delete(name);
    });
  }
  
  get(name: string): ValidatorDefinition | undefined {
    return monitor.measure('validatorRegistryGet', () => {
      return this.validators.get(name);
    });
  }
  
  list(): ValidatorDefinition[] {
    return monitor.measure('validatorRegistryList', () => {
      return Array.from(this.validators.values());
    });
  }
  
  async validate(validatorName: string, value: any, ...params: any[]): Promise<boolean> {
    return monitor.measure('validatorRegistryValidate', async () => {
      const validator = this.validators.get(validatorName);
      if (!validator) {
        throw new Error(`Validator '${validatorName}' not found`);
      }
      
      const cacheKey = this.options.enableCache 
        ? `${validatorName}:${JSON.stringify([value, ...params])}`
        : '';
      
      if (this.options.enableCache && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }
      
      let result: boolean;
      
      if (validator.async) {
        const timeoutPromise = new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('Validation timeout')), this.options.timeout)
        );
        
        result = await Promise.race([
          validator.validator(value, ...params) as Promise<boolean>,
          timeoutPromise
        ]);
      } else {
        result = validator.validator(value, ...params) as boolean;
      }
      
      if (this.options.enableCache) {
        if (this.cache.size >= this.options.cacheSize!) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        this.cache.set(cacheKey, result);
      }
      
      return result;
    });
  }
  
  hasValidator(name: string): boolean {
    return this.validators.has(name);
  }
  
  clearCache(): void {
    this.cache.clear();
  }
  
  getStats(): { validatorCount: number; cacheSize: number } {
    return {
      validatorCount: this.validators.size,
      cacheSize: this.cache.size
    };
  }
  
  private registerBuiltInValidators(): void {
    // String validators
    this.register({
      name: 'required',
      validator: (value: any) => value !== null && value !== undefined && value !== '',
      description: 'Validates that value is not null, undefined, or empty string'
    });
    
    this.register({
      name: 'email',
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      description: 'Validates email format'
    });
    
    this.register({
      name: 'url',
      validator: (value: string) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      description: 'Validates URL format'
    });
    
    this.register({
      name: 'minLength',
      validator: (value: string, min: number) => value.length >= min,
      description: 'Validates minimum string length',
      parameters: ['min']
    });
    
    this.register({
      name: 'maxLength',
      validator: (value: string, max: number) => value.length <= max,
      description: 'Validates maximum string length',
      parameters: ['max']
    });
    
    // Number validators
    this.register({
      name: 'min',
      validator: (value: number, min: number) => value >= min,
      description: 'Validates minimum numeric value',
      parameters: ['min']
    });
    
    this.register({
      name: 'max',
      validator: (value: number, max: number) => value <= max,
      description: 'Validates maximum numeric value',
      parameters: ['max']
    });
    
    this.register({
      name: 'integer',
      validator: (value: number) => Number.isInteger(value),
      description: 'Validates that value is an integer'
    });
    
    // Array validators
    this.register({
      name: 'arrayMinLength',
      validator: (value: any[], min: number) => Array.isArray(value) && value.length >= min,
      description: 'Validates minimum array length',
      parameters: ['min']
    });
    
    this.register({
      name: 'arrayMaxLength',
      validator: (value: any[], max: number) => Array.isArray(value) && value.length <= max,
      description: 'Validates maximum array length',
      parameters: ['max']
    });
    
    // Async validators
    this.register({
      name: 'asyncEmail',
      validator: async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      async: true,
      description: 'Async email validation'
    });
  }
}

// Global registry instance
export const globalValidatorRegistry = new ValidatorRegistry({
  enableCache: true,
  cacheSize: 2000,
  timeout: 10000
});

// Helper functions
export function registerValidator(definition: ValidatorDefinition): void {
  globalValidatorRegistry.register(definition);
}

export function validateWith(validatorName: string, value: any, ...params: any[]): Promise<boolean> {
  return globalValidatorRegistry.validate(validatorName, value, ...params);
}

export function hasValidator(name: string): boolean {
  return globalValidatorRegistry.hasValidator(name);
}

export function listValidators(): ValidatorDefinition[] {
  return globalValidatorRegistry.list();
}