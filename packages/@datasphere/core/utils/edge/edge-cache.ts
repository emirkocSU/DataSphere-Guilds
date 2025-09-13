/**
 * @fileoverview Edge Cache System
 */

import { EventEmitter } from 'events';
import { EdgeCache, RegionId, EdgeRequest, EdgeResponse } from './types';

export class EdgeCacheManager extends EventEmitter {
  private static instance: EdgeCacheManager;
  private cache = new Map<string, EdgeCache>();
  private hitRates = new Map<RegionId, number>();
  private maxSize = 1000;

  private constructor() {
    super();
    this.startCleanupTask();
  }

  static getInstance(): EdgeCacheManager {
    if (!EdgeCacheManager.instance) {
      EdgeCacheManager.instance = new EdgeCacheManager();
    }
    return EdgeCacheManager.instance;
  }

  async get(key: string, region: RegionId): Promise<EdgeResponse | null> {
    const cacheKey = `${region}:${key}`;
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      this.updateHitRate(region, false);
      return null;
    }

    if (this.isExpired(cached)) {
      this.cache.delete(cacheKey);
      this.updateHitRate(region, false);
      return null;
    }

    cached.hits++;
    cached.accessedAt = new Date().toISOString();
    this.updateHitRate(region, true);
    
    this.emit('cache-hit', { key, region, cached });
    
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      body: cached.value,
      cached: true,
      processingTime: 1,
      size: cached.size
    };
  }

  async set(key: string, value: unknown, region: RegionId, ttl: number = 3600): Promise<void> {
    const cacheKey = `${region}:${key}`;
    const size = this.calculateSize(value);
    
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const cached: EdgeCache = {
      key: cacheKey,
      value,
      ttl,
      region,
      size,
      hits: 0,
      misses: 0,
      createdAt: new Date().toISOString(),
      accessedAt: new Date().toISOString()
    };

    this.cache.set(cacheKey, cached);
    this.emit('cache-set', { key, region, cached });
  }

  async invalidate(key: string, region?: RegionId): Promise<void> {
    if (region) {
      const cacheKey = `${region}:${key}`;
      this.cache.delete(cacheKey);
    } else {
      // Invalidate across all regions
      for (const [cacheKey] of this.cache) {
        if (cacheKey.endsWith(`:${key}`)) {
          this.cache.delete(cacheKey);
        }
      }
    }
    
    this.emit('cache-invalidated', { key, region });
  }

  getCacheStats(region?: RegionId): { hits: number; misses: number; size: number; hitRate: number } {
    let hits = 0;
    let misses = 0;
    let size = 0;

    for (const cached of this.cache.values()) {
      if (!region || cached.region === region) {
        hits += cached.hits;
        misses += cached.misses;
        size++;
      }
    }

    const hitRate = hits + misses > 0 ? hits / (hits + misses) : 0;
    return { hits, misses, size, hitRate };
  }

  getHitRate(region: RegionId): number {
    return this.hitRates.get(region) || 0;
  }

  private isExpired(cached: EdgeCache): boolean {
    const now = Date.now();
    const created = new Date(cached.createdAt).getTime();
    return now - created > cached.ttl * 1000;
  }

  private calculateSize(value: unknown): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 1024; // Default size
    }
  }

  private evictLeastUsed(): void {
    let leastUsed: EdgeCache | null = null;
    let leastUsedKey = '';
    
    for (const [key, cached] of this.cache) {
      if (!leastUsed || cached.hits < leastUsed.hits) {
        leastUsed = cached;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      this.emit('cache-evicted', { key: leastUsedKey, cached: leastUsed });
    }
  }

  private updateHitRate(region: RegionId, isHit: boolean): void {
    const currentRate = this.hitRates.get(region) || 0;
    const newRate = isHit ? Math.min(1, currentRate + 0.01) : Math.max(0, currentRate - 0.01);
    this.hitRates.set(region, newRate);
  }

  private startCleanupTask(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache) {
        if (this.isExpired(cached)) {
          this.cache.delete(key);
          this.emit('cache-expired', { key, cached });
        }
      }
    }, 60000); // Clean up every minute
  }
}

export const createEdgeCacheManager = (): EdgeCacheManager => {
  return EdgeCacheManager.getInstance();
};