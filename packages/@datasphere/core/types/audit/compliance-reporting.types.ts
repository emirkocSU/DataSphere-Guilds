/** @fileoverview Types for generating compliance reports. */
import { Uuid, IsoTimestamp } from '../common.types';

export type RegulatoryFramework = 'GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS';

export interface ComplianceReportRequest {
  readonly framework: RegulatoryFramework;
  readonly period: { startDate: IsoTimestamp; endDate: IsoTimestamp };
  readonly reportType: 'DATA_ACCESS' | 'USER_CONSENT' | 'SECURITY_INCIDENT';
}

export interface ComplianceReport {
  readonly reportId: Uuid;
  readonly request: ComplianceReportRequest;
  readonly generatedAt: IsoTimestamp;
  readonly data: any[]; // Array of log entries or records
}
