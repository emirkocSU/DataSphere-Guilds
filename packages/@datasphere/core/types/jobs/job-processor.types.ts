/** @fileoverview Types for job processors and workers. */
import { Uuid } from '../common.types';

export interface WorkerPoolConfig {
  readonly concurrency: number;
  readonly resourceLimits: { cpu: number; memoryMb: number; };
}

export interface JobProcessor {
  readonly processorId: Uuid;
  readonly type: string; // e.g., 'video-transcoder', 'report-generator'
  readonly isBusy: boolean;
  readonly currentJobId?: Uuid;
}
