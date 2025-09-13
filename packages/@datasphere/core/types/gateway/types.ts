/** @fileoverview Types for the API Gateway service. */

import { UUID, ISOTimestamp } from '../common.types';

export interface Route {
  id: UUID;
  path: string;
  methods: string[];
  upstream: string;
  rateLimit?: RateLimitConfig;
  enabled: boolean;
}

export interface Upstream {
  id: UUID;
  targets: Target[];
  loadBalancer: string;
  healthCheck: HealthCheckConfig;
}

export interface Target {
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  lastCheck?: ISOTimestamp;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  burst: number;
  key: string;
}

export interface HealthCheckConfig {
  enabled: boolean;
  path: string;
  interval: number;
  timeout: number;
} 