/** @fileoverview Types for service health checks. */
import { IsoTimestamp } from '../common.types';

export type ServiceStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

export interface HealthCheckResult {
  readonly serviceName: string;
  readonly status: ServiceStatus;
  readonly timestamp: IsoTimestamp;
  readonly details?: string;
  readonly dependencies: DependencyHealthCheck[];
}

export interface DependencyHealthCheck {
  readonly name: string;
  readonly type: 'DATABASE' | 'CACHE' | 'EXTERNAL_API' | 'QUEUE';
  readonly status: ServiceStatus;
  readonly latencyMs?: number;
}
