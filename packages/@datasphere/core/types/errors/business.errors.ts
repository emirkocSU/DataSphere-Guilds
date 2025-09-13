/**
 * @fileoverview Lean, high-performance business error types for DataSphere
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export type BusinessErrorCode =
  | 'BUSINESS_RULE_VIOLATION'
  | 'WORKFLOW_ERROR'
  | 'STATE_TRANSITION_ERROR'
  | 'RESOURCE_NOT_FOUND'
  | 'RESOURCE_CONFLICT'
  | 'OPERATION_NOT_ALLOWED'
  | 'QUOTA_EXCEEDED'
  | 'PAYMENT_REQUIRED';

export interface BusinessErrorMetadata {
  errorCode: BusinessErrorCode;
  timestamp: string;
  traceId?: string;
  context?: Record<string, any>;
  details?: Record<string, any>;
}

export class BusinessError extends Error {
  public readonly metadata: BusinessErrorMetadata;

  constructor(message: string, metadata: Omit<BusinessErrorMetadata, 'timestamp'>) {
    super(message);
    this.name = 'BusinessError';
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

export class ResourceNotFoundError extends BusinessError {
  constructor(resource: string, id: string, details?: Record<string, any>) {
    super(`${resource} with id '${id}' not found`, {
      errorCode: 'RESOURCE_NOT_FOUND',
      context: { resource, id },
      details
    });
    this.name = 'ResourceNotFoundError';
  }
}

export class ResourceConflictError extends BusinessError {
  constructor(resource: string, conflict: string, details?: Record<string, any>) {
    super(`${resource} conflict: ${conflict}`, {
      errorCode: 'RESOURCE_CONFLICT',
      context: { resource, conflict },
      details
    });
    this.name = 'ResourceConflictError';
  }
}