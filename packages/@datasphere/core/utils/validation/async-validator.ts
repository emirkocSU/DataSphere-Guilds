/**
 * @fileoverview Lean, high-performance async validator for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('AsyncValidator');

export interface AsyncValidationRule {
  field: string;
  type?: string;
  required?: boolean;
  validator?: (rule: AsyncValidationRule, value: any) => Promise<boolean>;
  message?: string;
}

export interface AsyncValidationOptions {
  first?: boolean;
  suppressWarning?: boolean;
  timeout?: number;
}

export interface AsyncValidationError {
  message: string;
  field: string;
  value: any;
}

export interface AsyncValidationResult {
  isValid: boolean;
  errors: AsyncValidationError[];
  warnings: string[];
}

export class AsyncValidator {
  private rules: Map<string, AsyncValidationRule[]> = new Map();
  
  constructor(rules?: Record<string, AsyncValidationRule | AsyncValidationRule[]>) {
    if (rules) {
      for (const [field, rule] of Object.entries(rules)) {
        this.rules.set(field, Array.isArray(rule) ? rule : [rule]);
      }
    }
  }
  
  async validate(data: Record<string, any>, options: AsyncValidationOptions = {}): Promise<AsyncValidationResult> {
    return monitor.measure('asyncValidatorValidate', async () => {
      const errors: AsyncValidationError[] = [];
      const warnings: string[] = [];
      const timeout = options.timeout || 5000;
      
      const validationPromises: Promise<void>[] = [];
      
      for (const [field, fieldRules] of this.rules) {
        const value = data[field];
        
        for (const rule of fieldRules) {
          const promise = this.validateField(rule, value, field)
            .then(error => {
              if (error) {
                errors.push(error);
                if (options.first) {
                  throw new Error('First error encountered');
                }
              }
            })
            .catch(err => {
              if (!options.suppressWarning) {
                warnings.push(`Validation warning for ${field}: ${err.message}`);
              }
            });
          
          validationPromises.push(promise);
        }
      }
      
      try {
        await Promise.race([
          Promise.all(validationPromises),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Validation timeout')), timeout)
          )
        ]);
      } catch (error) {
        if ((error as Error).message === 'Validation timeout') {
          warnings.push('Some validations timed out');
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    });
  }
  
  private async validateField(rule: AsyncValidationRule, value: any, field: string): Promise<AsyncValidationError | null> {
    return monitor.measure('asyncValidatorValidateField', async () => {
      if (rule.required && (value === undefined || value === null || value === '')) {
        return {
          message: rule.message || `${field} is required`,
          field,
          value
        };
      }
      
      if (value !== undefined && value !== null && rule.type) {
        if (typeof value !== rule.type) {
          return {
            message: rule.message || `${field} must be ${rule.type}`,
            field,
            value
          };
        }
      }
      
      if (rule.validator && value !== undefined && value !== null) {
        try {
          const isValid = await rule.validator(rule, value);
          if (!isValid) {
            return {
              message: rule.message || `${field} validation failed`,
              field,
              value
            };
          }
        } catch (error) {
          return {
            message: rule.message || `${field} validation error: ${(error as Error).message}`,
            field,
            value
          };
        }
      }
      
      return null;
    });
  }
  
  addRule(field: string, rule: AsyncValidationRule): void {
    const existingRules = this.rules.get(field) || [];
    existingRules.push(rule);
    this.rules.set(field, existingRules);
  }
  
  removeRules(field: string): void {
    this.rules.delete(field);
  }
  
  getRules(field?: string): Map<string, AsyncValidationRule[]> | AsyncValidationRule[] | undefined {
    if (field) {
      return this.rules.get(field);
    }
    return this.rules;
  }
}

export function createAsyncEmailValidator(): AsyncValidationRule {
  return {
    field: 'email',
    type: 'string',
    required: true,
    validator: async (rule, value) => {
      await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message: 'Invalid email format'
  };
}

export function createAsyncUrlValidator(): AsyncValidationRule {
  return {
    field: 'url',
    type: 'string',
    validator: async (rule, value) => {
      await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Invalid URL format'
  };
}

export function createAsyncLengthValidator(min: number, max: number): AsyncValidationRule {
  return {
    field: 'length',
    validator: async (rule, value) => {
      await new Promise(resolve => setTimeout(resolve, 5)); // Simulate async
      const length = typeof value === 'string' ? value.length : 0;
      return length >= min && length <= max;
    },
    message: `Length must be between ${min} and ${max}`
  };
}