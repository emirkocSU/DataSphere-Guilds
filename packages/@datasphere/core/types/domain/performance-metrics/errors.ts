/** @fileoverview Error types for Performance Metrics. */

export class PerformanceMetricsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PerformanceMetricsError';
  }
}
