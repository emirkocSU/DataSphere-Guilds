/** @fileoverview Types for data privacy and regulatory compliance. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type ComplianceStandard = 'GDPR' | 'HIPAA' | 'PCI_DSS';

export interface DataPrivacyPolicy {
  readonly policyId: Uuid;
  readonly standard: ComplianceStandard;
  readonly description: string;
  readonly effectiveDate: IsoTimestamp;
  readonly dataCategories: string[]; // e.g., 'PII', 'PHI'
}

export interface AuditLogEntry {
  readonly logId: Uuid;
  readonly timestamp: IsoTimestamp;
  readonly userId: Uuid;
  readonly action: string;
  readonly resource: string;
  readonly outcome: 'SUCCESS' | 'FAILURE';
}
