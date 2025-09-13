/**
 * @fileoverview Enterprise Error Handler - Global Error Management System
 * 
 * Comprehensive error handling service providing centralized error processing,
 * recovery strategies, circuit breaker integration, and real-time monitoring
 * for unicorn-level enterprise applications.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity, 
  ErrorHandlerConfig,
  RecoveryStrategy,
  RecoveryConfig,
  ErrorEvent,
  CorrelationId,
  ISOTimestamp,
  ErrorRecoveryFn
} from './types';
import { errorFactory } from './error-factory';
import { CircuitBreaker, circuitBreakerRegistry } from './circuit-breaker';

interface ErrorHandlerMetrics {
  totalErrors: number;
  errorsHandled: number;
  errorsRecovered: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  averageProcessingTime: number;
  lastProcessed: ISOTimestamp;
}

interface RecoveryAttempt {
  correlationId: CorrelationId;
  strategy: RecoveryStrategy;
  attempts: number;
  maxAttempts: number;
  nextAttempt: number;
  lastError?: DataSphereError;
}

/**
 * Enterprise Error Handler Class
 * 
 * Provides centralized error handling with automatic recovery, circuit breaker
 * integration, structured logging, and real-time monitoring capabilities.
 */
export class ErrorHandler extends EventEmitter {
  private static instance: ErrorHandler;
  private config: ErrorHandlerConfig;
  private metrics: ErrorHandlerMetrics;
  private recoveryAttempts: Map<CorrelationId, RecoveryAttempt> = new Map();
  private recoveryFunctions: Map<ErrorCategory, ErrorRecoveryFn> = new Map();
  private errorQueue: Array<{ error: DataSphereError; timestamp: number }> = [];
  private processingTimer?: NodeJS.Timeout;

  private constructor(config: ErrorHandlerConfig) {
    super();
    this.config = config;
    this.metrics = {
      totalErrors: 0,
      errorsHandled: 0,
      errorsRecovered: 0,
      errorsByCategory: Object.values(ErrorCategory).reduce((acc, cat) => {
        acc[cat] = 0;
        return acc;
      }, {} as Record<ErrorCategory, number>),
      errorsBySeverity: Object.values(ErrorSeverity).reduce((acc, sev) => {
        acc[sev] = 0;
        return acc;
      }, {} as Record<ErrorSeverity, number>),
      averageProcessingTime: 0,
      lastProcessed: new Date().toISOString() as ISOTimestamp
    };

    this.initializeRecoveryFunctions();
    this.startErrorProcessing();
    this.setupGlobalHandlers();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: ErrorHandlerConfig): ErrorHandler {
    if (!ErrorHandler.instance) {
      if (!config) {
        throw new Error('ErrorHandler requires configuration on first instantiation');
      }
      ErrorHandler.instance = new ErrorHandler(config);
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle error with recovery and monitoring
   */
  public async handle(
    error: Error | DataSphereError,
    context?: Partial<{ correlationId: CorrelationId; source: string; metadata: Record<string, unknown> }>
  ): Promise<{ handled: boolean; recovered: boolean; result?: unknown }> {
    const startTime = Date.now();
    
    try {
      // Convert to DataSphereError if needed
      const dsError = this.normalizeError(error, context);
      
      // Update metrics
      this.updateMetrics(dsError);
      
      // Create error event
      const errorEvent: ErrorEvent = {
        id: dsError.context.correlationId,
        error: dsError,
        timestamp: new Date().toISOString() as ISOTimestamp,
        metadata: context?.metadata
      };

      // Emit error event for monitoring
      this.emit('error-received', errorEvent);

      // Check if error should be processed
      if (!this.shouldProcessError(dsError)) {
        return { handled: false, recovered: false };
      }

      // Add to processing queue if configured
      if (this.config.performance.maxQueueSize > 0) {
        this.errorQueue.push({ error: dsError, timestamp: Date.now() });
        this.trimErrorQueue();
      }

      // Attempt recovery
      const recoveryResult = await this.attemptRecovery(dsError);
      
      // Update processing metrics
      const processingTime = Date.now() - startTime;
      this.updateProcessingMetrics(processingTime);

      // Emit completion event
      this.emit('error-processed', {
        ...errorEvent,
        recovery: recoveryResult,
        metadata: { ...context?.metadata, processingTime }
      });

      return {
        handled: true,
        recovered: recoveryResult.successful,
        result: recoveryResult.result
      };

    } catch (handlingError) {
      // Handle errors in error handling
      const processingTime = Date.now() - startTime;
      this.emit('handler-error', {
        originalError: error,
        handlingError,
        processingTime,
        context
      });

      return { handled: false, recovered: false };
    }
  }

  /**
   * Register custom recovery function for error category
   */
  public registerRecoveryFunction(category: ErrorCategory, recoveryFn: ErrorRecoveryFn): void {
    this.recoveryFunctions.set(category, recoveryFn);
  }

  /**
   * Get error handler metrics
   */
  public getMetrics(): ErrorHandlerMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current configuration
   */
  public getConfig(): ErrorHandlerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get recovery attempts status
   */
  public getRecoveryStatus(): Array<{
    correlationId: CorrelationId;
    strategy: RecoveryStrategy;
    attempts: number;
    maxAttempts: number;
    nextAttempt: Date;
    status: 'pending' | 'in-progress' | 'exhausted';
  }> {
    const now = Date.now();
    return Array.from(this.recoveryAttempts.values()).map(attempt => ({
      correlationId: attempt.correlationId,
      strategy: attempt.strategy,
      attempts: attempt.attempts,
      maxAttempts: attempt.maxAttempts,
      nextAttempt: new Date(attempt.nextAttempt),
      status: attempt.attempts >= attempt.maxAttempts ? 'exhausted' :
              attempt.nextAttempt > now ? 'pending' : 'in-progress'
    }));
  }

  /**
   * Clear recovery attempts (useful for testing)
   */
  public clearRecoveryAttempts(): void {
    this.recoveryAttempts.clear();
  }

  /**
   * Shutdown error handler gracefully
   */
  public async shutdown(): Promise<void> {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
    }

    // Process remaining errors in queue
    if (this.errorQueue.length > 0) {
      await this.processErrorQueue();
    }

    this.emit('shutdown', { 
      finalMetrics: this.getMetrics(),
      queueSize: this.errorQueue.length,
      activeRecoveries: this.recoveryAttempts.size
    });
  }

  /**
   * Normalize error to DataSphereError
   */
  private normalizeError(
    error: Error | DataSphereError, 
    context?: Partial<{ correlationId: CorrelationId; source: string; metadata: Record<string, unknown> }>
  ): DataSphereError {
    if (this.isDataSphereError(error)) {
      return error;
    }

    return errorFactory.wrapError(error, {
      correlationId: context?.correlationId!,
      service: context?.source || 'unknown',
      component: 'error-handler',
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0'
      },
      metadata: context?.metadata
    });
  }

  /**
   * Check if error is DataSphereError
   */
  private isDataSphereError(error: Error | DataSphereError): error is DataSphereError {
    return 'category' in error && 'severity' in error && 'context' in error;
  }

  /**
   * Update error metrics
   */
  private updateMetrics(error: DataSphereError): void {
    this.metrics.totalErrors++;
    this.metrics.errorsByCategory[error.category]++;
    this.metrics.errorsBySeverity[error.severity]++;
    this.metrics.lastProcessed = new Date().toISOString() as ISOTimestamp;
  }

  /**
   * Update processing time metrics
   */
  private updateProcessingMetrics(processingTime: number): void {
    const total = this.metrics.averageProcessingTime * this.metrics.errorsHandled + processingTime;
    this.metrics.errorsHandled++;
    this.metrics.averageProcessingTime = total / this.metrics.errorsHandled;
  }

  /**
   * Check if error should be processed
   */
  private shouldProcessError(error: DataSphereError): boolean {
    // Check severity threshold
    const severityLevels = {
      [ErrorSeverity.TRACE]: 0,
      [ErrorSeverity.DEBUG]: 1,
      [ErrorSeverity.INFO]: 2,
      [ErrorSeverity.WARN]: 3,
      [ErrorSeverity.ERROR]: 4,
      [ErrorSeverity.FATAL]: 5
    };

    const configLevel = severityLevels[this.config.logging.level];
    const errorLevel = severityLevels[error.severity];

    return errorLevel >= configLevel;
  }

  /**
   * Attempt error recovery
   */
  private async attemptRecovery(error: DataSphereError): Promise<{
    strategy: RecoveryStrategy;
    attempts: number;
    successful: boolean;
    duration: number;
    result?: unknown;
  }> {
    const startTime = Date.now();
    const correlationId = error.context.correlationId;
    
    // Get recovery configuration
    const recoveryConfig = this.getRecoveryConfig(error);
    
    if (recoveryConfig.strategy === RecoveryStrategy.NONE) {
      return {
        strategy: RecoveryStrategy.NONE,
        attempts: 0,
        successful: false,
        duration: Date.now() - startTime
      };
    }

    // Get or create recovery attempt
    let attempt = this.recoveryAttempts.get(correlationId);
    if (!attempt) {
      attempt = {
        correlationId,
        strategy: recoveryConfig.strategy,
        attempts: 0,
        maxAttempts: recoveryConfig.maxRetries || 3,
        nextAttempt: Date.now()
      };
      this.recoveryAttempts.set(correlationId, attempt);
    }

    // Check if recovery should be attempted
    if (attempt.attempts >= attempt.maxAttempts || Date.now() < attempt.nextAttempt) {
      return {
        strategy: attempt.strategy,
        attempts: attempt.attempts,
        successful: false,
        duration: Date.now() - startTime
      };
    }

    // Perform recovery
    try {
      let result: unknown;
      
      switch (recoveryConfig.strategy) {
        case RecoveryStrategy.RETRY:
          result = await this.executeRetryRecovery(error, recoveryConfig, attempt);
          break;
          
        case RecoveryStrategy.FALLBACK:
          result = await this.executeFallbackRecovery(error, recoveryConfig, attempt);
          break;
          
        case RecoveryStrategy.CIRCUIT_BREAKER:
          result = await this.executeCircuitBreakerRecovery(error, recoveryConfig, attempt);
          break;
          
        case RecoveryStrategy.GRACEFUL_DEGRADATION:
          result = await this.executeGracefulDegradation(error, recoveryConfig, attempt);
          break;
          
        default:
          throw new Error(`Unsupported recovery strategy: ${recoveryConfig.strategy}`);
      }

      // Recovery successful
      this.recoveryAttempts.delete(correlationId);
      this.metrics.errorsRecovered++;

      return {
        strategy: recoveryConfig.strategy,
        attempts: attempt.attempts + 1,
        successful: true,
        duration: Date.now() - startTime,
        result
      };

    } catch (recoveryError) {
      // Recovery failed
      attempt.attempts++;
      attempt.lastError = error;
      
      if (recoveryConfig.retryDelay) {
        const delay = this.calculateRetryDelay(attempt.attempts, recoveryConfig);
        attempt.nextAttempt = Date.now() + delay;
      }

      return {
        strategy: recoveryConfig.strategy,
        attempts: attempt.attempts,
        successful: false,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Get recovery configuration for error
   */
  private getRecoveryConfig(error: DataSphereError): RecoveryConfig {
    const categoryConfig = this.config.categoryRecovery[error.category];
    if (categoryConfig) {
      return categoryConfig;
    }

    return {
      strategy: this.config.defaultRecovery,
      maxRetries: 3,
      retryDelay: 1000,
      backoffFactor: 2,
      maxRetryDelay: 30000,
      timeout: 30000
    };
  }

  /**
   * Execute retry recovery
   */
  private async executeRetryRecovery(
    error: DataSphereError, 
    config: RecoveryConfig, 
    attempt: RecoveryAttempt
  ): Promise<unknown> {
    const recoveryFn = this.recoveryFunctions.get(error.category);
    if (recoveryFn) {
      return await recoveryFn(error, config, attempt.attempts + 1);
    }
    throw new Error('No recovery function available');
  }

  /**
   * Execute fallback recovery
   */
  private async executeFallbackRecovery(
    error: DataSphereError, 
    config: RecoveryConfig, 
    attempt: RecoveryAttempt
  ): Promise<unknown> {
    if (config.fallbackFn) {
      return await config.fallbackFn();
    }
    throw new Error('No fallback function configured');
  }

  /**
   * Execute circuit breaker recovery
   */
  private async executeCircuitBreakerRecovery(
    error: DataSphereError, 
    config: RecoveryConfig, 
    attempt: RecoveryAttempt
  ): Promise<unknown> {
    const circuitBreaker = circuitBreakerRegistry.get(`${error.context.service}-${error.category}`);
    if (circuitBreaker) {
      const recoveryFn = this.recoveryFunctions.get(error.category);
      if (recoveryFn) {
        return await circuitBreaker.execute(
          () => recoveryFn(error, config, attempt.attempts + 1),
          error.context.correlationId,
          config.fallbackFn
        );
      }
    }
    throw new Error('Circuit breaker recovery not available');
  }

  /**
   * Execute graceful degradation
   */
  private async executeGracefulDegradation(
    error: DataSphereError, 
    config: RecoveryConfig, 
    attempt: RecoveryAttempt
  ): Promise<unknown> {
    if (config.fallbackFn) {
      return await config.fallbackFn();
    }
    return null; // Graceful degradation with null result
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attemptNumber: number, config: RecoveryConfig): number {
    const baseDelay = config.retryDelay || 1000;
    const backoffFactor = config.backoffFactor || 2;
    const maxDelay = config.maxRetryDelay || 30000;
    
    const delay = baseDelay * Math.pow(backoffFactor, attemptNumber - 1);
    return Math.min(delay, maxDelay);
  }

  /**
   * Initialize default recovery functions
   */
  private initializeRecoveryFunctions(): void {
    // Network error recovery
    this.recoveryFunctions.set(ErrorCategory.NETWORK_ERROR, async (error, config, attempt) => {
      // Implement network retry logic
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      return { retried: true, attempt };
    });

    // Database error recovery
    this.recoveryFunctions.set(ErrorCategory.DATABASE_ERROR, async (error, config, attempt) => {
      // Implement database connection retry
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      return { retried: true, attempt };
    });
  }

  /**
   * Start error processing timer
   */
  private startErrorProcessing(): void {
    if (this.config.performance.maxQueueSize > 0) {
      this.processingTimer = setInterval(() => {
        this.processErrorQueue();
      }, 5000); // Process every 5 seconds
    }
  }

  /**
   * Process queued errors
   */
  private async processErrorQueue(): Promise<void> {
    const now = Date.now();
    const timeout = this.config.performance.processingTimeout;
    
    const expiredErrors = this.errorQueue.filter(item => now - item.timestamp > timeout);
    
    for (const item of expiredErrors) {
      this.emit('error-timeout', {
        error: item.error,
        queueTime: now - item.timestamp,
        timeout
      });
    }

    // Remove expired errors
    this.errorQueue = this.errorQueue.filter(item => now - item.timestamp <= timeout);
  }

  /**
   * Trim error queue to max size
   */
  private trimErrorQueue(): void {
    if (this.errorQueue.length > this.config.performance.maxQueueSize) {
      const removed = this.errorQueue.splice(0, this.errorQueue.length - this.config.performance.maxQueueSize);
      this.emit('queue-overflow', { removedCount: removed.length });
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.handle(error, { 
        source: 'uncaughtException',
        metadata: { type: 'uncaught-exception' }
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      this.handle(error, { 
        source: 'unhandledRejection',
        metadata: { type: 'unhandled-rejection' }
      });
    });
  }
}

// Legacy compatibility export
export { ErrorHandler as GlobalErrorHandler };

/**
 * Create default error handler instance
 */
export const createErrorHandler = (config: Partial<ErrorHandlerConfig> = {}): ErrorHandler => {
  const defaultConfig: ErrorHandlerConfig = {
    defaultRecovery: RecoveryStrategy.RETRY,
    categoryRecovery: {},
    circuitBreaker: {
      failureThreshold: 0.5,
      successThreshold: 3,
      timeout: 60000,
      monitoringWindow: 120000,
      minimumCallsThreshold: 10
    },
    alerts: {},
    logging: {
      enabled: true,
      level: ErrorSeverity.WARN,
      structured: true,
      includeStackTrace: true,
      sensitiveFields: ['password', 'token', 'secret', 'key']
    },
    monitoring: {
      enabled: true,
      samplingRate: 1.0,
      retentionDays: 30,
      aggregationInterval: 300000 // 5 minutes
    },
    performance: {
      maxConcurrentRecoveries: 10,
      maxQueueSize: 1000,
      processingTimeout: 30000
    }
  };

  return ErrorHandler.getInstance({ ...defaultConfig, ...config });
};