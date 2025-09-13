/**
 * @fileoverview Unicorn-level decorator utilities for DataSphere enterprise operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

// Import modules to create aliases
import * as PerformanceDecorators from './performance.decorator';
import * as SecurityDecorators from './security.decorator';

// Authentication & Authorization decorators
export {
  Authenticated,
  Authorized,
  AuthOptions,
  AuthzOptions
} from './auth.decorator';

// Validation decorators
export {
  Validate,
  ValidateWithRateLimit
} from './validation.decorator';

// Caching decorators
export {
  Cache,
  CacheInvalidate,
  ConditionalCache,
  CacheConfig,
  cacheDecoratorMonitor
} from './cache.decorator';

// Performance decorators (avoiding RateLimit conflict)
export {
  PerformanceMonitor,
  CircuitBreaker,
  MemoryMonitor
} from './performance.decorator';

// Security decorators (avoiding RateLimit conflict)
export {
  Secure,
  SecurityConfig,
  securityDecoratorMonitor
} from './security.decorator';

// Logging decorators
export {
  Log,
  AuditLog,
  LogConfig,
  loggingDecoratorMonitor
} from './logging.decorator';

// Metrics decorators
export {
  Metrics,
  BusinessMetrics,
  MetricsConfig,
  metricsDecoratorMonitor
} from './metrics.decorator';

// Resolve RateLimit conflicts with descriptive aliases
export const PerformanceRateLimit = PerformanceDecorators.RateLimit;
export const SecurityRateLimit = SecurityDecorators.RateLimit;

// Additional convenience aliases
export const TokenBucketRateLimit = PerformanceDecorators.RateLimit;
export const SlidingWindowRateLimit = SecurityDecorators.RateLimit;

// Decorator utility types
export interface DecoratorOptions {
  enableMonitoring?: boolean;
  skipOnError?: boolean;
  async?: boolean;
}

// Performance monitoring aggregation for all decorators
export function getAllDecoratorMonitors() {
  const monitors = {
    cache: require('./cache.decorator').cacheDecoratorMonitor,
    security: require('./security.decorator').securityDecoratorMonitor,
    logging: require('./logging.decorator').loggingDecoratorMonitor,
    metrics: require('./metrics.decorator').metricsDecoratorMonitor
  };
  
  return monitors;
}

// Decorator composition utility for enterprise-grade method protection
export function ComposeDecorators(...decorators: Array<(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    return decorators.reduce((desc, decorator) => {
      return decorator(target, propertyKey, desc);
    }, descriptor);
  };
}
