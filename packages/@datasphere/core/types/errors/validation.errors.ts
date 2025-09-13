/**
 * @fileoverview Lean, high-performance validation error types for DataSphere
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export type ValidationErrorCode =
  | 'VALIDATION_FAILED'
  | 'REQUIRED_FIELD_MISSING'
  | 'INVALID_TYPE'
  | 'INVALID_FORMAT'
  | 'OUT_OF_RANGE'
  | 'DUPLICATE_VALUE'
  | 'BUSINESS_RULE_VIOLATION'
  | 'SCHEMA_MISMATCH';

export interface ValidationErrorDetail {
  field: string;
  code: ValidationErrorCode;
  message: string;
  value?: any;
  expected?: any;
}

export interface ValidationErrorMetadata {
  errorCode: ValidationErrorCode;
  timestamp: string;
  traceId?: string;
  details?: Record<string, any>;
}

export class ValidationError extends Error {
  public readonly details: ValidationErrorDetail[];
  public readonly metadata: ValidationErrorMetadata;

  constructor(
    message: string, 
    details: ValidationErrorDetail[] = [],
    metadata: Omit<ValidationErrorMetadata, 'timestamp'> = { errorCode: 'VALIDATION_FAILED' }
  ) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };
  }
}