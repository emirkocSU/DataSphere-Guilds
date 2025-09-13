/** @fileoverview Types for job retry strategies. */

export type BackoffStrategy = 'FIXED' | 'EXPONENTIAL';

export interface JobRetryStrategy {
  readonly maxAttempts: number;
  readonly backoffStrategy: BackoffStrategy;
  readonly baseDelayMs: number;
  readonly useDeadLetterQueue: boolean;
}
