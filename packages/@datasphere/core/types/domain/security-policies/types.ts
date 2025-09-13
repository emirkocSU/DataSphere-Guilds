/** @fileoverview Core types for Security Policies. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type PolicyType = 'ACCESS_CONTROL' | 'DATA_ENCRYPTION' | 'AUDIT_LOGGING';

export interface SecurityPolicy {
  policyId: Uuid;
  name: string;
  type: PolicyType;
  description: string;
  isActive: boolean;
  effectiveDate: IsoTimestamp;
  rules: Record<string, any>; // Policy rules definition
}
