/** @fileoverview Advanced validation decorators with performance monitoring and caching. */

import { validateSchema, SchemaValidationOptions } from '../utils/schema-validator';
import { Logger } from '../utils/logging/logger';
import { PerformanceMonitor } from '../utils/performance/monitor';
import { CacheManager } from '../utils/cache/manager';
import { ValidationError, ValidationMetrics } from '../types/validation/decorator.types';

const logger = new Logger('ValidationDecorator');
const performanceMonitor = new PerformanceMonitor();
const cache = new CacheManager();

/**
 * Advanced validation decorator with caching, performance monitoring, and detailed error reporting
 * @param schema - JSON schema or validation function
 * @param options - Validation configuration options
 */
export function Validate<T = any>(
  schema: object | ((data: T) => boolean),
  options: ValidationDecoratorOptions = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      
      try {
        // Extract validation data based on options
        const dataToValidate = options.argumentIndex !== undefined 
          ? args[options.argumentIndex]
          : args[0];

        // Generate cache key if caching is enabled
        let cacheKey: string | undefined;
        if (options.enableCaching) {
          cacheKey = generateValidationCacheKey(methodName, dataToValidate);
          const cachedResult = await cache.get(cacheKey);
          if (cachedResult) {
            logger.debug(`Validation cache hit for ${methodName}`);
            return originalMethod.apply(this, args);
          }
        }

        // Perform validation
        const validationResult = typeof schema === 'function'
          ? { isValid: schema(dataToValidate), errors: [] }
          : await validateSchema(dataToValidate, schema, {
              strict: options.strict ?? true,
              coerceTypes: options.coerceTypes ?? false,
              allowAdditional: options.allowAdditional ?? false
            });

        if (!validationResult.isValid) {
          const validationError = new ValidationError(
            `Validation failed for ${methodName}`,
            validationResult.errors || [],
            {
              method: methodName,
              schema: typeof schema === 'object' ? schema : 'function',
              data: options.includeDataInError ? dataToValidate : '[REDACTED]'
            }
          );

          logger.warn(`Validation failed for ${methodName}:`, validationError.details);
          throw validationError;
        }

        // Cache successful validation if enabled
        if (options.enableCaching && cacheKey) {
          await cache.set(cacheKey, true, options.cacheTimeout || 300000);
        }

        // Record performance metrics
        const executionTime = performance.now() - startTime;
        performanceMonitor.recordMetric({
          name: 'validation_execution_time',
          value: executionTime,
          tags: { method: methodName, result: 'success' }
        });

        return originalMethod.apply(this, args);
      } catch (error) {
        const executionTime = performance.now() - startTime;
        performanceMonitor.recordMetric({
          name: 'validation_execution_time',
          value: executionTime,
          tags: { method: methodName, result: 'error' }
        });

        if (error instanceof ValidationError) {
          throw error;
        }

        logger.error(`Unexpected error in validation decorator for ${methodName}:`, error);
        throw new ValidationError(
          `Validation decorator error for ${methodName}`,
          [{ code: 'DECORATOR_ERROR', message: error.message }],
          { method: methodName, originalError: error }
        );
      }
    };

    return descriptor;
  };
}

/**
 * Rate limiting validation decorator
 */
export function ValidateWithRateLimit<T = any>(
  schema: object | ((data: T) => boolean),
  rateLimit: RateLimitConfig,
  options: ValidationDecoratorOptions = {}
) {
  const rateLimitCache = new Map<string, RateLimitInfo>();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const clientId = options.getClientId ? options.getClientId(args) : 'default';
      const rateLimitKey = `${methodName}:${clientId}`;
      
      // Check rate limit
      const now = Date.now();
      const rateLimitInfo = rateLimitCache.get(rateLimitKey) || {
        count: 0,
        windowStart: now
      };

      if (now - rateLimitInfo.windowStart > rateLimit.windowMs) {
        rateLimitInfo.count = 0;
        rateLimitInfo.windowStart = now;
      }

      if (rateLimitInfo.count >= rateLimit.maxRequests) {
        throw new ValidationError(
          `Rate limit exceeded for ${methodName}`,
          [{ code: 'RATE_LIMIT_EXCEEDED', message: `Maximum ${rateLimit.maxRequests} requests per ${rateLimit.windowMs}ms` }],
          { method: methodName, clientId, rateLimitInfo }
        );
      }

      rateLimitInfo.count++;
      rateLimitCache.set(rateLimitKey, rateLimitInfo);

      // Apply validation decorator
      const validateDecorator = Validate(schema, options);
      return validateDecorator(target, propertyKey, descriptor).value.apply(this, args);
    };

    return descriptor;
  };
}

function generateValidationCacheKey(methodName: string, data: any): string {
  const dataHash = JSON.stringify(data).slice(0, 100);
  return `validation:${methodName}:${dataHash}`;
}

interface ValidationDecoratorOptions {
  argumentIndex?: number;
  enableCaching?: boolean;
  cacheTimeout?: number;
  strict?: boolean;
  coerceTypes?: boolean;
  allowAdditional?: boolean;
  includeDataInError?: boolean;
  getClientId?: (args: any[]) => string;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitInfo {
  count: number;
  windowStart: number;
}
