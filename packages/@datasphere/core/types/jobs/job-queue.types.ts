/** @fileoverview Types for job queues. */
import { Uuid, IsoTimestamp } from '../common.types';

export type JobType = 'GENERATE_REPORT' | 'PROCESS_VIDEO' | 'SYNC_DATABASE';
export type JobStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DELAYED';

export interface Job<T = any> {
  readonly jobId: Uuid;
  readonly type: JobType;
  readonly payload: T;
  readonly status: JobStatus;
  readonly priority: number; // 1 (highest) to 5 (lowest)
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly createdAt: IsoTimestamp;
  readonly processAt: IsoTimestamp;
  readonly completedAt?: IsoTimestamp;
}
