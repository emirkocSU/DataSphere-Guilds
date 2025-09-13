/**
 * @fileoverview Rate Limiter
 */

import { RateLimitConfig, RequestContext } from './types';

interface RateLimitState {
  requests: number;
  windowStart: number;
  burstTokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private state = new Map<string, RateLimitState>();

  async isAllowed(config: RateLimitConfig, context: RequestContext): Promise<boolean> {
    if (!config.enabled) return true;

    const key = this.getKey(config, context);
    const now = Date.now();
    const state = this.getState(key, now);

    // Token bucket algorithm for burst
    this.refillBucket(state, config, now);

    // Sliding window for rate limiting
    const windowStart = Math.floor(now / (config.window * 1000)) * (config.window * 1000);
    
    if (state.windowStart !== windowStart) {
      state.windowStart = windowStart;
      state.requests = 0;
    }

    // Check rate limit
    if (state.requests >= config.requests) {
      return false;
    }

    // Check burst limit
    if (state.burstTokens <= 0) {
      return false;
    }

    // Allow request
    state.requests++;
    state.burstTokens--;
    this.state.set(key, state);

    return true;
  }

  private getKey(config: RateLimitConfig, context: RequestContext): string {
    switch (config.keyBy) {
      case 'ip':
        return `ip:${context.ip}`;
      case 'user':
        return `user:${context.user?.id || 'anonymous'}`;
      case 'api_key':
        return `api_key:${context.headers['x-api-key'] || 'none'}`;
      default:
        return `ip:${context.ip}`;
    }
  }

  private getState(key: string, now: number): RateLimitState {
    return this.state.get(key) || {
      requests: 0,
      windowStart: 0,
      burstTokens: 0,
      lastRefill: now
    };
  }

  private refillBucket(state: RateLimitState, config: RateLimitConfig, now: number): void {
    const timeSinceRefill = now - state.lastRefill;
    const refillRate = config.burst / (config.window * 1000); // tokens per ms
    const tokensToAdd = Math.floor(timeSinceRefill * refillRate);
    
    if (tokensToAdd > 0) {
      state.burstTokens = Math.min(config.burst, state.burstTokens + tokensToAdd);
      state.lastRefill = now;
    }
  }

  getRemainingRequests(config: RateLimitConfig, context: RequestContext): number {
    if (!config.enabled) return config.requests;

    const key = this.getKey(config, context);
    const state = this.state.get(key);
    
    if (!state) return config.requests;

    return Math.max(0, config.requests - state.requests);
  }

  getResetTime(config: RateLimitConfig, context: RequestContext): number {
    if (!config.enabled) return 0;

    const key = this.getKey(config, context);
    const state = this.state.get(key);
    
    if (!state) return 0;

    return state.windowStart + (config.window * 1000);
  }

  cleanup(): void {
    const now = Date.now();
    const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours
    
    for (const [key, state] of this.state) {
      if (state.lastRefill < cutoff) {
        this.state.delete(key);
      }
    }
  }
}

export const createRateLimiter = (): RateLimiter => {
  return new RateLimiter();
};