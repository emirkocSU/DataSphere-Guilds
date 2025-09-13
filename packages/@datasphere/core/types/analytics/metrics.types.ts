/** @fileoverview Types for core metrics and aggregations. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type MetricType = 'COUNTER' | 'GAUGE' | 'SUMMARY' | 'HISTOGRAM';
export type AggregationType = 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT';

export interface Metric {
  readonly metricId: Uuid;
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly timestamp: IsoTimestamp;
  readonly labels?: Record<string, string>;
}

export interface TimeSeriesData {
  readonly metricId: Uuid;
  readonly dataPoints: { timestamp: IsoTimestamp; value: number; }[];
}
