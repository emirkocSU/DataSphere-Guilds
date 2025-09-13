/** @fileoverview Core types for Performance Metrics. */
import { Uuid, IsoTimestamp, Percentage } from '../../../types/common.types';

export type MetricGranularity = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface PerformanceMetric {
  metricId: Uuid;
  name: string;
  value: number;
  unit: string;
  timestamp: IsoTimestamp;
  granularity: MetricGranularity;
}