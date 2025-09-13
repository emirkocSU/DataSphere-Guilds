/**
 * @fileoverview Enterprise Cache Types
 */

export type CacheKey = string;
export type CacheTTL = number;
export type ISOTimestamp = string;

export enum CacheLevel {
  L1_MEMORY = 'L1_MEMORY',
  L2_REDIS = 'L2_REDIS',
  L3_CDN = 'L3_CDN'
}

export enum CacheStrategy {
  WRITE_THROUGH = 'WRITE_THROUGH',
  WRITE_BEHIND = 'WRITE_BEHIND',
  WRITE_AROUND = 'WRITE_AROUND',
  READ_THROUGH = 'READ_THROUGH',
  CACHE_ASIDE = 'CACHE_ASIDE'
}

export interface CacheEntry<T = any> {
  key: CacheKey;
  value: T;
  ttl: CacheTTL;
  createdAt: ISOTimestamp;
  lastAccessed: ISOTimestamp;
  accessCount: number;
  size: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
}

export interface CacheConfig {
  enabled: boolean;
  strategy: CacheStrategy;
  levels: {
    l1: L1Config;
    l2: L2Config;
    l3: L3Config;
  };
  serialization: {
    compress: boolean;
    algorithm: 'gzip' | 'lz4' | 'snappy';
  };
}

export interface L1Config {
  enabled: boolean;
  maxSize: number;
  ttl: number;
  maxEntries: number;
  evictionPolicy: 'LRU' | 'LFU' | 'FIFO';
}

export interface L2Config {
  enabled: boolean;
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: number;
  maxRetries: number;
  retryDelay: number;
}

export interface L3Config {
  enabled: boolean;
  provider: 'cloudflare' | 'aws' | 'azure';
  endpoint: string;
  apiKey: string;
  ttl: number;
}

export interface WarmupTask {
  id: string;
  keys: CacheKey[];
  priority: 'low' | 'medium' | 'high';
  batchSize: number;
  loader: (keys: CacheKey[]) => Promise<Record<CacheKey, any>>;
}

export interface InvalidationRule {
  pattern: string;
  tags: string[];
  cascade: boolean;
}