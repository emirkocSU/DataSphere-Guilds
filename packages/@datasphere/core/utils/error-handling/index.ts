/**
 * @fileoverview Enterprise-Grade Error Handling & Resilience Framework
 * 
 * A comprehensive error handling system designed for unicorn-level startups
 * with global scale requirements, providing:
 * 
 * - Multi-layered error categorization and recovery
 * - Circuit breaker patterns for fault tolerance
 * - Real-time error monitoring and analytics
 * - Structured logging with correlation IDs
 * - Graceful degradation strategies
 * - Performance-optimized error processing
 * 
 * @version 2.0.0
 * @author DataSphere Guilds Core Team
 * @license MIT
 */

// Core Error Management
export * from './error-factory';
export * from './error-handler';
export * from './error-logger';
export * from './error-recovery';

// Monitoring & Analytics
export * from './error-monitoring';
export * from './error-analytics';

// Resilience Patterns
export * from './circuit-breaker';

// Types & Interfaces
export type {
  ErrorCategory,
  ErrorSeverity,
  ErrorContext,
  RecoveryStrategy,
  CircuitBreakerState,
  ErrorMetrics,
  CorrelationId
} from './types';

// Main Error Handling Interface
export { 
  ErrorHandlingService, 
  createErrorHandlingService, 
  getErrorHandlingService,
  ErrorService 
} from './service';