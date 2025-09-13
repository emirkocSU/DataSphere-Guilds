/**
 * @fileoverview Enterprise-grade, adapter-based performance monitor.
 * Supports multiple metric types (counter, gauge, histogram) and backends.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { Logger } from '../logging/logger';

export type MetricTag = Record<string, string | number>;

export interface Counter {
  type: 'COUNTER';
  name: string;
  help?: string;
  tags?: MetricTag;
}

export interface Gauge {
  type: 'GAUGE';
  name: string;
  help?: string;
  tags?: MetricTag;
}

export interface Histogram {
  type: 'HISTOGRAM';
  name: string;
  help?: string;
  buckets?: number[];
  tags?: MetricTag;
}

export type Metric = Counter | Gauge | Histogram;

export interface MetricsProvider {
  increment(counter: Counter, value?: number): void;
  decrement(counter: Counter, value?: number): void;
  setGauge(gauge: Gauge, value: number): void;
  observe(histogram: Histogram, value: number): void;
}

export class ConsoleMetricsProvider implements MetricsProvider {
  private logger = new Logger('ConsoleMetricsProvider');
  private isEnabled: boolean;

  constructor(enabled: boolean = true) {
    this.isEnabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  increment(counter: Counter, value: number = 1): void {
    if (!this.isEnabled) return;
    this.logger.debug(`COUNTER: ${counter.name} incremented by ${value}`, { tags: counter.tags });
  }

  decrement(counter: Counter, value: number = 1): void {
    if (!this.isEnabled) return;
    this.logger.debug(`COUNTER: ${counter.name} decremented by ${value}`, { tags: counter.tags });
  }

  setGauge(gauge: Gauge, value: number): void {
    if (!this.isEnabled) return;
    this.logger.debug(`GAUGE: ${gauge.name} set to ${value}`, { tags: gauge.tags });
  }

  observe(histogram: Histogram, value: number): void {
    if (!this.isEnabled) return;
    this.logger.debug(`HISTOGRAM: ${histogram.name} observed ${value.toFixed(2)}ms`, {
      tags: histogram.tags,
      buckets: histogram.buckets,
    });
  }
}

export class PerformanceMonitor {
  private provider: MetricsProvider;
  private logger = new Logger('PerformanceMonitor');
  private namespace: string;

  constructor(namespace: string = 'default', provider?: MetricsProvider) {
    this.namespace = namespace;
    this.provider = provider || new ConsoleMetricsProvider();
    this.logger.info(`PerformanceMonitor initialized for namespace "${namespace}" with ${this.provider.constructor.name}.`);
  }

  increment(counter: Omit<Counter, 'type'>, value?: number): void {
    try {
      this.provider.increment({ type: 'COUNTER', ...counter }, value);
    } catch (error) {
      this.logger.error(`Failed to increment counter "${counter.name}"`, error);
    }
  }

  decrement(counter: Omit<Counter, 'type'>, value?: number): void {
    try {
      this.provider.decrement({ type: 'COUNTER', ...counter }, value);
    } catch (error) {
      this.logger.error(`Failed to decrement counter "${counter.name}"`, error);
    }
  }

  setGauge(gauge: Omit<Gauge, 'type'>, value: number): void {
    try {
      this.provider.setGauge({ type: 'GAUGE', ...gauge }, value);
    } catch (error) {
      this.logger.error(`Failed to set gauge "${gauge.name}"`, error);
    }
  }

  observe(histogram: Omit<Histogram, 'type'>, value: number): void {
    try {
      this.provider.observe({ type: 'HISTOGRAM', ...histogram }, value);
    } catch (error) {
      this.logger.error(`Failed to observe histogram "${histogram.name}"`, error);
    }
  }

  startTimer(histogram: Omit<Histogram, 'type'>): () => void {
    const start = process.hrtime();
    return () => {
      const end = process.hrtime(start);
      const durationInMs = (end[0] * 1e9 + end[1]) / 1e6;
      this.observe(histogram, durationInMs);
    };
  }

  /**
   * Measure execution time of a function and record as histogram
   */
  measure<T>(operationName: string, fn: () => T): T;
  measure<T>(operationName: string, fn: () => Promise<T>): Promise<T>;
  measure<T>(operationName: string, fn: () => T | Promise<T>): T | Promise<T> {
    const histogramName = `${this.namespace}_${operationName}_duration_ms`;
    const histogram: Omit<Histogram, 'type'> = {
      name: histogramName,
      help: `Execution time for ${operationName} operation in ${this.namespace}`,
      tags: { namespace: this.namespace, operation: operationName }
    };

    const start = process.hrtime();
    const endTimer = () => {
      const end = process.hrtime(start);
      const durationInMs = (end[0] * 1e9 + end[1]) / 1e6;
      this.observe(histogram, durationInMs);
    };

    try {
      const result = fn();
      
      if (result && typeof result === 'object' && 'then' in result) {
        // Handle Promise
        return (result as Promise<T>)
          .then((value) => {
            endTimer();
            return value;
          })
          .catch((error) => {
            endTimer();
            throw error;
          });
      } else {
        // Handle synchronous result
        endTimer();
        return result;
      }
    } catch (error) {
      endTimer();
      throw error;
    }
  }

  /**
   * Create a child monitor with a sub-namespace
   */
  createChild(childNamespace: string): PerformanceMonitor {
    const fullNamespace = `${this.namespace}.${childNamespace}`;
    return new PerformanceMonitor(fullNamespace, this.provider);
  }

  /**
   * Record a custom metric value
   */
  recordValue(metricName: string, value: number, type: 'counter' | 'gauge' | 'histogram' = 'histogram'): void {
    const fullName = `${this.namespace}_${metricName}`;
    
    try {
      switch (type) {
        case 'counter':
          this.increment({ name: fullName }, value);
          break;
        case 'gauge':
          this.setGauge({ name: fullName }, value);
          break;
        case 'histogram':
          this.observe({ name: fullName }, value);
          break;
      }
    } catch (error) {
      this.logger.error(`Failed to record ${type} "${fullName}"`, error);
    }
  }

  /**
   * Get the namespace of this monitor
   */
  getNamespace(): string {
    return this.namespace;
  }
} 