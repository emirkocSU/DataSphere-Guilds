/** @fileoverview Types for reporting and data exports. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type ReportFormat = 'PDF' | 'CSV' | 'JSON';

export interface ReportRequest {
  readonly reportId: Uuid;
  readonly name: string;
  readonly format: ReportFormat;
  readonly period: { start: IsoTimestamp; end: IsoTimestamp; };
  readonly filters?: Record<string, any>;
}

export interface ReportStatus {
  readonly reportId: Uuid;
  readonly status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  readonly downloadUrl?: string;
  readonly generatedAt?: IsoTimestamp;
}
