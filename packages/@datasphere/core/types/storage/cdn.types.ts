/**
 * @fileoverview Yocto-optimized CDN types with global edge distribution.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact CDN edge node - 32 bytes
export interface EdgeNode {
  readonly nodeId: BigInt; // 8 bytes - node hash
  readonly region: number; // 1 byte - geographic region
  readonly provider: number; // 1 byte - CDN provider
  readonly status: number; // 1 byte - node status
  readonly capacity: number; // 4 bytes - node capacity
  readonly latency: number; // 2 bytes - avg latency ms
  readonly bandwidth: BigInt; // 8 bytes - bandwidth bps
  readonly lastUpdate: number; // 4 bytes - status update
}

// Nano cache entry - 28 bytes
export interface CacheEntry {
  readonly key: BigInt; // 8 bytes - cache key hash
  readonly fileId: UUID; // 16 bytes - source file
  readonly expires: number; // 4 bytes - expiration time
}

// Micro CDN distribution - 24 bytes
export interface Distribution {
  readonly distId: BigInt; // 8 bytes - distribution hash
  readonly origin: BigInt; // 8 bytes - origin server hash
  readonly status: number; // 1 byte - distribution status
  readonly config: number; // 1 byte - config flags
  readonly created: number; // 4 bytes - creation time
  readonly lastModified: number; // 4 bytes - last update
}

// Cache policy config - 20 bytes
export interface CachePolicy {
  readonly policyId: BigInt; // 8 bytes
  readonly ttl: number; // 4 bytes - cache TTL seconds
  readonly maxAge: number; // 4 bytes - max age seconds
  readonly headers: number; // 2 bytes - header flags
  readonly cookies: number; // 1 byte - cookie policy
  readonly compression: number; // 1 byte - compression type
}

// Edge performance metrics - 16 bytes
export interface EdgeMetrics {
  readonly nodeId: BigInt; // 8 bytes
  readonly hitRate: number; // 2 bytes - cache hit rate
  readonly requests: number; // 4 bytes - requests per second
  readonly errors: number; // 2 bytes - error count
}

// Content invalidation - 20 bytes
export interface Invalidation {
  readonly invalidationId: BigInt; // 8 bytes
  readonly paths: readonly BigInt[]; // path hashes
  readonly status: number; // 1 byte - invalidation status
  readonly created: number; // 4 bytes - creation time
  readonly completed: number; // 4 bytes - completion time
}

// Const enums for zero overhead
export const enum CdnProvider {
  CLOUDFRONT = 0,
  CLOUDFLARE = 1,
  FASTLY = 2,
  BUNNY = 3,
  KEYCDN = 4,
  STACKPATH = 5
}

export const enum EdgeRegion {
  US_EAST = 0,
  US_WEST = 1,
  EU_WEST = 2,
  EU_CENTRAL = 3,
  ASIA_PACIFIC = 4,
  ASIA_SOUTHEAST = 5,
  AUSTRALIA = 6,
  SOUTH_AMERICA = 7,
  AFRICA = 8,
  MIDDLE_EAST = 9
}

export const enum NodeStatus {
  ONLINE = 0,
  OFFLINE = 1,
  MAINTENANCE = 2,
  DEGRADED = 3,
  OVERLOADED = 4
}

export const enum DistributionStatus {
  DEPLOYING = 0,
  ACTIVE = 1,
  DISABLED = 2,
  DELETING = 3,
  ERROR = 4
}

export const enum CachePolicyType {
  NO_CACHE = 0,
  SHORT_CACHE = 1,
  LONG_CACHE = 2,
  IMMUTABLE = 3,
  DYNAMIC = 4
}

export const enum CompressionType {
  NONE = 0,
  GZIP = 1,
  BROTLI = 2,
  DEFLATE = 3
}

export const enum InvalidationStatus {
  QUEUED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  FAILED = 3
}

// Type aliases for ultra-performance
export type NodeId = BigInt;
export type DistributionId = BigInt;
export type CacheKey = BigInt;
export type PathHash = BigInt;
export type Bandwidth = BigInt;
export type Timestamp = number;
export type Latency = number;
export type HitRate = number;

// Memory-mapped CDN storage
export interface CdnStorage {
  readonly buffer: SharedArrayBuffer;
  readonly nodeOffset: number;
  readonly cacheOffset: number;
  readonly distOffset: number;
  readonly policyOffset: number;
  readonly metricsOffset: number;
}

// High-speed CDN router
export interface CdnRouter {
  readonly route: (request: CdnRequest) => NodeId;
  readonly selectNodes: (region: EdgeRegion, count: number) => readonly NodeId[];
  readonly failover: (nodeId: NodeId) => NodeId | null;
  readonly loadBalance: (nodes: readonly NodeId[]) => NodeId;
}

// CDN request context - 16 bytes
export interface CdnRequest {
  readonly requestId: BigInt; // 8 bytes
  readonly clientIp: number; // 4 bytes - IP hash
  readonly userAgent: number; // 2 bytes - UA hash
  readonly acceptEncoding: number; // 1 byte - encoding flags
  readonly protocol: number; // 1 byte - HTTP version
}

// Edge cache manager
export interface EdgeCache {
  readonly get: (key: CacheKey) => CacheEntry | null;
  readonly set: (key: CacheKey, entry: CacheEntry) => boolean;
  readonly delete: (key: CacheKey) => boolean;
  readonly purge: (pattern: BigInt) => number;
  readonly stats: () => CacheStats;
}

// Cache statistics - 24 bytes
export interface CacheStats {
  readonly totalEntries: number; // 4 bytes
  readonly hitRate: number; // 4 bytes - cache hit rate
  readonly missRate: number; // 4 bytes - cache miss rate
  readonly evictions: number; // 4 bytes - eviction count
  readonly memoryUsed: BigInt; // 8 bytes - memory usage
}

// CDN analytics aggregate
export interface CdnAnalytics {
  readonly totalRequests: BigInt;
  readonly bandwidth: BigInt;
  readonly hitRate: number;
  readonly avgLatency: number;
  readonly errorRate: number;
  readonly topRegions: readonly EdgeRegion[];
}

// Origin shield config - 16 bytes
export interface OriginShield {
  readonly shieldId: BigInt; // 8 bytes
  readonly origin: BigInt; // 8 bytes - origin server hash
}

// SSL certificate - 24 bytes
export interface SslCertificate {
  readonly certId: BigInt; // 8 bytes
  readonly domain: BigInt; // 8 bytes - domain hash
  readonly expires: Timestamp; // 4 bytes - expiration
  readonly status: number; // 1 byte - cert status
  readonly provider: number; // 1 byte - cert provider
  readonly autoRenew: boolean; // 1 byte - auto renewal
}

// Geographic routing - 12 bytes
export interface GeoRouting {
  readonly countryCode: number; // 2 bytes - ISO country code
  readonly region: EdgeRegion; // 1 byte
  readonly nodeId: NodeId; // 8 bytes
  readonly priority: number; // 1 byte - routing priority
}

// Rate limiting config - 12 bytes
export interface RateLimit {
  readonly limitId: BigInt; // 8 bytes
  readonly requestsPerSecond: number; // 4 bytes - RPS limit
}

// WAF (Web Application Firewall) rule - 16 bytes
export interface WafRule {
  readonly ruleId: BigInt; // 8 bytes
  readonly pattern: BigInt; // 8 bytes - pattern hash
}

// CDN monitoring alert - 20 bytes
export interface CdnAlert {
  readonly alertId: BigInt; // 8 bytes
  readonly nodeId: NodeId; // 8 bytes
  readonly severity: number; // 1 byte - alert severity
  readonly type: number; // 1 byte - alert type
  readonly timestamp: Timestamp; // 4 bytes
}

// Zero-allocation CDN manager
export interface CdnManager {
  readonly deploy: (distribution: Distribution) => Promise<DistributionId>;
  readonly invalidate: (paths: readonly PathHash[]) => Promise<Invalidation>;
  readonly updatePolicy: (distId: DistributionId, policy: CachePolicy) => Promise<boolean>;
  readonly getMetrics: (nodeId: NodeId) => Promise<EdgeMetrics>;
  readonly healthCheck: () => Promise<readonly NodeStatus[]>;
  readonly analytics: () => CdnAnalytics;
}
