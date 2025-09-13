/** @fileoverview Types related to the investigation of an appeal. */
import { UUID, ISOTimestamp } from '../common.types';

export type EvidenceType = 'SCREENSHOT' | 'LOG_FILE' | 'VIDEO' | 'WORKER_STATEMENT' | 'SYSTEM_METADATA';

export interface Evidence {
  readonly evidenceId: UUID;
  readonly appealId: UUID;
  readonly submittedBy: UUID;
  readonly type: EvidenceType;
  readonly description: string;
  readonly url?: string; // Link to stored evidence file
  readonly content?: string; // For text-based evidence
  readonly createdAt: ISOTimestamp;
}

export interface InvestigationCase {
    readonly caseId: UUID;
  readonly appealId: UUID;
  readonly leadInvestigatorId: UUID;
  readonly evidencePackage: Evidence[];
  readonly findings: string;
  readonly recommendation: string;
  readonly status: 'OPEN' | 'CLOSED';
}
