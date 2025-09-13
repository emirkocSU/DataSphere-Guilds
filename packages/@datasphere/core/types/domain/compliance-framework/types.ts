/** @fileoverview Core types for Compliance Framework. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ComplianceStandard = 'GDPR' | 'HIPAA' | 'PCI_DSS';

export interface CompliancePolicy {
  policyId: Uuid;
  name: string;
  standard: ComplianceStandard;
  version: string;
  isActive: boolean;
  effectiveDate: IsoTimestamp;
}
