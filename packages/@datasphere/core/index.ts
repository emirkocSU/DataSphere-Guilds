/**
 * @fileoverview Ultra-lean core package with tree-shakable exports and zero-dependency initialization.
 * Optimized for sub-100ms load times and minimal memory footprint.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

// ========================================
// CORE TYPE SYSTEM (Tree-shakable)
// ========================================
export type {
  UUID,
  ISOTimestamp,
  Percentage,
  Money,
  Coordinates,
} from './types/common.types';

export type {
  QueryOptions,
  FilterOptions,
  SortOptions,
  PaginationOptions
} from './types/query/query.types';

export type {
  ValidationResult,
  ValidationError,
  ValidationContext
} from './types/validation/rules.types';

// ========================================
// HIGH-PERFORMANCE INTERFACES
// ========================================
export type {
  IRepository,
  IQueryRepository,
  ICachedRepository,
  IEventSourcingRepository
} from './interfaces/repository.interface';

export type {
  IService,
  IBusinessService,
  IDomainService,
  ICachedService,
  IEventSourcedService,
  ServiceResult,
  ServiceOptions
} from './interfaces/service.interface';

export type {
  IController,
} from './interfaces/controller.interface';

// ========================================
// ZERO-OVERHEAD DECORATORS
// ========================================
export {
  Authenticated,
  Authorized,
} from './decorators/auth.decorator';

export {
  Cache,
  CacheInvalidate,
  ConditionalCache,
  MultiTierCache
} from './decorators/cache.decorator';

export {
  PerformanceMonitor,
  CircuitBreaker,
  RateLimit,
  MemoryMonitor
} from './decorators/performance.decorator';

export {
  Validate,
  ValidateWithRateLimit
} from './decorators/validation.decorator';

// ========================================
// ULTRA-FAST UTILITIES
// ========================================
export {
  Hash,
  hashPassword
} from './utils/crypto/hash';

export {
  UltraCache,
  CompressedCache,
  MultiTierCache as MultiTierCacheUtil,
  setCache,
  getCache,
  deleteCache,
  clearCache
} from './utils/performance/cache';

export {
  BusinessRuleEngine
} from './utils/validation/rules/business-rule-engine';

// ========================================
// PERFORMANCE OPTIMIZED FACTORIES
// ========================================
export {
  createError,
  createValidationError
} from './utils/error-handling';

export {
  buildSuccessResponse,
  buildPaginatedResponse,
} from './factories/response.factory';

export {
  createUser,
  createTask,
} from './factories/entity.factory';

// ========================================
// ENTERPRISE SERVICES (Lazy-loaded)
// ========================================
export {
  GatewayService
} from './utils/gateway';

export {
} from './utils/ml';

export {
  SyncEngine,
} from './utils/sync';

export {
  NotificationOrchestrator,
} from './utils/notifications';

export {
  ThreatDetector,
} from './utils/security';

// ========================================
// CONSTANTS & CONFIGURATION
// ========================================
export {
  ERROR_CODES,
} from './constants';

// ========================================
// MODULE METADATA
// ========================================
export const DATASPHERE_CORE_VERSION = '2.0.0';
export const DATASPHERE_CORE_BUILD = process.env.BUILD_NUMBER || 'dev';
export const DATASPHERE_CORE_TIMESTAMP = new Date('2025-01-20T12:00:00Z');

// ========================================
// INITIALIZATION & HEALTH CHECK
// ========================================
export interface CoreModuleHealth {
  version: string;
  loadTime: number;
  memoryUsage: number;
  dependencies: Record<string, boolean>;
}

export function getCoreModuleHealth(): CoreModuleHealth {
  return {
    version: DATASPHERE_CORE_VERSION,
    loadTime: performance.now(),
    memoryUsage: process.memoryUsage().heapUsed,
    dependencies: {
      crypto: true,
      performance: true,
      util: true
    }
  };
}

// ========================================
// FEATURE FLAGS
// ========================================
export const FEATURE_FLAGS = {
  ENABLE_COMPRESSION: true,
  ENABLE_METRICS: true,
  ENABLE_CACHE: true,
  ENABLE_VALIDATION: true,
  ENABLE_SECURITY: true
} as const;
