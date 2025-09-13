/** @fileoverview Event types for Performance Metrics. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { PerformanceMetric } from './types';

export interface MetricRecordedEvent {
  eventId: Uuid;
  metric: PerformanceMetric;
  timestamp: IsoTimestamp;
}
