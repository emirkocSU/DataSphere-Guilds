/** @fileoverview Types for monitoring the health and performance of job queues. */
import { Uuid } from '../common.types';

export interface JobQueueMetrics {
  readonly queueName: string;
  readonly pendingJobs: number;
  readonly activeJobs: number;
  readonly completedJobs: number;
  readonly failedJobs: number;
  readonly averageWaitTimeMs: number;
  readonly averageProcessingTimeMs: number;
}
