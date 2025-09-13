/**
 * @fileoverview Core Utilities - Enterprise Infrastructure
 */

// Define a common place for shared types to avoid conflicts
export type { ISOTimestamp } from './gateway/types'; // Canonical source for ISOTimestamp
export type { AuthConfig } from './auth/types'; // Canonical source for AuthConfig

// Export services and other non-conflicting members explicitly
export * from './error-handling';
export { default as AuthService } from './auth/service';
export { CacheService } from './cache/cache-service';
export { StreamProcessor as AnalyticsService } from './analytics/stream-processor';
export { GatewayService } from './gateway/gateway-service';
export { TrainingEngine as MLEngine } from './ml/training-engine';
export { SyncEngine } from './sync/sync-engine';
export { NotificationOrchestrator } from './notifications/notification-orchestrator';
export { ThreatDetector } from './security/threat-detector';

// P3 Enterprise Components
export { ViralEngine, GrowthAnalytics } from './growth';
export { EdgeManager, EdgeCacheManager, EdgeAnalyticsManager } from './edge';
export { GamificationEngine } from './gamification';

// P4 Enterprise Components
export { WebhookManager, APIAdapterEngine, PartnerManager } from './integration';
export { DashboardEngine } from './business-intelligence';
export { ForecastingEngine } from './predictive-analytics';

// P5 Enterprise Components
export { ServiceRegistry, EventBus, DistributedTracer } from './microservices';
export { QueryBuilder, ConnectionPool, MigrationManager } from './database';
export { PluginLoader, PluginRegistry, PluginSandboxManager } from './plugins';

// Validation & Utilities
export * from './validation';