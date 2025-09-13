/** @fileoverview Types related to business QC processes. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type QCResultStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

export interface QCResult {
  qcId: Uuid;
  submissionId: Uuid;
  inspectorId: Uuid;
  status: QCResultStatus;
  score: number; // 0-100
  feedback: string;
  createdAt: IsoTimestamp;
}
