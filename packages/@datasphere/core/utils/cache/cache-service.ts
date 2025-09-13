/**
 * @fileoverview Enterprise Cache Service - Multi-Level Cache Orchestrator
 */

import { EventEmitter } from 'events';
import { CacheKey, CacheConfig, CacheStrategy, CacheLevel, CacheMetrics, WarmupTask, InvalidationRule } from './types';
import { L1MemoryCache, createL1Cache } from './l1-memory';
import { L2RedisCache, createL2Cache } from './l2-redis';

export class CacheService extends EventEmitter {
  private static instance: CacheService;
  private config: CacheConfig;
  private l1Cache?: L1MemoryCache;
  private l2Cache?: L2RedisCache;
  private warmupQueue: WarmupTask[] = [];
  private invalidationRules: InvalidationRule[] = [];

  private constructor(config: CacheConfig) {
    super();
    this.config = config;
    this.initializeLevels();
  }

  static getInstance(config?: CacheConfig): CacheService {
    if (!CacheService.instance) {
      if (!config) throw new Error('CacheService requires configuration');
      CacheService.instance = new CacheService(config);
    }
    return CacheService.instance;
  }

  async get<T>(key: CacheKey, loader?: () => Promise<T>): Promise<T | null> {
    if (!this.config.enabled) {
      return loader ? await loader() : null;
    }

    // Try L1 first
    if (this.l1Cache) {
      const l1Result = await this.l1Cache.get<T>(key);
      if (l1Result !== null) {
        this.emit('cache-hit', { level: CacheLevel.L1_MEMORY, key });
        return l1Result;
      }
    }

    // Try L2
    if (this.l2Cache) {
      const l2Result = await this.l2Cache.get<T>(key);
      if (l2Result !== null) {
        // Populate L1
        if (this.l1Cache) {
          await this.l1Cache.set(key, l2Result);
        }
        this.emit('cache-hit', { level: CacheLevel.L2_REDIS, key });
        return l2Result;
      }
    }

    // Cache miss - use loader
    if (loader) {
      const value = await loader();
      await this.set(key, value);
      this.emit('cache-miss', { key, loaded: true });
      return value;
    }

    this.emit('cache-miss', { key, loaded: false });
    return null;
  }

  async set<T>(key: CacheKey, value: T, ttl?: number): Promise<void> {
    if (!this.config.enabled) return;

    const tasks = [];

    // Set in L1
    if (this.l1Cache) {
      tasks.push(this.l1Cache.set(key, value, ttl));
    }

    // Set in L2 based on strategy
    if (this.l2Cache && this.shouldWriteToL2()) {
      tasks.push(this.l2Cache.set(key, value, ttl));
    }

    await Promise.allSettled(tasks);
    this.emit('cache-set', { key, levels: this.getActiveLevels() });
  }

  async delete(key: CacheKey): Promise<void> {
    const tasks = [];

    if (this.l1Cache) {
      tasks.push(this.l1Cache.delete(key));
    }

    if (this.l2Cache) {
      tasks.push(this.l2Cache.delete(key));
    }

    await Promise.allSettled(tasks);
    this.emit('cache-delete', { key });
  }

  async clear(): Promise<void> {
    const tasks = [];

    if (this.l1Cache) {
      tasks.push(this.l1Cache.clear());
    }

    if (this.l2Cache) {
      tasks.push(this.l2Cache.clear());
    }

    await Promise.allSettled(tasks);
    this.emit('cache-clear');
  }

  async invalidate(pattern: string): Promise<number> {
    let count = 0;
    
    // Simple pattern matching for keys
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    // For a full implementation, you'd need to scan all keys
    // This is a simplified version
    this.emit('cache-invalidate', { pattern, count });
    
    return count;
  }

  async warmup(task: WarmupTask): Promise<void> {
    this.warmupQueue.push(task);
    await this.processWarmup(task);
  }

  async mget<T>(keys: CacheKey[]): Promise<Record<CacheKey, T | null>> {
    if (!this.config.enabled) return {};

    const result: Record<CacheKey, T | null> = {};
    const l1Misses: CacheKey[] = [];

    // Try L1 first
    if (this.l1Cache) {
      for (const key of keys) {
        const value = await this.l1Cache.get<T>(key);
        if (value !== null) {
          result[key] = value;
        } else {
          l1Misses.push(key);
        }
      }
    } else {
      l1Misses.push(...keys);
    }

    // Try L2 for misses
    if (this.l2Cache && l1Misses.length > 0) {
      const l2Results = await this.l2Cache.mget<T>(l1Misses);
      
      for (let i = 0; i < l1Misses.length; i++) {
        const key = l1Misses[i];
        const value = l2Results[i];
        
        if (value !== null) {
          result[key] = value;
          // Populate L1
          if (this.l1Cache) {
            await this.l1Cache.set(key, value);
          }
        } else {
          result[key] = null;
        }
      }
    }

    return result;
  }

  async mset<T>(entries: Array<{ key: CacheKey; value: T; ttl?: number }>): Promise<void> {
    if (!this.config.enabled) return;

    const tasks = [];

    // Set in L1
    if (this.l1Cache) {
      for (const entry of entries) {
        tasks.push(this.l1Cache.set(entry.key, entry.value, entry.ttl));
      }
    }

    // Set in L2
    if (this.l2Cache && this.shouldWriteToL2()) {
      tasks.push(this.l2Cache.mset(entries));
    }

    await Promise.allSettled(tasks);
    this.emit('cache-mset', { count: entries.length });
  }

  getMetrics(): Record<string, CacheMetrics> {
    const metrics: Record<string, CacheMetrics> = {};

    if (this.l1Cache) {
      metrics.l1 = this.l1Cache.getMetrics();
    }

    if (this.l2Cache) {
      metrics.l2 = this.l2Cache.getMetrics();
    }

    return metrics;
  }

  addInvalidationRule(rule: InvalidationRule): void {
    this.invalidationRules.push(rule);
  }

  removeInvalidationRule(pattern: string): void {
    this.invalidationRules = this.invalidationRules.filter(rule => rule.pattern !== pattern);
  }

  private async initializeLevels(): Promise<void> {
    // Initialize L1
    if (this.config.levels.l1.enabled) {
      this.l1Cache = createL1Cache(this.config.levels.l1);
      this.l1Cache.on('evict', (data) => this.emit('l1-evict', data));
    }

    // Initialize L2
    if (this.config.levels.l2.enabled) {
      this.l2Cache = createL2Cache(this.config.levels.l2);
      await this.l2Cache.connect();
      this.l2Cache.on('error', (error) => this.emit('l2-error', error));
    }
  }

  private shouldWriteToL2(): boolean {
    switch (this.config.strategy) {
      case CacheStrategy.WRITE_THROUGH:
      case CacheStrategy.WRITE_BEHIND:
        return true;
      case CacheStrategy.WRITE_AROUND:
        return false;
      default:
        return true;
    }
  }

  private getActiveLevels(): CacheLevel[] {
    const levels: CacheLevel[] = [];
    
    if (this.l1Cache) levels.push(CacheLevel.L1_MEMORY);
    if (this.l2Cache) levels.push(CacheLevel.L2_REDIS);
    
    return levels;
  }

  private async processWarmup(task: WarmupTask): Promise<void> {
    try {
      const data = await task.loader(task.keys);
      const entries = Object.entries(data).map(([key, value]) => ({ key, value }));
      await this.mset(entries);
      this.emit('warmup-completed', { taskId: task.id, count: entries.length });
    } catch (error) {
      this.emit('warmup-failed', { taskId: task.id, error });
    }
  }
}

export const createCacheService = (config: Partial<CacheConfig> = {}): CacheService => {
  const defaultConfig: CacheConfig = {
    enabled: true,
    strategy: CacheStrategy.WRITE_THROUGH,
    levels: {
      l1: {
        enabled: true,
        maxSize: 100 * 1024 * 1024, // 100MB
        ttl: 300,
        maxEntries: 10000,
        evictionPolicy: 'LRU'
      },
      l2: {
        enabled: true,
        host: 'localhost',
        port: 6379,
        db: 0,
        keyPrefix: 'ds',
        ttl: 3600,
        maxRetries: 3,
        retryDelay: 1000
      },
      l3: {
        enabled: false,
        provider: 'cloudflare',
        endpoint: '',
        apiKey: '',
        ttl: 86400
      }
    },
    serialization: {
      compress: false,
      algorithm: 'gzip'
    },
    ...config
  };

  return CacheService.getInstance(defaultConfig);
};

export default CacheService;