/**
 * @fileoverview L1 Memory Cache - High-Performance In-Memory Cache
 */

import { EventEmitter } from 'events';
import { CacheKey, CacheEntry, CacheMetrics, L1Config } from './types';

export class L1MemoryCache extends EventEmitter {
  private config: L1Config;
  private cache = new Map<CacheKey, CacheEntry>();
  private accessOrder = new Map<CacheKey, number>();
  private metrics: CacheMetrics;
  private accessCounter = 0;

  constructor(config: L1Config) {
    super();
    this.config = config;
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0
    };
    
    setInterval(() => this.cleanup(), 60000);
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      this.updateHitRate();
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.metrics.misses++;
      this.metrics.evictions++;
      this.updateHitRate();
      return null;
    }

    // Update access tracking
    entry.lastAccessed = new Date().toISOString();
    entry.accessCount++;
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.metrics.hits++;
    this.updateHitRate();
    
    return entry.value;
  }

  async set<T>(key: CacheKey, value: T, ttl?: number): Promise<void> {
    const size = this.calculateSize(value);
    
    // Check size limits
    if (size > this.config.maxSize) {
      throw new Error('Value too large for cache');
    }

    // Evict if necessary
    await this.evictIfNeeded(size);

    const entry: CacheEntry<T> = {
      key,
      value,
      ttl: ttl || this.config.ttl,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 0,
      size
    };

    this.cache.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
    
    this.metrics.sets++;
    this.metrics.totalSize += size;
    this.metrics.entryCount = this.cache.size;
    
    this.emit('set', { key, size });
  }

  async delete(key: CacheKey): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.accessOrder.delete(key);
    
    this.metrics.deletes++;
    this.metrics.totalSize -= entry.size;
    this.metrics.entryCount = this.cache.size;
    
    this.emit('delete', { key });
    return true;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.accessOrder.clear();
    this.metrics.totalSize = 0;
    this.metrics.entryCount = 0;
    this.emit('clear');
  }

  async has(key: CacheKey): Promise<boolean> {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  private async evictIfNeeded(newSize: number): Promise<void> {
    // Check entry count
    if (this.cache.size >= this.config.maxEntries) {
      await this.evictEntries(1);
    }

    // Check total size
    while (this.metrics.totalSize + newSize > this.config.maxSize && this.cache.size > 0) {
      await this.evictEntries(1);
    }
  }

  private async evictEntries(count: number): Promise<void> {
    const keysToEvict = this.selectEvictionCandidates(count);
    
    for (const key of keysToEvict) {
      const entry = this.cache.get(key);
      if (entry) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        this.metrics.totalSize -= entry.size;
        this.metrics.evictions++;
        this.emit('evict', { key, reason: this.config.evictionPolicy });
      }
    }
    
    this.metrics.entryCount = this.cache.size;
  }

  private selectEvictionCandidates(count: number): CacheKey[] {
    const entries = Array.from(this.cache.entries());
    
    switch (this.config.evictionPolicy) {
      case 'LRU':
        return entries
          .sort((a, b) => (this.accessOrder.get(a[0]) || 0) - (this.accessOrder.get(b[0]) || 0))
          .slice(0, count)
          .map(([key]) => key);
          
      case 'LFU':
        return entries
          .sort((a, b) => a[1].accessCount - b[1].accessCount)
          .slice(0, count)
          .map(([key]) => key);
          
      case 'FIFO':
        return entries
          .sort((a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime())
          .slice(0, count)
          .map(([key]) => key);
          
      default:
        return Array.from(this.cache.keys()).slice(0, count);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: CacheKey[] = [];

    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.delete(key);
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    if (entry.ttl <= 0) return false;
    const expiryTime = new Date(entry.createdAt).getTime() + entry.ttl * 1000;
    return Date.now() > expiryTime;
  }

  private calculateSize(value: any): number {
    return JSON.stringify(value).length * 2; // Rough estimate
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0;
  }
}

export const createL1Cache = (config: L1Config): L1MemoryCache => {
  return new L1MemoryCache(config);
};