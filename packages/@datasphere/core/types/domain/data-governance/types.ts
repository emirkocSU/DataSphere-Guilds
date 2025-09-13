/** @fileoverview Core types for Data Governance. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type DataClassificationLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SENSITIVE' | 'RESTRICTED';

export interface DataPolicy {
  policyId: Uuid;
  name: string;
  description: string;
  classificationLevel: DataClassificationLevel;
  retentionPeriodDays: number;
  isActive: boolean;
}
