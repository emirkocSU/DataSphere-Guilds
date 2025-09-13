/**
 * @fileoverview Enterprise Error Handling Types & Interfaces
 * 
 * Comprehensive type definitions for enterprise-grade error handling,
 * monitoring, and recovery systems.
 */

import type { UUID, ISOTimestamp } from '@datasphere/core/types/common.types';

/** Unique identifier for tracking errors across systems */
export type CorrelationId = UUID;

/** Error severity levels for prioritization and alerting */
export enum ErrorSeverity {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG', 
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

/** Error categories for classification and routing */
export enum ErrorCategory {
  // System Errors
  SYSTEM_FAILURE = 'SYSTEM_FAILURE',
  INFRASTRUCTURE_ERROR = 'INFRASTRUCTURE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  
  // Application Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  
  // User Errors
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  INPUT_ERROR = 'INPUT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // External Errors
  THIRD_PARTY_ERROR = 'THIRD_PARTY_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/** Recovery strategy types */
export enum RecoveryStrategy {
  NONE = 'NONE',
  RETRY = 'RETRY',
  FALLBACK = 'FALLBACK',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  GRACEFUL_DEGRADATION = 'GRACEFUL_DEGRADATION',
  ESCALATION = 'ESCALATION'
}

/** Circuit breaker states */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/** Error context information */
export interface ErrorContext {
  /** Unique correlation ID for tracking */
  correlationId: CorrelationId;
  
  /** Request ID if applicable */
  requestId?: string;
  
  /** User ID if applicable */
  userId?: string;
  
  /** Session ID if applicable */
  sessionId?: string;
  
  /** Service name where error occurred */
  service: string;
  
  /** Component or module where error occurred */
  component: string;
  
  /** Function or method where error occurred */
  function?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  
  /** Performance timing information */
  timing?: {
    startTime: number;
    endTime: number;
    duration: number;
  };
  
  /** Request information */
  request?: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: unknown;
  };
  
  /** Environment information */
  environment: {
    nodeEnv: string;
    version: string;
    region?: string;
    instanceId?: string;
  };
}

/** Core error interface */
export interface DataSphereError extends Error {
  /** Error classification */
  category: ErrorCategory;
  
  /** Error severity level */
  severity: ErrorSeverity;
  
  /** Error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Original error if this is a wrapped error */
  cause?: Error;
  
  /** Contextual information */
  context: ErrorContext;
  
  /** Timestamp when error occurred */
  timestamp: ISOTimestamp;
  
  /** Whether error is retryable */
  retryable: boolean;
  
  /** Whether error should be reported to external systems */
  reportable: boolean;
  
  /** Tags for categorization */
  tags: string[];
  
  /** Additional data for debugging */
  details?: Record<string, unknown>;
}

/** Error recovery configuration */
export interface RecoveryConfig {
  /** Strategy to use for recovery */
  strategy: RecoveryStrategy;
  
  /** Maximum retry attempts */
  maxRetries?: number;
  
  /** Retry delay in milliseconds */
  retryDelay?: number;
  
  /** Exponential backoff factor */
  backoffFactor?: number;
  
  /** Maximum retry delay */
  maxRetryDelay?: number;
  
  /** Timeout for recovery attempts */
  timeout?: number;
  
  /** Fallback function */
  fallbackFn?: () => Promise<unknown>;
  
  /** Custom recovery function */
  customRecoveryFn?: (error: DataSphereError) => Promise<unknown>;
}

/** Circuit breaker configuration */
export interface CircuitBreakerConfig {
  /** Failure threshold to open circuit */
  failureThreshold: number;
  
  /** Success threshold to close circuit */
  successThreshold: number;
  
  /** Timeout before attempting reset */
  timeout: number;
  
  /** Monitoring window size */
  monitoringWindow: number;
  
  /** Minimum number of calls before evaluation */
  minimumCallsThreshold: number;
  
  /** Expected exception types to count as failures */
  expectedErrors?: ErrorCategory[];
}

/** Error metrics interface */
export interface ErrorMetrics {
  /** Total error count */
  totalErrors: number;
  
  /** Errors by category */
  errorsByCategory: Record<ErrorCategory, number>;
  
  /** Errors by severity */
  errorsBySeverity: Record<ErrorSeverity, number>;
  
  /** Error rate (errors per minute) */
  errorRate: number;
  
  /** Average error resolution time */
  averageResolutionTime: number;
  
  /** Success rate percentage */
  successRate: number;
  
  /** Most common error types */
  topErrorTypes: Array<{
    code: string;
    count: number;
    percentage: number;
  }>;
  
  /** Trending data */
  trends: {
    hourly: number[];
    daily: number[];
    weekly: number[];
  };
}

/** Error alert configuration */
export interface AlertConfig {
  /** Alert threshold */
  threshold: number;
  
  /** Time window for threshold evaluation */
  timeWindow: number;
  
  /** Alert channels */
  channels: string[];
  
  /** Alert severity */
  severity: ErrorSeverity;
  
  /** Alert message template */
  messageTemplate?: string;
  
  /** Escalation rules */
  escalation?: {
    enabled: boolean;
    delays: number[];
    channels: string[];
  };
}

/** Error handler configuration */
export interface ErrorHandlerConfig {
  /** Default recovery strategy */
  defaultRecovery: RecoveryStrategy;
  
  /** Category-specific recovery configs */
  categoryRecovery: Partial<Record<ErrorCategory, RecoveryConfig>>;
  
  /** Circuit breaker configuration */
  circuitBreaker: CircuitBreakerConfig;
  
  /** Alert configurations */
  alerts: Record<string, AlertConfig>;
  
  /** Logging configuration */
  logging: {
    enabled: boolean;
    level: ErrorSeverity;
    structured: boolean;
    includeStackTrace: boolean;
    sensitiveFields: string[];
  };
  
  /** Monitoring configuration */
  monitoring: {
    enabled: boolean;
    samplingRate: number;
    retentionDays: number;
    aggregationInterval: number;
  };
  
  /** Performance configuration */
  performance: {
    maxConcurrentRecoveries: number;
    maxQueueSize: number;
    processingTimeout: number;
  };
}

/** Error event for monitoring systems */
export interface ErrorEvent {
  /** Event ID */
  id: CorrelationId;
  
  /** Error information */
  error: DataSphereError;
  
  /** Recovery attempt information */
  recovery?: {
    strategy: RecoveryStrategy;
    attempts: number;
    successful: boolean;
    duration: number;
  };
  
  /** Event timestamp */
  timestamp: ISOTimestamp;
  
  /** Additional event metadata */
  metadata?: Record<string, unknown>;
}

/** Type guards for error classification */
export type ErrorClassifier = (error: Error) => {
  category: ErrorCategory;
  severity: ErrorSeverity;
  retryable: boolean;
  reportable: boolean;
};

/** Error transformation function */
export type ErrorTransformer = (error: Error, context: Partial<ErrorContext>) => DataSphereError;

/** Error recovery function signature */
export type ErrorRecoveryFn<T = unknown> = (
  error: DataSphereError,
  config: RecoveryConfig,
  attempt: number
) => Promise<T>;

/** Error monitoring callback */
export type ErrorMonitoringCallback = (event: ErrorEvent) => void | Promise<void>;

/** Error aggregation result */
export interface ErrorAggregation {
  /** Aggregation period */
  period: {
    start: ISOTimestamp;
    end: ISOTimestamp;
  };
  
  /** Aggregated metrics */
  metrics: ErrorMetrics;
  
  /** Notable patterns or anomalies */
  patterns: Array<{
    type: string;
    description: string;
    severity: ErrorSeverity;
    affectedSystems: string[];
  }>;
  
  /** Recommendations for improvement */
  recommendations: Array<{
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    actionItems: string[];
  }>;
}

/** Health check result */
export interface HealthCheckResult {
  /** Overall health status */
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  
  /** Service-specific health */
  services: Record<string, {
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    responseTime: number;
    errorRate: number;
    lastError?: DataSphereError;
  }>;
  
  /** System metrics */
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
  };
  
  /** Check timestamp */
  timestamp: ISOTimestamp;
}