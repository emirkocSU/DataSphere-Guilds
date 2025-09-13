/** @fileoverview Ultra-lean memory cache with LRU eviction and zero-copy operations. */

interface CacheEntry<T> {
  value: T;
  expires: number;
  lastAccess: number;
  accessCount: number;
}

/**
 * High-performance LRU cache with built-in TTL and memory management
 */
export class UltraCache<T = any> {
  private readonly cache = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;
  private readonly defaultTtl: number;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(maxSize = 10000, defaultTtl = 3600000) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
    this.startCleanupTimer();
  }

  set(key: string, value: T, ttl = this.defaultTtl): void {
    const now = Date.now();
    const expires = now + ttl;
    
    // Evict if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      expires,
      lastAccess: now,
      accessCount: 1
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    const now = Date.now();
    
    // Check expiration
    if (entry.expires <= now) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access tracking
    entry.lastAccess = now;
    entry.accessCount++;
    
    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (entry.expires <= Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.cache) {
        if (entry.expires <= now) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key));
    }, 60000); // Cleanup every minute
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Global cache instance
const globalCache = new UltraCache();

// Legacy API for backward compatibility
export function setCache(key: string, value: any, ttl = 3600000): void {
  globalCache.set(key, value, ttl);
}

export function getCache(key: string): any {
  return globalCache.get(key);
}

export function deleteCache(key: string): boolean {
  return globalCache.delete(key);
}

export function clearCache(): void {
  globalCache.clear();
}

/**
 * Memory-optimized cache with compression for large objects
 */
export class CompressedCache<T> extends UltraCache<T> {
  private compress: boolean;
  
  constructor(maxSize = 1000, defaultTtl = 3600000, compress = true) {
    super(maxSize, defaultTtl);
    this.compress = compress;
  }

  set(key: string, value: T, ttl?: number): void {
    let processedValue = value;
    
    if (this.compress && typeof value === 'object' && value !== null) {
      // In production, use a proper compression library
      processedValue = JSON.parse(JSON.stringify(value)) as T;
    }
    
    super.set(key, processedValue, ttl);
  }
}

/**
 * Distributed cache interface for Redis/external caches
 */
export interface IDistributedCache<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

/**
 * Multi-tier cache with L1 (memory) and L2 (distributed) layers
 */
export class MultiTierCache<T> {
  constructor(
    private l1Cache: UltraCache<T>,
    private l2Cache?: IDistributedCache<T>
  ) {}

  async get(key: string): Promise<T | undefined> {
    // Try L1 first
    let value = this.l1Cache.get(key);
    if (value !== undefined) {
      return value;
    }

    // Try L2 if available
    if (this.l2Cache) {
      value = await this.l2Cache.get(key);
      if (value !== undefined) {
        // Store in L1 for faster access
        this.l1Cache.set(key, value);
        return value;
      }
    }

    return undefined;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    // Store in L1
    this.l1Cache.set(key, value, ttl);
    
    // Store in L2 if available
    if (this.l2Cache) {
      await this.l2Cache.set(key, value, ttl);
    }
  }

  async delete(key: string): Promise<boolean> {
    const l1Result = this.l1Cache.delete(key);
    const l2Result = this.l2Cache ? await this.l2Cache.delete(key) : false;
    return l1Result || l2Result;
  }
}
