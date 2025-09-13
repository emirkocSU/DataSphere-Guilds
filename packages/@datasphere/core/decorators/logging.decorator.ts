/**
 * @fileoverview Lean, high-performance logging decorators for unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../utils/performance/monitor';

const monitor = new PerformanceMonitor('LoggingDecorators');

export interface LogConfig {
  level?: 'debug' | 'info' | 'warn' | 'error';
  includeArgs?: boolean;
  includeResult?: boolean;
  maxArgLength?: number;
  onError?: (error: Error, methodName: string) => void;
}

export function Log(config: LogConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const { level = 'info', includeArgs = false, includeResult = false, maxArgLength = 100 } = config;
      
      return monitor.measure('logDecorator', async () => {
        try {
          if (includeArgs) {
            const argsStr = JSON.stringify(args).slice(0, maxArgLength);
            console[level](`[${methodName}] Called with:`, argsStr);
          }
          
          const result = await originalMethod.apply(this, args);
          
          if (includeResult) {
            const resultStr = JSON.stringify(result).slice(0, maxArgLength);
            console[level](`[${methodName}] Returned:`, resultStr);
          }
          
          const duration = Date.now() - startTime;
          console[level](`[${methodName}] Completed in ${duration}ms`);
          
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`[${methodName}] Failed after ${duration}ms:`, error.message);
          config.onError?.(error as Error, methodName);
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export function AuditLog(config: { userId?: string; action?: string } = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('auditLogDecorator', async () => {
        const timestamp = new Date().toISOString();
        const auditEntry = {
          timestamp,
          method: methodName,
          action: config.action || propertyKey,
          userId: config.userId || 'system',
          args: args.length
        };
        
        console.info('[AUDIT]', JSON.stringify(auditEntry));
        
        try {
          const result = await originalMethod.apply(this, args);
          console.info('[AUDIT]', JSON.stringify({ ...auditEntry, status: 'success' }));
          return result;
        } catch (error) {
          console.error('[AUDIT]', JSON.stringify({ ...auditEntry, status: 'error', error: error.message }));
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export { monitor as loggingDecoratorMonitor };