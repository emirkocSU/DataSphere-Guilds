/** @fileoverview Interfaces for Security Policies services. */
import { Uuid } from '../../../types/common.types';
import { SecurityPolicy, PolicyType } from './types';

export interface ISecurityPolicyService {
  createPolicy(policy: Omit<SecurityPolicy, 'policyId' | 'effectiveDate'>): Promise<SecurityPolicy>;
  getPolicy(policyId: Uuid): Promise<SecurityPolicy | null>;
  enforcePolicy(policyId: Uuid, context: Record<string, any>): Promise<boolean>;
  listPolicies(type?: PolicyType): Promise<SecurityPolicy[]>;
}
