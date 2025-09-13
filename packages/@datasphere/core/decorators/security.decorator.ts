/**
 * @fileoverview Lean, high-performance security decorators for unicorn-level protection
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../utils/performance/monitor';
import { ValidationError } from '../types/errors/validation.errors';

const monitor = new PerformanceMonitor('SecurityDecorators');

// Helper functions defined first
function validateInput(args: any[], maxSize: number): void {
  const serialized = JSON.stringify(args);
  
  if (serialized.length > maxSize) {
    throw new ValidationError('Input too large');
  }
  
  // Check for suspicious patterns
  const suspicious = /<script|javascript:|data:|vbscript:/i;
  if (suspicious.test(serialized)) {
    throw new ValidationError('Suspicious input detected');
  }
}

function sanitizeOutput(result: any): any {
  if (typeof result === 'string') {
    return result.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }
  
  if (typeof result === 'object' && result !== null) {
    const sanitized: any = Array.isArray(result) ? [] : {};
    
    for (const [key, value] of Object.entries(result)) {
      sanitized[key] = sanitizeOutput(value);
    }
    
    return sanitized;
  }
  
  return result;
}

export interface SecurityConfig {
  checkInput?: boolean;
  sanitizeOutput?: boolean;
  logSuspicious?: boolean;
  maxInputSize?: number;
}

export function Secure(config: SecurityConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('secureDecorator', async () => {
        if (config.checkInput) {
          validateInput(args, config.maxInputSize || 1024 * 1024);
        }
        
        try {
          const result = await originalMethod.apply(this, args);
          
          if (config.sanitizeOutput) {
            return sanitizeOutput(result);
          }
          
          return result;
        } catch (error) {
          if (config.logSuspicious) {
            console.warn(`[SECURITY] Suspicious activity in ${methodName}:`, (error as Error).message);
          }
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export function RateLimit(maxRequests: number, windowMs: number = 60000) {
  const requests = new Map<string, number[]>();
  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('rateLimitDecorator', async () => {
        const now = Date.now();
        const key = `${methodName}:${this.constructor.name}`;
        
        if (!requests.has(key)) {
          requests.set(key, []);
        }
        
        const timestamps = requests.get(key)!;
        const validTimestamps = timestamps.filter(t => now - t < windowMs);
        
        if (validTimestamps.length >= maxRequests) {
          throw new ValidationError(`Rate limit exceeded for ${methodName}`);
        }
        
        validTimestamps.push(now);
        requests.set(key, validTimestamps);
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

export { monitor as securityDecoratorMonitor };