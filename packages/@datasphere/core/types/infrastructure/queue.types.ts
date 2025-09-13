/** @fileoverview Types for message queues and job processing. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type QueueType = 'SQS' | 'KAFKA' | 'RABBITMQ' | 'REDIS_QUEUE';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface QueueConfig {
  readonly queueId: Uuid;
  readonly name: string;
  readonly type: QueueType;
  readonly maxRetries: number;
  readonly visibilityTimeoutSeconds: number;
  readonly deadLetterQueueEnabled: boolean;
}

export interface JobMetrics {
  readonly jobId: Uuid;
  readonly queueName: string;
  readonly status: JobStatus;
  readonly attempts: number;
  readonly processingTimeMs: number;
  readonly enqueuedAt: IsoTimestamp;
}
