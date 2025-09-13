/**
 * @fileoverview Enterprise-grade, composable authentication and authorization decorators.
 * Integrates with a full suite of production-ready security modules.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import {
  EnrichedSecurityContext,
  RawSecurityContext,
} from '../types/security/auth.types';
import { Permission, UserRole } from '../types/business/user.types';
import { SecurityAuditLogger, SecurityEventType } from '../utils/security/audit-logger';
import { RateLimiter, RateLimiterOptions } from '../utils/rate-limiting/rate-limiter';
import { JWTValidator, JWTValidatorOptions } from '../utils/auth/jwt-validator';
import { PermissionChecker } from '../utils/auth/permission-checker';
import { SecurityError, AuthenticationError, AuthorizationError, ErrorCode } from '../types/errors/security.errors';
import { CacheManager } from '../utils/cache/manager';

// =================================================================
// INITIALIZATION (In a real app, this would use dependency injection)
// =================================================================
const cacheManager = new CacheManager();
const auditLogger = new SecurityAuditLogger();
const rateLimiter = new RateLimiter();
const jwtValidator = new JWTValidator();
const permissionChecker = new PermissionChecker(cacheManager);
// =================================================================

export interface AuthOptions {
  rateLimit?: Omit<RateLimiterOptions, 'provider'>;
  injectContext?: boolean; // Injects the EnrichedSecurityContext as the first argument
}

export function Authenticated(options: AuthOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let rawContext: RawSecurityContext = {};
      try {
        rawContext = extractRawContext(args);

        if (options.rateLimit) {
          const rateLimitKey = `auth:${rawContext.ipAddress || 'unknown_ip'}:${propertyKey}`;
          const { isBlocked } = await rateLimiter.check(rateLimitKey, options.rateLimit);
          if (isBlocked) {
            throw new SecurityError('Rate limit exceeded', { errorCode: 'RATE_LIMIT_EXCEEDED' });
          }
        }

        if (!rawContext.token) {
          throw new AuthenticationError('Authentication token not provided', {
            errorCode: 'MISSING_CREDENTIALS',
          });
        }

        const authResult = await jwtValidator.validate(rawContext.token);
        if (!authResult.isValid || !authResult.securityContext) {
          throw new AuthenticationError(authResult.failureReason || 'Authentication failed', {
            errorCode: (authResult.errorCode as ErrorCode) || 'AUTHENTICATION_FAILED',
          });
        }

        await auditLogger.log(
          SecurityEventType.USER_LOGIN_SUCCESS,
          authResult.securityContext,
          'SUCCESS'
        );
        
        const enhancedArgs = options.injectContext
          ? [authResult.securityContext, ...args]
          : args;

        return await originalMethod.apply(this, enhancedArgs);
      } catch (error) {
        const tempContext = createTemporaryContext(rawContext, error.metadata?.userId);
        await auditLogger.log(SecurityEventType.USER_LOGIN_FAILURE, tempContext, 'FAILURE', undefined, {
          error: error.message,
          errorCode: error.metadata?.errorCode,
        });
        throw error;
      }
    };
    return descriptor;
  };
}

export interface AuthzOptions {
  requireRoles?: UserRole[];
  requirePermission?: Permission;
  customCheck?: (context: EnrichedSecurityContext) => Promise<boolean>;
}

export function Authorized(options: AuthzOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const securityContext = findSecurityContext(args);
      if (!securityContext) {
        throw new AuthorizationError('Security context not found for authorization check', {
          errorCode: 'AUTHORIZATION_FAILED',
        });
      }

      let isAuthorized = true;
      let failureReason = '';

      if (options.requireRoles) {
        const hasRole = options.requireRoles.some(role => securityContext.roles.has(role));
        if (!hasRole) {
          isAuthorized = false;
          failureReason = `Missing one of required roles: ${options.requireRoles.join(', ')}`;
        }
      }

      if (isAuthorized && options.requirePermission) {
        const hasPermission = await permissionChecker.hasPermission(
          securityContext,
          options.requirePermission
        );
        if (!hasPermission) {
          isAuthorized = false;
          failureReason = `Missing required permission: ${JSON.stringify(options.requirePermission)}`;
        }
      }

      if (isAuthorized && options.customCheck) {
        isAuthorized = await options.customCheck(securityContext);
        if (!isAuthorized) {
          failureReason = 'Custom authorization check failed';
        }
      }

      if (!isAuthorized) {
        await auditLogger.log(
          SecurityEventType.RESOURCE_DENIED,
          securityContext,
          'FAILURE',
          undefined,
          { reason: failureReason }
        );
        throw new AuthorizationError(failureReason, {
          errorCode: 'INSUFFICIENT_PERMISSIONS',
        });
      }

      return await originalMethod.apply(this, args);
    };
    return descriptor;
  };
}


// ======================
// Helper Functions
// ======================

function extractRawContext(args: any[]): RawSecurityContext {
  for (const arg of args) {
    if (arg && typeof arg === 'object') {
      if (arg.headers?.authorization) {
        return {
          token: arg.headers.authorization.replace('Bearer ', ''),
          ipAddress: arg.headers['x-forwarded-for'] || arg.socket?.remoteAddress,
          userAgent: arg.headers['user-agent'],
        };
      }
    }
  }
  return {};
}

function findSecurityContext(args: any[]): EnrichedSecurityContext | undefined {
  return args.find(arg => arg && arg.user && arg.roles && arg.permissions);
}

function createTemporaryContext(
  raw: RawSecurityContext,
  userId?: string
): EnrichedSecurityContext {
  const mockUser: any = { id: userId || 'anonymous', roles: [], status: 'active' };
  return {
    user: mockUser,
    roles: new Set(),
    permissions: new Set(),
    token: raw.token || '',
    ipAddress: raw.ipAddress || 'unknown',
    userAgent: raw.userAgent || 'unknown',
    sessionId: raw.sessionId || 'unknown',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date().toISOString(),
    isImpersonating: false,
  };
}
