/**
 * @fileoverview L2 Redis Cache - Distributed Cache Layer
 */

import { EventEmitter } from 'events';
import { CacheKey, CacheMetrics, L2Config } from './types';

interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ex?: number): Promise<string>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  flushdb(): Promise<string>;
  pipeline(): any;
  exec(): Promise<any>;
}

export class L2RedisCache extends EventEmitter {
  private config: L2Config;
  private client: RedisClient | null = null;
  private metrics: CacheMetrics;
  private connected = false;

  constructor(config: L2Config) {
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
  }

  async connect(): Promise<void> {
    try {
      // Mock Redis client - replace with actual Redis client
      this.client = this.createMockClient();
      this.connected = true;
      this.emit('connected');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await this.client.get(prefixedKey);
      
      if (value === null) {
        this.metrics.misses++;
        this.updateHitRate();
        return null;
      }

      this.metrics.hits++;
      this.updateHitRate();
      
      return JSON.parse(value);
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async set<T>(key: CacheKey, value: T, ttl?: number): Promise<void> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.config.ttl;

      await this.client.set(prefixedKey, serialized, expiry);
      
      this.metrics.sets++;
      this.emit('set', { key });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async delete(key: CacheKey): Promise<boolean> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const result = await this.client.del(prefixedKey);
      
      if (result > 0) {
        this.metrics.deletes++;
        this.emit('delete', { key });
        return true;
      }
      
      return false;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    try {
      await this.client.flushdb();
      this.emit('clear');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async has(key: CacheKey): Promise<boolean> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const exists = await this.client.exists(prefixedKey);
      return exists === 1;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async mget<T>(keys: CacheKey[]): Promise<(T | null)[]> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    const pipeline = this.client.pipeline();
    const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
    
    for (const key of prefixedKeys) {
      pipeline.get(key);
    }

    const results = await pipeline.exec();
    
    return results.map((result: any) => {
      if (result[1] === null) {
        this.metrics.misses++;
        return null;
      }
      this.metrics.hits++;
      return JSON.parse(result[1]);
    });
  }

  async mset<T>(entries: Array<{ key: CacheKey; value: T; ttl?: number }>): Promise<void> {
    if (!this.connected || !this.client) {
      throw new Error('Redis not connected');
    }

    const pipeline = this.client.pipeline();
    
    for (const entry of entries) {
      const prefixedKey = this.getPrefixedKey(entry.key);
      const serialized = JSON.stringify(entry.value);
      const expiry = entry.ttl || this.config.ttl;
      
      pipeline.set(prefixedKey, serialized, expiry);
    }

    await pipeline.exec();
    this.metrics.sets += entries.length;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.client = null;
    this.emit('disconnected');
  }

  private getPrefixedKey(key: CacheKey): string {
    return `${this.config.keyPrefix}:${key}`;
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0;
  }

  private createMockClient(): RedisClient {
    const store = new Map<string, { value: string; expiry: number }>();

    return {
      async get(key: string): Promise<string | null> {
        const entry = store.get(key);
        if (!entry || Date.now() > entry.expiry) {
          store.delete(key);
          return null;
        }
        return entry.value;
      },

      async set(key: string, value: string, ex?: number): Promise<string> {
        const expiry = ex ? Date.now() + ex * 1000 : Date.now() + 3600000;
        store.set(key, { value, expiry });
        return 'OK';
      },

      async del(key: string): Promise<number> {
        return store.delete(key) ? 1 : 0;
      },

      async exists(key: string): Promise<number> {
        const entry = store.get(key);
        if (!entry || Date.now() > entry.expiry) {
          store.delete(key);
          return 0;
        }
        return 1;
      },

      async flushdb(): Promise<string> {
        store.clear();
        return 'OK';
      },

      pipeline() {
        const commands: Array<{ method: string; args: any[] }> = [];
        return {
          get: (key: string) => commands.push({ method: 'get', args: [key] }),
          set: (key: string, value: string, ex?: number) => commands.push({ method: 'set', args: [key, value, ex] }),
          exec: async () => {
            const results = [];
            for (const cmd of commands) {
              try {
                const result = await (this as any)[cmd.method](...cmd.args);
                results.push([null, result]);
              } catch (error) {
                results.push([error, null]);
              }
            }
            return results;
          }
        };
      },

      exec: async () => []
    };
  }
}

export const createL2Cache = (config: L2Config): L2RedisCache => {
  return new L2RedisCache(config);
};