/** @fileoverview Types for system monitoring and alerting. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type MetricType = 'CPU' | 'MEMORY' | 'DISK' | 'NETWORK' | 'CUSTOM';

export interface SystemMetric {
  readonly metricId: Uuid;
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: IsoTimestamp;
}

export interface AlertConfig {
  readonly alertId: Uuid;
  readonly name: string;
  readonly metric: string;
  readonly threshold: number;
  readonly operator: 'GREATER_THAN' | 'LESS_THAN';
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly enabled: boolean;
}
