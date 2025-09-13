/**
 * @fileoverview Lean, high-performance metrics collector for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { MetricType } from "../../types/performance/performance.types";

export class MetricsCollector {
  private metrics = new Map<string, any>();

  record(metric: {
    name: string;
    value: number;
    labels?: Record<string, string>;
    type?: MetricType;
  }): void {
    const key = `${metric.name}_${JSON.stringify(metric.labels || {})}`;
    this.metrics.set(key, {
      ...metric,
      timestamp: new Date()
    });
  }

  getMetric(name: string): any {
    return this.metrics.get(name);
  }

  getAllMetrics(): Map<string, any> {
    return this.metrics;
  }

  clear(): void {
    this.metrics.clear();
  }
}
