/** @fileoverview Types for caching mechanisms. */
import { Uuid } from '../../types/common.types';

export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO' | 'TTL';

export interface CacheConfig {
  readonly cacheId: Uuid;
  readonly name: string;
  readonly strategy: CacheStrategy;
  readonly maxSize: number; // Number of items or MB
  readonly defaultTtlSeconds: number;
  readonly distributed: boolean;
}

export interface CacheMetrics {
  readonly hits: number;
  readonly misses: number;
  readonly hitRate: number;
  readonly size: number; // Current size of cache
}
