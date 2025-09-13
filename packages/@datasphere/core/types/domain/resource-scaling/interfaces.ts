/** @fileoverview Interfaces for Resource Scaling services. */
import { Uuid } from '../../../types/common.types';
import { ScalingPolicy, ScalingMetric } from './types';

export interface IScalingService {
  createScalingPolicy(policy: Omit<ScalingPolicy, 'policyId'>): Promise<ScalingPolicy>;
  evaluateScaling(metric: ScalingMetric, currentValue: number): Promise<ScalingAction | null>;
  listScalingPolicies(): Promise<ScalingPolicy[]>;
}
