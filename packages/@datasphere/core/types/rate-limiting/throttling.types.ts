/** @fileoverview Types for adaptive request throttling. */

export interface ThrottlingConfig {
  readonly enabled: boolean;
  readonly highWatermark: number; // e.g., 80% CPU or memory usage
  readonly lowWatermark: number;
  readonly backpressureStrategy: 'REJECT_REQUEST' | 'QUEUE_REQUEST' | 'DEGRADE_SERVICE';
}

export interface SystemHealthMetrics {
  readonly cpuUsage: number; // 0-1
  readonly memoryUsage: number; // 0-1
  readonly activeConnections: number;
  readonly queueDepth: number;
}
