/**
 * @fileoverview Lean, high-performance system error types for DataSphere
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export type SystemErrorCode =
  | 'SYSTEM_ERROR'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'DEPENDENCY_ERROR'
  | 'CIRCUIT_BREAKER_OPEN'
  | 'SERVICE_UNAVAILABLE';

export interface SystemErrorMetadata {
  errorCode: SystemErrorCode;
  timestamp: string;
  traceId?: string;
  service?: string;
  details?: Record<string, any>;
}

export class SystemError extends Error {
  public readonly metadata: SystemErrorMetadata;

  constructor(message: string, metadata: Omit<SystemErrorMetadata, 'timestamp'>) {
    super(message);
    this.name = 'SystemError';
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

export class DatabaseError extends SystemError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, {
      errorCode: 'DATABASE_ERROR',
      details
    });
    this.name = 'DatabaseError';
  }
}

export class NetworkError extends SystemError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, {
      errorCode: 'NETWORK_ERROR',
      details
    });
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends SystemError {
  constructor(operation: string, timeout: number) {
    super(`Operation '${operation}' timed out after ${timeout}ms`, {
      errorCode: 'TIMEOUT_ERROR',
      details: { operation, timeout }
    });
    this.name = 'TimeoutError';
  }
}