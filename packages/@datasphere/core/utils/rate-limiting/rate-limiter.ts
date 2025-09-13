/**
 * @fileoverview Enterprise-grade, provider-based rate limiter for distributed systems.
 * Supports multiple backends (e.g., Redis) and uses the sliding window log algorithm.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { Logger } from '../logging/logger';

export interface RateLimiterProvider {
  isBlocked(key: string, windowMs: number, maxRequests: number): Promise<RateLimitResult>;
}

export interface RateLimitResult {
  isBlocked: boolean;
  requestsInWindow: number;
  retryAfterMs?: number;
}

// A Redis-based provider would be used in a real production environment.
// This requires a Redis client like `ioredis`.
/*
import Redis from 'ioredis';

export class RedisRateLimiterProvider implements RateLimiterProvider {
  constructor(private redis: Redis) {}

  async isBlocked(key: string, windowMs: number, maxRequests: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - windowMs;

    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart); // Remove old requests
    pipeline.zadd(key, now, now.toString()); // Add current request
    pipeline.zcard(key); // Count requests in window
    pipeline.expire(key, Math.ceil(windowMs / 1000)); // Set expiry

    const [, , [err, requestCount],] = await pipeline.exec();
    
    if (err) { throw new Error('Redis command failed'); }

    const isBlocked = requestCount > maxRequests;
    return { isBlocked, requestsInWindow: requestCount };
  }
}
*/

export class InMemoryRateLimiterProvider implements RateLimiterProvider {
  private store = new Map<string, number[]>();

  async isBlocked(key: string, windowMs: number, maxRequests: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - windowMs;

    let requests = this.store.get(key) || [];
    requests = requests.filter(timestamp => timestamp > windowStart);
    requests.push(now);
    
    this.store.set(key, requests);

    const isBlocked = requests.length > maxRequests;
    return { isBlocked, requestsInWindow: requests.length };
  }
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  provider?: RateLimiterProvider;
}

export class RateLimiter {
  private provider: RateLimiterProvider;
  private logger = new Logger('RateLimiter');

  constructor(provider?: RateLimiterProvider) {
    this.provider = provider || new InMemoryRateLimiterProvider();
    this.logger.info(`RateLimiter initialized with ${this.provider.constructor.name}.`);
  }

  async check(key: string, options: Omit<RateLimiterOptions, 'provider'>): Promise<RateLimitResult> {
    try {
      const result = await this.provider.isBlocked(key, options.windowMs, options.maxRequests);
      if (result.isBlocked) {
        this.logger.warn(`Rate limit exceeded for key: ${key}`, { key, ...options });
      }
      return result;
    } catch (error) {
      this.logger.error(`Rate limiting check failed for key "${key}"`, error);
      // Fail open: If the rate limiter fails, allow the request.
      return { isBlocked: false, requestsInWindow: 0 };
    }
  }
} 