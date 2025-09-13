/** @fileoverview Interfaces for System Resilience services. */
import { Uuid } from '../../../types/common.types';
import { ResiliencePolicy, FailureMode } from './types';

export interface IResilienceService {
  createPolicy(policy: Omit<ResiliencePolicy, 'policyId' | 'createdAt'>): Promise<ResiliencePolicy>;
  evaluateResilience(failureMode: FailureMode, context: Record<string, any>): Promise<boolean>;
  listPolicies(failureMode?: FailureMode): Promise<ResiliencePolicy[]>;
}
