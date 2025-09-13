/**
 * @fileoverview API Gateway Types
 */

export type RouteId = string;
export type ServiceId = string;
export type UpstreamId = string;
export type ISOTimestamp = string;

export interface Route {
  id: RouteId;
  path: string;
  methods: string[];
  upstream: UpstreamId;
  middleware: string[];
  rateLimit?: RateLimitConfig;
  auth?: AuthConfig;
  transform?: TransformConfig;
  version: string;
  enabled: boolean;
}

export interface Upstream {
  id: UpstreamId;
  name: string;
  targets: Target[];
  loadBalancer: LoadBalancerConfig;
  healthCheck: HealthCheckConfig;
  circuitBreaker: CircuitBreakerConfig;
  retries: number;
  timeout: number;
}

export interface Target {
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  lastCheck?: ISOTimestamp;
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'ip_hash' | 'weighted_round_robin';
  sessionAffinity: boolean;
  healthyOnly: boolean;
}

export interface HealthCheckConfig {
  enabled: boolean;
  path: string;
  interval: number;
  timeout: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  recoveryTimeout: number;
  monitorWindow: number;
}

export interface RateLimitConfig {
  enabled: boolean;
  requests: number;
  window: number;
  burst: number;
  keyBy: 'ip' | 'user' | 'api_key';
}

export interface AuthConfig {
  type: 'jwt' | 'api_key' | 'oauth' | 'basic';
  required: boolean;
  config: Record<string, unknown>;
}

export interface TransformConfig {
  request?: {
    headers?: Record<string, string>;
    body?: string;
  };
  response?: {
    headers?: Record<string, string>;
    body?: string;
  };
}

export interface GatewayMetrics {
  totalRequests: number;
  totalResponses: number;
  errorRate: number;
  averageLatency: number;
  throughput: number;
  activeConnections: number;
  upstreamHealth: Record<string, boolean>;
}

export interface RequestContext {
  id: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body?: unknown;
  ip: string;
  userAgent: string;
  timestamp: ISOTimestamp;
  route?: Route;
  upstream?: Upstream;
  user?: any;
}