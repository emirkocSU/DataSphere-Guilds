/**
 * @fileoverview Lean, high-performance metrics collection decorators for unicorn analytics
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../utils/performance/monitor';

const monitor = new PerformanceMonitor('MetricsDecorators');

export interface MetricsConfig {
  metricName?: string;
  tags?: Record<string, string>;
  sampleRate?: number;
  includeArgs?: boolean;
}

export function Metrics(config: MetricsConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    const shouldSample = config.sampleRate ? () => Math.random() < config.sampleRate : () => true;
    
    descriptor.value = async function (...args: any[]) {
      if (!shouldSample()) {
        return originalMethod.apply(this, args);
      }
      
      return monitor.measure('metricsDecorator', async () => {
        const startTime = performance.now();
        const metricName = config.metricName || `${methodName}_execution`;
        
        try {
          const result = await originalMethod.apply(this, args);
          
          const executionTime = performance.now() - startTime;
          monitor.recordValue(metricName, executionTime, 'histogram');
          monitor.recordValue(`${metricName}_success`, 1, 'counter');
          
          if (config.tags) {
            Object.entries(config.tags).forEach(([key, value]) => {
              monitor.recordValue(`${metricName}_${key}_${value}`, 1, 'counter');
            });
          }
          
          return result;
        } catch (error) {
          const executionTime = performance.now() - startTime;
          monitor.recordValue(`${metricName}_error`, 1, 'counter');
          monitor.recordValue(`${metricName}_error_time`, executionTime, 'histogram');
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export function BusinessMetrics(metricName: string, valueExtractor?: (result: any) => number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('businessMetricsDecorator', async () => {
        const result = await originalMethod.apply(this, args);
        
        const value = valueExtractor ? valueExtractor(result) : 1;
        monitor.recordValue(metricName, value, 'counter');
        
        return result;
      });
    };
    
    return descriptor;
  };
}

export { monitor as metricsDecoratorMonitor };