/** @fileoverview Types for AI/ML model training. */
import { UUID, ISOTimestamp } from '../../types/common.types';

export type TrainingStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface TrainingJob {
  readonly jobId: UUID;
  readonly modelId: UUID;
  readonly datasetId: UUID;
  readonly status: TrainingStatus;
  readonly startedAt: ISOTimestamp;
  readonly completedAt?: ISOTimestamp;
  readonly metrics?: Record<string, number>;
}
