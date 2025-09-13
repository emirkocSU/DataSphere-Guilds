
import { z } from 'zod';

/**
 * Schema for defining a single monitoring threshold.
 */
const ThresholdSchema = z.object({
  /** The warning level for this metric (e.g., 80 for 80% CPU usage). */
  warn: z.number(),
  /** The critical/alert level for this metric (e.g., 95 for 95% CPU usage). */
  critical: z.number(),
});

/**
 * Schema for API performance monitoring thresholds.
 */
const ApiMonitoringSchema = z.object({
  /** Thresholds for API error rate (as a percentage, 0-100). */
  errorRatePercentage: ThresholdSchema,
  /** Thresholds for p95 (95th percentile) latency in milliseconds. */
  p95LatencyMs: ThresholdSchema,
});

/**
 * Schema for system resource monitoring thresholds.
 */
const SystemMonitoringSchema = z.object({
  /** Thresholds for CPU utilization (as a percentage, 0-100). */
  cpuUsagePercentage: ThresholdSchema,
  /** Thresholds for memory utilization (as a percentage, 0-100). */
  memoryUsagePercentage: ThresholdSchema,
});

/**
 * Main schema for the monitoring thresholds configuration file.
 */
export const MonitoringConfigSchema = z.object({
  api: ApiMonitoringSchema,
  system: SystemMonitoringSchema,
});

export type MonitoringConfig = z.infer<typeof MonitoringConfigSchema>;

/**
 * Default monitoring thresholds configuration.
 */
export const defaultMonitoringConfig: MonitoringConfig = {
  api: {
    errorRatePercentage: {
      warn: 5, // 5% error rate
      critical: 10, // 10% error rate
    },
    p95LatencyMs: {
      warn: 1000, // 1 second
      critical: 3000, // 3 seconds
    },
  },
  system: {
    cpuUsagePercentage: {
      warn: 80,
      critical: 95,
    },
    memoryUsagePercentage: {
      warn: 85,
      critical: 98,
    },
  },
};
