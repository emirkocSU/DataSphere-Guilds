/**
 * @fileoverview Lean, high-performance cache manager for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { CacheResult, CacheSetOptions, CacheGetOptions } from "../../types/cache/cache.types";

export class CacheManager {
  private cache = new Map<string, any>();
  private metadata = new Map<string, any>();

  async get(key: string, options?: CacheGetOptions): Promise<CacheResult> {
    const value = this.cache.get(key);
    const meta = this.metadata.get(key);
    
    if (value \!== undefined) {
      return {
        hit: true,
        value,
        metadata: meta
      };
    }
    
    return { hit: false };
  }

  async set(key: string, value: any, options?: CacheSetOptions): Promise<void> {
    this.cache.set(key, value);
    this.metadata.set(key, {
      createdAt: new Date(),
      expiresAt: options?.ttl ? new Date(Date.now() + options.ttl) : undefined,
      accessCount: 0,
      lastAccessed: new Date(),
      tags: options?.tags
    });
    
    if (options?.ttl) {
      setTimeout(() => {
        this.cache.delete(key);
        this.metadata.delete(key);
      }, options.ttl);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.metadata.delete(key);
    });
  }
}
