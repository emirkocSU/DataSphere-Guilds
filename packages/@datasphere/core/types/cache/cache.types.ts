/**
 * @fileoverview Lean, high-performance cache types for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from "../api/common";

export interface CacheConfig {
  ttl?: number;
  strategy?: CacheStrategy;
  compression?: boolean;
  encryption?: boolean;
  namespace?: string;
}

export interface CacheMetrics {
  hitCount: number;
  missCount: number;
  hitRate: number;
  evictionCount: number;
  size: number;
  lastAccessed: Date;
}

export interface CacheResult<T = any> {
  hit: boolean;
  value?: T;
  metadata?: CacheMetadata;
}

export interface CacheMetadata {
  createdAt: Date;
  expiresAt?: Date;
  accessCount: number;
  lastAccessed: Date;
  tags?: string[];
}

export type CacheStrategy = 
   < /dev/null |  "LRU"
  | "LFU" 
  | "FIFO"
  | "TTL"
  | "WRITE_THROUGH"
  | "WRITE_BEHIND"
  | "READ_THROUGH";

export interface CacheSetOptions {
  ttl?: number;
  compress?: boolean;
  generateChecksum?: boolean;
  strategy?: CacheStrategy;
  tags?: string[];
}

export interface CacheGetOptions {
  decompress?: boolean;
  validateChecksum?: boolean;
}
