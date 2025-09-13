/** @fileoverview Core types for System Resilience. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type FailureMode = 'NETWORK_OUTAGE' | 'SERVICE_FAILURE' | 'DATABASE_UNAVAILABLE';

export interface ResiliencePolicy {
  policyId: Uuid;
  name: string;
  failureMode: FailureMode;
  strategy: 'RETRY' | 'CIRCUIT_BREAKER' | 'FALLBACK';
  isActive: boolean;
  createdAt: IsoTimestamp;
}
