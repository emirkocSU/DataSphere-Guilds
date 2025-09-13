/**
 * @fileoverview Enterprise Error Handling Service - Unified Error Management
 * 
 * Main orchestration service that unifies all error handling components into
 * a single, enterprise-grade error management system for unicorn-level
 * applications with comprehensive error handling, monitoring, and recovery.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity,
  ErrorHandlerConfig,
  RecoveryStrategy,
  CorrelationId,
  ISOTimestamp,
  ErrorEvent,
  ErrorMetrics,
  HealthCheckResult
} from './types';

import { ErrorFactory, errorFactory } from './error-factory';
import { ErrorHandler, createErrorHandler } from './error-handler';
import { ErrorLogger, createErrorLogger } from './error-logger';
import { ErrorRecovery, errorRecovery } from './error-recovery';
import { ErrorMonitor, createErrorMonitor } from './error-monitoring';
import { ErrorAnalytics, createErrorAnalytics } from './error-analytics';
import { CircuitBreaker, circuitBreakerRegistry, createCircuitBreaker } from './circuit-breaker';

interface ErrorHandlingServiceConfig {
  enabled: boolean;
  globalErrorHandling: boolean;
  service: {
    name: string;
    version: string;
    environment: string;
  };
  components: {
    errorHandler: Partial<ErrorHandlerConfig>;
    logger: any;
    monitoring: any;
    analytics: any;
    circuitBreaker: any;
  };
  integrations: {
    sentry?: { dsn: string; };
    datadog?: { apiKey: string; site: string; };
    newrelic?: { licenseKey: string; };
    prometheus?: { endpoint: string; };
    slack?: { webhookUrl: string; };
  };
}

interface ServiceMetrics {
  totalErrors: number;
  totalRecovered: number;
  totalMonitored: number;
  activeCircuitBreakers: number;
  activeRecoveries: number;
  averageProcessingTime: number;
  uptime: number;
  lastHealthCheck: ISOTimestamp;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
}

/**
 * Enterprise Error Handling Service
 * 
 * Unified service that orchestrates all error handling components,
 * providing a single interface for enterprise-grade error management.
 */
export class ErrorHandlingService extends EventEmitter {
  private static instance: ErrorHandlingService;
  private config: ErrorHandlingServiceConfig;
  private isInitialized: boolean = false;
  private startTime: number = Date.now();

  // Core Components
  private errorFactory: ErrorFactory;
  private errorHandler: ErrorHandler;
  private errorLogger: ErrorLogger;
  private errorRecovery: ErrorRecovery;
  private errorMonitor: ErrorMonitor;
  private errorAnalytics: ErrorAnalytics;

  // Metrics and monitoring
  private metrics: ServiceMetrics;
  private metricsTimer?: NodeJS.Timeout;
  private healthCheckTimer?: NodeJS.Timeout;

  private constructor(config: ErrorHandlingServiceConfig) {
    super();
    this.config = config;

    this.metrics = {
      totalErrors: 0,
      totalRecovered: 0,
      totalMonitored: 0,
      activeCircuitBreakers: 0,
      activeRecoveries: 0,
      averageProcessingTime: 0,
      uptime: 0,
      lastHealthCheck: new Date().toISOString() as ISOTimestamp,
      healthStatus: 'healthy'
    };

    // Initialize components
    this.initializeComponents();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: ErrorHandlingServiceConfig): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      if (!config) {
        throw new Error('ErrorHandlingService requires configuration on first instantiation');
      }
      ErrorHandlingService.instance = new ErrorHandlingService(config);
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Initialize the error handling service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Setup global error handlers if enabled
      if (this.config.globalErrorHandling) {
        this.setupGlobalErrorHandlers();
      }

      // Setup component event listeners
      this.setupEventListeners();

      // Start metrics and health monitoring
      this.startMetricsCollection();
      this.startHealthChecking();

      this.isInitialized = true;
      
      this.emit('service-initialized', {
        service: this.config.service,
        timestamp: new Date().toISOString(),
        components: {
          errorHandler: !!this.errorHandler,
          logger: !!this.errorLogger,
          monitoring: !!this.errorMonitor,
          analytics: !!this.errorAnalytics,
          recovery: !!this.errorRecovery
        }
      });

      // Log successful initialization
      await this.errorLogger.info('Error handling service initialized', {
        service: this.config.service.name,
        version: this.config.service.version,
        environment: this.config.service.environment
      });

    } catch (error) {
      this.emit('initialization-error', { error, timestamp: new Date().toISOString() });
      throw error;
    }
  }

  /**
   * Handle error with full enterprise pipeline
   */
  public async handleError(
    error: Error | DataSphereError,
    context?: {
      correlationId?: CorrelationId;
      source?: string;
      userId?: string;
      sessionId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<{
    handled: boolean;
    recovered: boolean;
    correlationId: CorrelationId;
    processingTime: number;
    result?: unknown;
  }> {
    const startTime = Date.now();
    let correlationId = context?.correlationId;

    try {
      // Generate correlation ID if not provided
      if (!correlationId) {
        correlationId = `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as CorrelationId;
      }

      // Convert to DataSphereError if needed
      let dsError: DataSphereError;
      if (this.isDataSphereError(error)) {
        dsError = error;
      } else {
        dsError = this.errorFactory.wrapError(error, {
          correlationId,
          service: this.config.service.name,
          component: context?.source || 'unknown',
          userId: context?.userId,
          sessionId: context?.sessionId,
          environment: {
            nodeEnv: this.config.service.environment,
            version: this.config.service.version
          },
          metadata: context?.metadata
        });
      }

      // Create error event
      const errorEvent: ErrorEvent = {
        id: correlationId,
        error: dsError,
        timestamp: new Date().toISOString() as ISOTimestamp,
        metadata: context?.metadata
      };

      // Process through error handling pipeline
      const [handlingResult, monitoringResult, analyticsResult] = await Promise.allSettled([
        this.errorHandler.handle(dsError, {
          correlationId,
          source: context?.source,
          metadata: context?.metadata
        }),
        this.errorMonitor.trackError(errorEvent),
        this.errorAnalytics.recordError(dsError)
      ]);

      // Log the error
      await this.errorLogger.log(dsError, context?.metadata, {
        duration: Date.now() - startTime
      });

      // Update metrics
      this.updateMetrics(startTime, handlingResult.status === 'fulfilled' ? handlingResult.value.recovered : false);

      // Emit service-level event
      this.emit('error-processed', {
        correlationId,
        error: dsError,
        handled: handlingResult.status === 'fulfilled' ? handlingResult.value.handled : false,
        recovered: handlingResult.status === 'fulfilled' ? handlingResult.value.recovered : false,
        processingTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });

      return {
        handled: handlingResult.status === 'fulfilled' ? handlingResult.value.handled : false,
        recovered: handlingResult.status === 'fulfilled' ? handlingResult.value.recovered : false,
        correlationId,
        processingTime: Date.now() - startTime,
        result: handlingResult.status === 'fulfilled' ? handlingResult.value.result : undefined
      };

    } catch (serviceError) {
      // Handle errors in error handling service itself
      const processingTime = Date.now() - startTime;
      
      this.emit('service-error', {
        originalError: error,
        serviceError,
        correlationId,
        processingTime,
        timestamp: new Date().toISOString()
      });

      // Try to log the service error
      try {
        await this.errorLogger.error('Error handling service failure', {
          originalError: error.message,
          serviceError: serviceError instanceof Error ? serviceError.message : String(serviceError),
          correlationId,
          processingTime
        });
      } catch {
        // If logging fails, emit console error as fallback
        console.error('Critical: Error handling service failure', {
          originalError: error.message,
          serviceError,
          correlationId,
          processingTime
        });
      }

      return {
        handled: false,
        recovered: false,
        correlationId: correlationId || 'unknown' as CorrelationId,
        processingTime
      };
    }
  }

  /**
   * Create standardized error
   */
  public createError(
    code: string,
    message: string,
    options?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      cause?: Error;
      retryable?: boolean;
      metadata?: Record<string, unknown>;
    }
  ): DataSphereError {
    return this.errorFactory.createError({
      code,
      message,
      category: options?.category || ErrorCategory.UNKNOWN_ERROR,
      severity: options?.severity || ErrorSeverity.ERROR,
      cause: options?.cause,
      retryable: options?.retryable,
      context: {
        correlationId: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as CorrelationId,
        service: this.config.service.name,
        component: 'service',
        environment: {
          nodeEnv: this.config.service.environment,
          version: this.config.service.version
        },
        metadata: options?.metadata
      }
    });
  }

  /**
   * Create network error
   */
  public createNetworkError(
    message: string,
    statusCode?: number,
    url?: string,
    metadata?: Record<string, unknown>
  ): DataSphereError {
    return this.errorFactory.createNetworkError(message, statusCode, url, {
      correlationId: `net-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as CorrelationId,
      service: this.config.service.name,
      component: 'network',
      environment: {
        nodeEnv: this.config.service.environment,
        version: this.config.service.version
      },
      metadata
    });
  }

  /**
   * Create circuit breaker for service
   */
  public createCircuitBreaker(
    name: string,
    options?: any
  ): CircuitBreaker {
    return createCircuitBreaker(`${this.config.service.name}-${name}`, options);
  }

  /**
   * Get service metrics
   */
  public getMetrics(): ServiceMetrics {
    this.updateServiceMetrics();
    return { ...this.metrics };
  }

  /**
   * Get error metrics from monitoring
   */
  public getErrorMetrics(): ErrorMetrics {
    return this.errorMonitor.getMetrics();
  }

  /**
   * Perform comprehensive health check
   */
  public async performHealthCheck(): Promise<HealthCheckResult> {
    const healthCheck = await this.errorMonitor.performHealthCheck();
    
    // Add service-specific health information
    const serviceHealth = {
      ...healthCheck,
      services: {
        ...healthCheck.services,
        'error-handling-service': {
          status: this.metrics.healthStatus,
          responseTime: this.metrics.averageProcessingTime,
          errorRate: this.calculateErrorRate(),
          lastError: null
        }
      }
    };

    this.metrics.lastHealthCheck = healthCheck.timestamp;
    this.metrics.healthStatus = serviceHealth.status;

    return serviceHealth;
  }

  /**
   * Get error patterns and analytics
   */
  public async getAnalytics(period?: { start: Date; end: Date }) {
    const defaultPeriod = {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    };

    return await this.errorAnalytics.getAggregation(period || defaultPeriod);
  }

  /**
   * Get circuit breaker overview
   */
  public getCircuitBreakers(): Record<string, any> {
    return circuitBreakerRegistry.getHealthOverview();
  }

  /**
   * Update service configuration
   */
  public updateConfig(updates: Partial<ErrorHandlingServiceConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Update component configurations
    if (updates.components) {
      if (updates.components.errorHandler) {
        this.errorHandler.updateConfig(updates.components.errorHandler);
      }
      if (updates.components.logger) {
        this.errorLogger.updateConfig(updates.components.logger);
      }
      if (updates.components.monitoring) {
        this.errorMonitor.updateConfig(updates.components.monitoring);
      }
      if (updates.components.analytics) {
        this.errorAnalytics.updateConfig(updates.components.analytics);
      }
    }

    this.emit('config-updated', { updates, timestamp: new Date().toISOString() });
  }

  /**
   * Shutdown service gracefully
   */
  public async shutdown(): Promise<void> {
    try {
      // Stop timers
      if (this.metricsTimer) {
        clearInterval(this.metricsTimer);
      }
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }

      // Shutdown components
      const shutdownPromises = [
        this.errorHandler.shutdown(),
        this.errorLogger.shutdown(),
        this.errorMonitor.shutdown(),
        this.errorAnalytics.shutdown(),
        this.errorRecovery.shutdown()
      ];

      await Promise.allSettled(shutdownPromises);

      // Final log
      await this.errorLogger.info('Error handling service shutdown completed', {
        uptime: Date.now() - this.startTime,
        finalMetrics: this.getMetrics()
      });

      this.isInitialized = false;

      this.emit('service-shutdown', {
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        finalMetrics: this.getMetrics()
      });

    } catch (error) {
      this.emit('shutdown-error', { error, timestamp: new Date().toISOString() });
      throw error;
    }
  }

  /**
   * Initialize core components
   */
  private initializeComponents(): void {
    // Initialize error factory
    this.errorFactory = errorFactory;

    // Initialize error handler
    this.errorHandler = createErrorHandler(this.config.components.errorHandler);

    // Initialize logger
    this.errorLogger = createErrorLogger(this.config.components.logger);

    // Initialize recovery
    this.errorRecovery = errorRecovery;

    // Initialize monitoring
    this.errorMonitor = createErrorMonitor(this.config.components.monitoring);

    // Initialize analytics
    this.errorAnalytics = createErrorAnalytics(this.config.components.analytics);
  }

  /**
   * Setup event listeners between components
   */
  private setupEventListeners(): void {
    // Error handler events
    this.errorHandler.on('error-processed', (event) => {
      this.emit('error-handled', event);
    });

    this.errorHandler.on('recovery-succeeded', (event) => {
      this.metrics.totalRecovered++;
      this.emit('error-recovered', event);
    });

    // Monitoring events
    this.errorMonitor.on('error-tracked', (event) => {
      this.metrics.totalMonitored++;
      this.emit('error-monitored', event);
    });

    this.errorMonitor.on('alert-triggered', (event) => {
      this.emit('alert-triggered', event);
    });

    // Analytics events
    this.errorAnalytics.on('patterns-analyzed', (event) => {
      this.emit('patterns-detected', event);
    });

    this.errorAnalytics.on('anomalies-detected', (event) => {
      this.emit('anomalies-detected', event);
    });

    // Recovery events
    this.errorRecovery.on('recovery-succeeded', (event) => {
      this.emit('recovery-completed', event);
    });

    // Circuit breaker events
    this.on('circuit-breaker-opened', (event) => {
      this.emit('circuit-breaker-event', { type: 'opened', ...event });
    });
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      await this.handleError(error, {
        source: 'uncaughtException',
        metadata: { type: 'global-handler', critical: true }
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      await this.handleError(error, {
        source: 'unhandledRejection',
        metadata: { type: 'global-handler', critical: true }
      });
    });

    // Handle warning events
    process.on('warning', async (warning) => {
      await this.handleError(new Error(warning.message), {
        source: 'processWarning',
        metadata: { 
          type: 'warning',
          name: warning.name,
          stack: warning.stack
        }
      });
    });
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsTimer = setInterval(() => {
      this.updateServiceMetrics();
      this.emit('metrics-updated', {
        metrics: this.getMetrics(),
        timestamp: new Date().toISOString()
      });
    }, 60000); // Every minute
  }

  /**
   * Start health checking
   */
  private startHealthChecking(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const health = await this.performHealthCheck();
        this.emit('health-check-completed', {
          health,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        this.emit('health-check-failed', {
          error,
          timestamp: new Date().toISOString()
        });
      }
    }, 300000); // Every 5 minutes
  }

  /**
   * Update service metrics
   */
  private updateServiceMetrics(): void {
    this.metrics.uptime = Date.now() - this.startTime;
    this.metrics.activeCircuitBreakers = Object.keys(circuitBreakerRegistry.getAll()).length;
    this.metrics.activeRecoveries = this.errorRecovery.getActiveRecoveries().length;
  }

  /**
   * Update metrics after error processing
   */
  private updateMetrics(startTime: number, recovered: boolean): void {
    this.metrics.totalErrors++;
    
    if (recovered) {
      this.metrics.totalRecovered++;
    }

    const processingTime = Date.now() - startTime;
    const total = this.metrics.averageProcessingTime * (this.metrics.totalErrors - 1) + processingTime;
    this.metrics.averageProcessingTime = total / this.metrics.totalErrors;
  }

  /**
   * Calculate error rate
   */
  private calculateErrorRate(): number {
    const timeWindow = 60000; // 1 minute
    const errorMetrics = this.errorMonitor.getMetrics();
    return errorMetrics.errorRate;
  }

  /**
   * Check if error is DataSphereError
   */
  private isDataSphereError(error: Error | DataSphereError): error is DataSphereError {
    return 'category' in error && 'severity' in error && 'context' in error;
  }
}

/**
 * Create and configure error handling service
 */
export const createErrorHandlingService = (config: Partial<ErrorHandlingServiceConfig> = {}): ErrorHandlingService => {
  const defaultConfig: ErrorHandlingServiceConfig = {
    enabled: true,
    globalErrorHandling: true,
    service: {
      name: config.service?.name || 'datasphere-service',
      version: config.service?.version || '1.0.0',
      environment: config.service?.environment || process.env.NODE_ENV || 'development'
    },
    components: {
      errorHandler: config.components?.errorHandler || {},
      logger: config.components?.logger || {},
      monitoring: config.components?.monitoring || {},
      analytics: config.components?.analytics || {},
      circuitBreaker: config.components?.circuitBreaker || {}
    },
    integrations: config.integrations || {}
  };

  return ErrorHandlingService.getInstance({ ...defaultConfig, ...config });
};

// Export default instance getter
export const getErrorHandlingService = (): ErrorHandlingService => {
  return ErrorHandlingService.getInstance();
};

// Legacy compatibility exports
export { ErrorHandlingService as ErrorService };
export default ErrorHandlingService;