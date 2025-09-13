/** @fileoverview Core types for Business Intelligence. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ReportType = 'SALES' | 'OPERATIONAL' | 'FINANCIAL';

export interface BIReport {
  reportId: Uuid;
  name: string;
  type: ReportType;
  generatedAt: IsoTimestamp;
  data: Record<string, any>;
  filters?: Record<string, any>;
}
