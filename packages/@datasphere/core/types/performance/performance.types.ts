/**
 * @fileoverview Lean, high-performance types for DataSphere unicorn-scale performance monitoring
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export interface PerformanceConfig {
  sampleRate?: number;
  enableMemoryTracking?: boolean;
  enableCPUTracking?: boolean;
  thresholds?: PerformanceThresholds;
}

export interface PerformanceThresholds {
  maxExecutionTime?: number;
  maxMemoryUsage?: number;
  maxCPUUsage?: number;
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
  timestamp: Date;
}

export type MetricType = "counter"  < /dev/null |  "gauge" | "histogram" | "timer";
