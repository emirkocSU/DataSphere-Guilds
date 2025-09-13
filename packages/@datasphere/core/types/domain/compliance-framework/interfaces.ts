/** @fileoverview Interfaces for Compliance Framework services. */
import { Uuid } from '../../../types/common.types';
import { CompliancePolicy, ComplianceStandard } from './types';

export interface IComplianceService {
  evaluateCompliance(standard: ComplianceStandard, data: Record<string, any>): Promise<boolean>;
  getPolicy(policyId: Uuid): Promise<CompliancePolicy | null>;
  listPolicies(standard?: ComplianceStandard): Promise<CompliancePolicy[]>;
}
