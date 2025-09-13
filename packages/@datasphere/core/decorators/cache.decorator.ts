/**
 * @fileoverview Lean, high-performance caching decorators for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../utils/performance/monitor';
import { CacheStrategy } from '../types/cache/cache.types';

const monitor = new PerformanceMonitor('CacheDecorators');

// Simple in-memory cache for demonstration
class SimpleCache {
  private cache = new Map<string, { value: any; expiresAt?: number }>();

  async get(key: string): Promise<{ hit: boolean; value?: any }> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return { hit: false };
    }
    
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return { hit: false };
    }
    
    return { hit: true, value: entry.value };
  }

  async set(key: string, value: any, options?: { ttl?: number }): Promise<void> {
    const expiresAt = options?.ttl ? Date.now() + options.ttl : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

const defaultCache = new SimpleCache();

export interface CacheConfig {
  ttl?: number;
  keyPrefix?: string;
  strategy?: CacheStrategy;
  skipIfError?: boolean;
}

export function Cache(config: CacheConfig = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('cacheDecorator', async () => {
        const cacheKey = generateCacheKey(methodName, args, config.keyPrefix);
        
        try {
          // Try to get from cache
          const cached = await defaultCache.get(cacheKey);
          if (cached.hit) {
            monitor.recordValue('cache_hit', 1, 'counter');
            return cached.value;
          }
          
          // Execute original method
          monitor.recordValue('cache_miss', 1, 'counter');
          const result = await originalMethod.apply(this, args);
          
          // Store in cache
          await defaultCache.set(cacheKey, result, { ttl: config.ttl });
          
          return result;
        } catch (error) {
          if (config.skipIfError) {
            return originalMethod.apply(this, args);
          }
          throw error;
        }
      });
    };
    
    return descriptor;
  };
}

export function CacheInvalidate(patterns: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('cacheInvalidateDecorator', async () => {
        const result = await originalMethod.apply(this, args);
        
        // Invalidate cache patterns after successful execution
        for (const pattern of patterns) {
          await defaultCache.invalidatePattern(pattern);
        }
        
        return result;
      });
    };
    
    return descriptor;
  };
}

export function ConditionalCache(
  condition: (args: any[]) => boolean,
  cacheConfig: CacheConfig = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return monitor.measure('conditionalCacheDecorator', async () => {
        if (!condition(args)) {
          return originalMethod.apply(this, args);
        }
        
        // Apply caching
        const cacheDecorator = Cache(cacheConfig);
        const cachedDescriptor = cacheDecorator(target, propertyKey, { value: originalMethod });
        return cachedDescriptor.value.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

// Helper functions
function generateCacheKey(methodName: string, args: any[], prefix?: string): string {
  const keyComponents = [methodName];
  
  if (prefix) {
    keyComponents.unshift(prefix);
  }
  
  // Simple argument serialization
  const argsHash = simpleHash(JSON.stringify(args));
  keyComponents.push(argsHash);
  
  return keyComponents.join(':');
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Multi-tier cache implementation
export class MultiTierCache {
  private l1Cache = new Map<string, { value: any; expiresAt?: number }>();
  private l2Cache = new Map<string, { value: any; expiresAt?: number }>();
  private readonly l1MaxSize: number;
  private readonly l2MaxSize: number;
  
  constructor(l1MaxSize: number = 1000, l2MaxSize: number = 10000) {
    this.l1MaxSize = l1MaxSize;
    this.l2MaxSize = l2MaxSize;
  }
  
  async get(key: string): Promise<{ hit: boolean; value?: any; tier?: 'L1' | 'L2' }> {
    // Check L1 cache first
    let entry = this.l1Cache.get(key);
    if (entry && (!entry.expiresAt || Date.now() <= entry.expiresAt)) {
      return { hit: true, value: entry.value, tier: 'L1' };
    }
    
    // Check L2 cache
    entry = this.l2Cache.get(key);
    if (entry && (!entry.expiresAt || Date.now() <= entry.expiresAt)) {
      // Promote to L1
      this.setL1(key, entry.value, entry.expiresAt);
      return { hit: true, value: entry.value, tier: 'L2' };
    }
    
    return { hit: false };
  }
  
  async set(key: string, value: any, options?: { ttl?: number; tier?: 'L1' | 'L2' | 'both' }): Promise<void> {
    const expiresAt = options?.ttl ? Date.now() + options.ttl : undefined;
    const tier = options?.tier || 'both';
    
    if (tier === 'L1' || tier === 'both') {
      this.setL1(key, value, expiresAt);
    }
    
    if (tier === 'L2' || tier === 'both') {
      this.setL2(key, value, expiresAt);
    }
  }
  
  private setL1(key: string, value: any, expiresAt?: number): void {
    if (this.l1Cache.size >= this.l1MaxSize) {
      const firstKey = this.l1Cache.keys().next().value;
      this.l1Cache.delete(firstKey);
    }
    this.l1Cache.set(key, { value, expiresAt });
  }
  
  private setL2(key: string, value: any, expiresAt?: number): void {
    if (this.l2Cache.size >= this.l2MaxSize) {
      const firstKey = this.l2Cache.keys().next().value;
      this.l2Cache.delete(firstKey);
    }
    this.l2Cache.set(key, { value, expiresAt });
  }
  
  async clear(): Promise<void> {
    this.l1Cache.clear();
    this.l2Cache.clear();
  }
  
  getStats(): { l1Size: number; l2Size: number; totalSize: number } {
    return {
      l1Size: this.l1Cache.size,
      l2Size: this.l2Cache.size,
      totalSize: this.l1Cache.size + this.l2Cache.size
    };
  }
}

export { monitor as cacheDecoratorMonitor };