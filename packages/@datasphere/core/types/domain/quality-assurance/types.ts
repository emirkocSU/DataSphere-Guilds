/** @fileoverview Core types for Quality Assurance. */
import { Uuid, IsoTimestamp, Percentage } from '../../../types/common.types';

export type QAStage = 'PRE_PROCESSING' | 'IN_REVIEW' | 'POST_PROCESSING';

export interface QAProcess {
  processId: Uuid;
  submissionId: Uuid;
  stage: QAStage;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  overallScore: Percentage;
  startedAt: IsoTimestamp;
  completedAt?: IsoTimestamp;
}
