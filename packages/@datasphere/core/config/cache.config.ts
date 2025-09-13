
import { z } from 'zod';

/**
 * Defines the available caching strategies.
 * - 'memory': In-memory cache (L1), fastest but local to the process.
 * - 'distributed': Distributed cache (L2, e.g., Redis), shared across processes/services.
 * - 'layered': A combination of memory and distributed cache for optimal performance.
 */
export const CacheStrategySchema = z.enum(['memory', 'distributed', 'layered']);
export type CacheStrategy = z.infer<typeof CacheStrategySchema>;

/**
 * Schema for a single cache profile configuration.
 * Each profile defines settings for a specific type of data.
 */
export const CacheProfileSchema = z.object({
  /** The caching strategy to use for this profile. */
  strategy: CacheStrategySchema.default('layered'),
  /** Time-to-live in seconds for the cache entries. */
  ttlSeconds: z.number().int().positive(),
  /** Optional: Time-to-live for the L1 (in-memory) cache in a layered strategy. */
  l1TtlSeconds: z.number().int().positive().optional(),
});

export type CacheProfile = z.infer<typeof CacheProfileSchema>;

/**
 * Main schema for the cache configuration file.
 * It's a record mapping cache profile names to their configuration.
 */
export const CacheConfigSchema = z.object({
  /** Default caching profile, used when no specific profile is requested. */
  default: CacheProfileSchema,
  /** A map of specific caching profiles for different use cases. */
  profiles: z.record(CacheProfileSchema),
});

export type CacheConfig = z.infer<typeof CacheConfigSchema>;

/**
 * Default cache configuration.
 * Provides sensible defaults that can be overridden by environment-specific configs.
 */
export const defaultCacheConfig: CacheConfig = {
  default: {
    strategy: 'layered',
    ttlSeconds: 60, // 1 minute
    l1TtlSeconds: 5, // 5 seconds for the fast in-memory layer
  },
  profiles: {
    userSession: {
      strategy: 'distributed',
      ttlSeconds: 60 * 60 * 24, // 24 hours
    },
    staticContent: {
      strategy: 'memory',
      ttlSeconds: 60 * 60, // 1 hour
    },
    sensorData: {
      strategy: 'layered',
      ttlSeconds: 10, // 10 seconds
      l1TtlSeconds: 2, // 2 seconds
    },
    leaderboard: {
      strategy: 'distributed',
      ttlSeconds: 30, // 30 seconds
    },
  },
};
