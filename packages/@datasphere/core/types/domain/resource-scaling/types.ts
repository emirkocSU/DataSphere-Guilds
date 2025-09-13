/** @fileoverview Core types for Resource Scaling. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ScalingMetric = 'CPU_UTILIZATION' | 'REQUEST_LATENCY' | 'QUEUE_DEPTH';
export type ScalingAction = 'SCALE_UP' | 'SCALE_DOWN';

export interface ScalingPolicy {
  policyId: Uuid;
  name: string;
  metric: ScalingMetric;
  threshold: number;
  action: ScalingAction;
  cooldownPeriodSeconds: number;
  isActive: boolean;
}
