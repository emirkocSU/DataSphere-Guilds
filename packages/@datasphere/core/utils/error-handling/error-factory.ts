/**
 * @fileoverview Enterprise Error Factory - Advanced Error Creation System
 * 
 * Sophisticated error factory for creating standardized, contextual errors
 * with enterprise-grade features including correlation tracking, automatic
 * classification, and recovery strategy assignment.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity, 
  ErrorContext,
  RecoveryStrategy,
  CorrelationId,
  ErrorClassifier,
  ErrorTransformer
} from './types';
import { ISOTimestamp, UUID } from '../../types/common.types';

/**
 * Enterprise Error Factory Class
 * 
 * Provides advanced error creation with automatic classification,
 * context enrichment, and recovery strategy assignment.
 */
export class ErrorFactory {
  private static instance: ErrorFactory;
  private classifiers: Map<string, ErrorClassifier> = new Map();
  private transformers: Map<ErrorCategory, ErrorTransformer> = new Map();
  
  private constructor() {
    this.initializeDefaultClassifiers();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorFactory {
    if (!ErrorFactory.instance) {
      ErrorFactory.instance = new ErrorFactory();
    }
    return ErrorFactory.instance;
  }
  
  /**
   * Create enterprise-grade error with full context
   */
  public createError(
    options: {
      code: string;
      message: string;
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      cause?: Error;
      context?: Partial<ErrorContext>;
      retryable?: boolean;
      reportable?: boolean;
      tags?: string[];
      details?: Record<string, unknown>;
    }
  ): DataSphereError {
    const correlationId = uuidv4() as CorrelationId;
    const timestamp = new Date().toISOString() as ISOTimestamp;
    
    // Auto-classify if not provided
    const classification = this.classifyError(options.cause || new Error(options.message));
    
    // Build full context
    const fullContext: ErrorContext = {
      correlationId,
      service: options.context?.service || 'unknown',
      component: options.context?.component || 'unknown',
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        region: process.env.AWS_REGION,
        instanceId: process.env.INSTANCE_ID,
        ...options.context?.environment
      },
      ...options.context
    };
    
    const error: DataSphereError = Object.assign(new Error(options.message), {
      category: options.category || classification.category,
      severity: options.severity || classification.severity,
      code: options.code,
      message: options.message,
      cause: options.cause,
      context: fullContext,
      timestamp,
      retryable: options.retryable ?? classification.retryable,
      reportable: options.reportable ?? classification.reportable,
      tags: options.tags || [],
      details: options.details
    });
    
    // Apply category-specific transformations
    return this.applyTransformations(error);
  }
  
  /**
   * Create network error with specific handling
   */
  public createNetworkError(
    message: string,
    statusCode?: number,
    url?: string,
    context?: Partial<ErrorContext>
  ): DataSphereError {
    return this.createError({
      code: `NETWORK_ERROR_${statusCode || 'UNKNOWN'}`,
      message,
      category: ErrorCategory.NETWORK_ERROR,
      severity: this.getSeverityForNetworkError(statusCode),
      retryable: this.isRetryableNetworkError(statusCode),
      context: {
        ...context,
        request: {
          url,
          ...context?.request
        }
      },
      details: {
        statusCode,
        url
      },
      tags: ['network', 'http']
    });
  }
  
  /**
   * Create validation error
   */
  public createValidationError(
    message: string,
    field: string,
    value: unknown,
    rule: string,
    context?: Partial<ErrorContext>
  ): DataSphereError {
    return this.createError({
      code: 'VALIDATION_ERROR',
      message,
      category: ErrorCategory.VALIDATION_ERROR,
      severity: ErrorSeverity.WARN,
      retryable: false,
      context,
      details: {
        field,
        value,
        rule,
        validationType: 'input_validation'
      },
      tags: ['validation', 'input']
    });
  }
  
  /**
   * Create authentication error
   */
  public createAuthenticationError(
    message: string,
    userId?: string,
    attempt?: number,
    context?: Partial<ErrorContext>
  ): DataSphereError {
    return this.createError({
      code: 'AUTHENTICATION_FAILED',
      message,
      category: ErrorCategory.AUTHENTICATION_ERROR,
      severity: ErrorSeverity.WARN,
      retryable: false,
      reportable: true,
      context: {
        ...context,
        userId
      },
      details: {
        userId,
        attemptNumber: attempt,
        authenticationType: 'credential_based'
      },
      tags: ['auth', 'security']
    });
  }
  
  /**
   * Create database error
   */
  public createDatabaseError(
    message: string,
    operation: string,
    table?: string,
    query?: string,
    context?: Partial<ErrorContext>
  ): DataSphereError {
    return this.createError({
      code: `DATABASE_ERROR_${operation.toUpperCase()}`,
      message,
      category: ErrorCategory.DATABASE_ERROR,
      severity: ErrorSeverity.ERROR,
      retryable: this.isRetryableDatabaseOperation(operation),
      context,
      details: {
        operation,
        table,
        query: this.sanitizeQuery(query),
        databaseType: 'postgresql'
      },
      tags: ['database', 'persistence']
    });
  }
  
  /**
   * Create AI service error
   */
  public createAIServiceError(
    message: string,
    provider: string,
    model?: string,
    tokens?: number,
    context?: Partial<ErrorContext>
  ): DataSphereError {
    return this.createError({
      code: `AI_SERVICE_ERROR_${provider.toUpperCase()}`,
      message,
      category: ErrorCategory.AI_SERVICE_ERROR,
      severity: ErrorSeverity.ERROR,
      retryable: true,
      context,
      details: {
        provider,
        model,
        tokensUsed: tokens,
        serviceType: 'ai_inference'
      },
      tags: ['ai', 'ml', 'external_service']
    });
  }
  
  /**
   * Wrap existing error with DataSphere context
   */
  public wrapError(
    error: Error,
    context: Partial<ErrorContext>,
    category?: ErrorCategory
  ): DataSphereError {
    const classification = this.classifyError(error);
    
    return this.createError({
      code: error.name || 'WRAPPED_ERROR',
      message: error.message,
      category: category || classification.category,
      severity: classification.severity,
      cause: error,
      context,
      retryable: classification.retryable,
      reportable: classification.reportable
    });
  }
  
  /**
   * Register custom error classifier
   */
  public registerClassifier(name: string, classifier: ErrorClassifier): void {
    this.classifiers.set(name, classifier);
  }
  
  /**
   * Register category-specific transformer
   */
  public registerTransformer(category: ErrorCategory, transformer: ErrorTransformer): void {
    this.transformers.set(category, transformer);
  }
  
  /**
   * Initialize default error classifiers
   */
  private initializeDefaultClassifiers(): void {
    // Network error classifier
    this.classifiers.set('network', (error: Error) => ({
      category: ErrorCategory.NETWORK_ERROR,
      severity: error.message.includes('timeout') ? ErrorSeverity.WARN : ErrorSeverity.ERROR,
      retryable: !error.message.includes('4'),
      reportable: true
    }));
    
    // Database error classifier
    this.classifiers.set('database', (error: Error) => ({
      category: ErrorCategory.DATABASE_ERROR,
      severity: ErrorSeverity.ERROR,
      retryable: error.message.includes('connection') || error.message.includes('timeout'),
      reportable: true
    }));
    
    // Validation error classifier
    this.classifiers.set('validation', (error: Error) => ({
      category: ErrorCategory.VALIDATION_ERROR,
      severity: ErrorSeverity.WARN,
      retryable: false,
      reportable: false
    }));
  }
  
  /**
   * Classify error automatically
   */
  private classifyError(error: Error): {
    category: ErrorCategory;
    severity: ErrorSeverity;
    retryable: boolean;
    reportable: boolean;
  } {
    // Try each classifier
    for (const [name, classifier] of this.classifiers) {
      try {
        const result = classifier(error);
        if (result.category !== ErrorCategory.UNKNOWN_ERROR) {
          return result;
        }
      } catch {
        // Classifier failed, continue to next
      }
    }
    
    // Default classification
    return {
      category: ErrorCategory.UNKNOWN_ERROR,
      severity: ErrorSeverity.ERROR,
      retryable: false,
      reportable: true
    };
  }
  
  /**
   * Apply category-specific transformations
   */
  private applyTransformations(error: DataSphereError): DataSphereError {
    const transformer = this.transformers.get(error.category);
    if (transformer) {
      return transformer(error, error.context);
    }
    return error;
  }
  
  /**
   * Get severity for network errors based on status code
   */
  private getSeverityForNetworkError(statusCode?: number): ErrorSeverity {
    if (!statusCode) return ErrorSeverity.ERROR;
    
    if (statusCode >= 500) return ErrorSeverity.ERROR;
    if (statusCode >= 400) return ErrorSeverity.WARN;
    if (statusCode >= 300) return ErrorSeverity.INFO;
    return ErrorSeverity.DEBUG;
  }
  
  /**
   * Determine if network error is retryable
   */
  private isRetryableNetworkError(statusCode?: number): boolean {
    if (!statusCode) return true;
    
    // Client errors (4xx) are generally not retryable
    if (statusCode >= 400 && statusCode < 500) {
      return statusCode === 408 || statusCode === 429; // Timeout or rate limit
    }
    
    // Server errors (5xx) are retryable
    return statusCode >= 500;
  }
  
  /**
   * Determine if database operation is retryable
   */
  private isRetryableDatabaseOperation(operation: string): boolean {
    const retryableOps = ['select', 'count', 'exists'];
    const nonRetryableOps = ['insert', 'update', 'delete'];
    
    const lowerOp = operation.toLowerCase();
    
    if (retryableOps.includes(lowerOp)) return true;
    if (nonRetryableOps.includes(lowerOp)) return false;
    
    return false; // Conservative default
  }
  
  /**
   * Sanitize SQL query for logging
   */
  private sanitizeQuery(query?: string): string | undefined {
    if (!query) return undefined;
    
    // Remove sensitive data patterns
    return query
      .replace(/password\s*=\s*'[^']*'/gi, "password='***'")
      .replace(/token\s*=\s*'[^']*'/gi, "token='***'")
      .replace(/secret\s*=\s*'[^']*'/gi, "secret='***'")
      .trim();
  }
}

// Export singleton instance for convenience
export const errorFactory = ErrorFactory.getInstance();

// Legacy compatibility exports
export { DataSphereError as CustomError };
export { ErrorSeverity };

/**
 * Quick error creation functions for common use cases
 */
export const createError = (
  code: string,
  message: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  details?: Record<string, unknown>
): DataSphereError => {
  return errorFactory.createError({
    code,
    message,
    severity,
    details
  });
};

export const createNetworkError = (
  message: string,
  statusCode?: number,
  url?: string
): DataSphereError => {
  return errorFactory.createNetworkError(message, statusCode, url);
};

export const createValidationError = (
  message: string,
  field: string,
  value: unknown,
  rule: string
): DataSphereError => {
  return errorFactory.createValidationError(message, field, value, rule);
};

export const wrapError = (
  error: Error,
  context: Partial<ErrorContext>
): DataSphereError => {
  return errorFactory.wrapError(error, context);
};