/** @fileoverview Interfaces for Performance Metrics services. */
import { Uuid } from '../../../types/common.types';
import { PerformanceMetric, MetricGranularity } from './types';

export interface IPerformanceMetricsService {
  recordMetric(metric: Omit<PerformanceMetric, 'metricId' | 'timestamp'>): Promise<PerformanceMetric>;
  getMetrics(name: string, granularity: MetricGranularity, startDate: IsoTimestamp, endDate: IsoTimestamp): Promise<PerformanceMetric[]>;
  getOverallPerformance(): Promise<Record<string, number>>;
}