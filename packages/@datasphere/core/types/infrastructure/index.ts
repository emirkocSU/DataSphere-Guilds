/** @fileoverview Main entry point for all Infrastructure types. */

// Explicit re-exports to prevent name collisions and create a stable API.

// API Gateway
export type { GatewayConfig as ApiGatewayConfig } from './api-gateway.types';

// Cache
export type { CacheConfig, CacheMetrics, CacheStrategy } from './cache.types';

// CDN Integration
export type { CdnConfig, AssetOptimizationConfig } from './cdn-integration.types';

// Database
export type { DatabaseConnectionConfig, MigrationRecord } from './database.types';
export type { DatabaseConfig as AbstractDatabaseConfig, QueryResult } from './database-abstraction.types';

// Monitoring
export type { SystemMetric, AlertConfig as MonitoringAlertConfig } from './monitoring.types';

// Notification Delivery
export type { NotificationChannel, DeliveryStatus, DeliveryRecord } from './notification-delivery';

// Orchestration
export type { ServiceWorkflow as OrchestrationWorkflow } from './orchestration.types';

// Plugin System
export type { PluginManifest } from './plugin-system.types';

// Queues
export type { JobMetrics as Job, JobStatus, QueueConfig } from './queue.types';

// Search Engine
export type { SearchEngineConfig } from './search-engine.types';

// Service Communication
export type { ServiceEndpoint } from './service-communication.types';

// Storage
export type { StorageConfig, StorageProviderType } from './storage.types';
