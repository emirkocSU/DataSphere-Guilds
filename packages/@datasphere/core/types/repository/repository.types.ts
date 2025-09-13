/**
 * @fileoverview Lean, high-performance repository types for DataSphere unicorn-scale data operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from "../api/common";

export interface RepositoryMetrics {
  totalQueries: number;
  averageQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  connectionPoolSize: number;
  activeConnections: number;
  lastUpdated: Date;
}

export interface RepositoryEvent<T = any> {
  id: UUID;
  type: RepositoryEventType;
  entityType: string;
  entityId?: UUID;
  data?: T;
  timestamp: Date;
  metadata?: RepositoryEventMetadata;
}

export interface RepositoryEventMetadata {
  userId?: UUID;
  source?: string;
  traceId?: string;
  operation?: string;
  affectedRows?: number;
  duration?: number;
}

export type RepositoryEventType =
   < /dev/null |  "entity.created"
  | "entity.updated"
  | "entity.deleted"
  | "entity.queried"
  | "cache.hit"
  | "cache.miss"
  | "error.occurred";
