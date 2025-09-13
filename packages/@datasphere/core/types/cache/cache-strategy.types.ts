/** @fileoverview Types for various caching strategies. */
import { Uuid } from '../../types/common.types';

export type CacheEvictionPolicy = 'LRU' | 'LFU' | 'FIFO' | 'NONE';
export type CacheType = 'IN_MEMORY' | 'DISTRIBUTED' | 'EDGE';

export interface CacheStrategy {
  readonly strategyId: Uuid;
  readonly name: string;
  readonly type: CacheType;
  readonly evictionPolicy: CacheEvictionPolicy;
  readonly maxSize: number; // e.g., number of items or MB
  readonly defaultTtlSeconds: number;
  readonly isActive: boolean;
}

export interface CacheMetrics {
  readonly cacheId: Uuid;
  readonly hits: number;
  readonly misses: number;
  readonly hitRatio: number;
  readonly currentSize: number;
  readonly lastEvictionCount: number;
}
