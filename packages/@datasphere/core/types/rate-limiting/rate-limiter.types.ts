/** @fileoverview Types for rate limiting strategies. */

export type RateLimitingStrategy = 'TOKEN_BUCKET' | 'SLIDING_WINDOW_LOG' | 'FIXED_WINDOW_COUNTER';

export interface RateLimiterConfig {
  readonly strategy: RateLimitingStrategy;
  readonly points: number; // Max requests
  readonly duration: number; // Per seconds
  readonly blockDuration?: number; // Seconds to block if limit is exceeded
}

export interface UserQuota {
  readonly userId: string;
  readonly endpoint: string;
  readonly allowedRequests: number;
  readonly remainingRequests: number;
  readonly resetTimestamp: number;
}
