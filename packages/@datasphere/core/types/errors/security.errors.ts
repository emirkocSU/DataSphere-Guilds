/**
 * @fileoverview Enterprise-grade custom error types for the security module.
 * Provides structured error information for robust error handling and auditing.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export type ErrorCode =
  | 'AUTHENTICATION_FAILED'
  | 'AUTHORIZATION_FAILED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CSRF_TOKEN_INVALID'
  | 'MISSING_CREDENTIALS'
  | 'INSUFFICIENT_PERMISSIONS';

export interface SecurityErrorMetadata {
  errorCode: ErrorCode;
  timestamp: string;
  traceId?: string;
  details?: Record<string, any>;
}

export class SecurityError extends Error {
  public readonly metadata: SecurityErrorMetadata;

  constructor(message: string, metadata: Omit<SecurityErrorMetadata, 'timestamp'>) {
    super(message);
    this.name = 'SecurityError';
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

export class AuthenticationError extends SecurityError {
  constructor(message: string, metadata: Omit<SecurityErrorMetadata, 'timestamp'>) {
    super(message, metadata);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends SecurityError {
  constructor(message: string, metadata: Omit<SecurityErrorMetadata, 'timestamp'>) {
    super(message, metadata);
    this.name = 'AuthorizationError';
  }
} 