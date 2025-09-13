/**
 * @fileoverview Edge Computing Framework Types
 */

export type EdgeNodeId = string;
export type FunctionId = string;
export type RegionId = string;
export type ISOTimestamp = string;

export interface EdgeNode {
  id: EdgeNodeId;
  region: RegionId;
  location: GeoLocation;
  status: 'active' | 'inactive' | 'maintenance';
  capabilities: EdgeCapabilities;
  resources: EdgeResources;
  metrics: EdgeMetrics;
  lastHeartbeat: ISOTimestamp;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface EdgeCapabilities {
  functions: boolean;
  storage: boolean;
  cache: boolean;
  analytics: boolean;
  compute: boolean;
  gpu: boolean;
}

export interface EdgeResources {
  cpu: ResourceUsage;
  memory: ResourceUsage;
  storage: ResourceUsage;
  network: NetworkUsage;
}

export interface ResourceUsage {
  total: number;
  used: number;
  available: number;
  utilization: number;
}

export interface NetworkUsage {
  bandwidth: number;
  latency: number;
  throughput: number;
  connections: number;
}

export interface EdgeMetrics {
  requestsPerSecond: number;
  averageLatency: number;
  errorRate: number;
  cacheHitRate: number;
  uptime: number;
  dataTransfer: number;
}

export interface EdgeFunction {
  id: FunctionId;
  name: string;
  runtime: 'nodejs' | 'python' | 'go' | 'rust' | 'wasm';
  code: string;
  config: FunctionConfig;
  deployment: FunctionDeployment;
  metrics: FunctionMetrics;
  triggers: FunctionTrigger[];
}

export interface FunctionConfig {
  memory: number;
  timeout: number;
  environment: Record<string, string>;
  dependencies: string[];
  regions: RegionId[];
}

export interface FunctionDeployment {
  version: string;
  status: 'deploying' | 'deployed' | 'failed' | 'inactive';
  deployedAt: ISOTimestamp;
  regions: Record<RegionId, DeploymentStatus>;
}

export interface DeploymentStatus {
  status: 'deploying' | 'deployed' | 'failed';
  nodeId: EdgeNodeId;
  deployedAt: ISOTimestamp;
  error?: string;
}

export interface FunctionMetrics {
  invocations: number;
  errors: number;
  duration: number;
  coldStarts: number;
  memoryUsage: number;
  dataTransfer: number;
}

export interface FunctionTrigger {
  type: 'http' | 'event' | 'schedule' | 'edge';
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface EdgeCache {
  key: string;
  value: unknown;
  ttl: number;
  region: RegionId;
  size: number;
  hits: number;
  misses: number;
  createdAt: ISOTimestamp;
  accessedAt: ISOTimestamp;
}

export interface EdgeRequest {
  id: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  clientIp: string;
  region: RegionId;
  nodeId: EdgeNodeId;
  timestamp: ISOTimestamp;
  metadata: RequestMetadata;
}

export interface RequestMetadata {
  userAgent: string;
  referer: string;
  country: string;
  city: string;
  asn: number;
  cloudflareRay?: string;
}

export interface EdgeResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  cached: boolean;
  processingTime: number;
  size: number;
}

export interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'aws' | 'azure' | 'gcp';
  origins: Origin[];
  caching: CachingConfig;
  security: SecurityConfig;
  optimization: OptimizationConfig;
}

export interface Origin {
  name: string;
  url: string;
  weight: number;
  healthy: boolean;
  region: RegionId;
}

export interface CachingConfig {
  defaultTtl: number;
  maxAge: number;
  staleWhileRevalidate: number;
  rules: CachingRule[];
}

export interface CachingRule {
  pattern: string;
  ttl: number;
  bypass: boolean;
  vary: string[];
}

export interface SecurityConfig {
  ddosProtection: boolean;
  waf: boolean;
  botManagement: boolean;
  rateLimiting: RateLimitConfig;
}

export interface RateLimitConfig {
  enabled: boolean;
  requests: number;
  window: number;
  burst: number;
}

export interface OptimizationConfig {
  minification: boolean;
  compression: boolean;
  imageOptimization: boolean;
  http2: boolean;
  http3: boolean;
}

export interface EdgeAnalytics {
  requests: number;
  bandwidth: number;
  errors: number;
  cacheMisses: number;
  topRegions: RegionStat[];
  topPaths: PathStat[];
  performance: PerformanceMetrics;
}

export interface RegionStat {
  region: RegionId;
  requests: number;
  bandwidth: number;
  latency: number;
}

export interface PathStat {
  path: string;
  requests: number;
  errors: number;
  averageTime: number;
}

export interface PerformanceMetrics {
  averageLatency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number;
  errorRate: number;
}