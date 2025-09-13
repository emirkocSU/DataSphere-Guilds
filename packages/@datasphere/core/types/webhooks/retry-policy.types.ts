/** @fileoverview Types for webhook delivery retry policies. */

export type BackoffStrategy = 'FIXED' | 'EXPONENTIAL' | 'LINEAR';

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly backoffStrategy: BackoffStrategy;
  readonly baseIntervalMs: number;
  readonly maxIntervalMs?: number;
  readonly timeoutMs: number; // Timeout for each attempt
  readonly toDeadLetterQueue: boolean; // Move to DLQ after max attempts
}
