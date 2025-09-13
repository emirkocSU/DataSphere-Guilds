/**
 * @fileoverview Lean, high-performance validators for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('Validators');

export interface ValidatorResult {
  isValid: boolean;
  errors?: string[];
  data?: any;
}

export class JSONSchemaValidator {
  private schema: any;
  
  constructor(schema: any) {
    this.schema = schema;
  }
  
  validate(data: any): ValidatorResult {
    return monitor.measure('jsonSchemaValidator', () => {
      const errors: string[] = [];
      
      if (this.schema.type && typeof data !== this.schema.type) {
        errors.push(`Expected ${this.schema.type}, got ${typeof data}`);
      }
      
      if (this.schema.required && data == null) {
        errors.push('Field is required');
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        data
      };
    });
  }
}

export class AJVValidator {
  private schema: any;
  
  constructor(schema: any) {
    this.schema = schema;
  }
  
  validate(data: any): ValidatorResult {
    return monitor.measure('ajvValidator', () => {
      return this.basicValidation(data);
    });
  }
  
  private basicValidation(data: any): ValidatorResult {
    const errors: string[] = [];
    
    if (this.schema.type && typeof data !== this.schema.type) {
      errors.push(`Type mismatch: expected ${this.schema.type}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      data
    };
  }
}

export class ZodValidator {
  private schema: any;
  
  constructor(schema: any) {
    this.schema = schema;
  }
  
  validate(data: any): ValidatorResult {
    return monitor.measure('zodValidator', () => {
      const errors: string[] = [];
      
      if (this.schema.shape) {
        for (const [key, fieldSchema] of Object.entries(this.schema.shape)) {
          if (!data || !(key in data)) {
            errors.push(`Missing field: ${key}`);
          }
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        data
      };
    });
  }
}

export class YupValidator {
  private schema: any;
  
  constructor(schema: any) {
    this.schema = schema;
  }
  
  validate(data: any): ValidatorResult {
    return monitor.measure('yupValidator', () => {
      const errors: string[] = [];
      
      if (this.schema.required && data == null) {
        errors.push('Field is required');
      }
      
      if (this.schema.type && data != null && typeof data !== this.schema.type) {
        errors.push(`Expected ${this.schema.type}`);
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        data
      };
    });
  }
}

export class CustomValidator {
  private validationFn: (data: any) => ValidatorResult;
  
  constructor(validationFn: (data: any) => ValidatorResult) {
    this.validationFn = validationFn;
  }
  
  validate(data: any): ValidatorResult {
    return monitor.measure('customValidator', () => {
      return this.validationFn(data);
    });
  }
}