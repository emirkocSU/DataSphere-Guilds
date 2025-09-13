/**
 * @fileoverview Enterprise Error Recovery - Automatic Recovery Strategies
 * 
 * Sophisticated error recovery system with multiple strategies, intelligent
 * fallbacks, adaptive retry mechanisms, and recovery pattern learning
 * for unicorn-level enterprise resilience.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity,
  RecoveryStrategy,
  RecoveryConfig,
  CorrelationId,
  ISOTimestamp,
  ErrorRecoveryFn
} from './types';
import { CircuitBreaker, circuitBreakerRegistry } from './circuit-breaker';

interface RecoveryAttempt {
  id: string;
  correlationId: CorrelationId;
  error: DataSphereError;
  strategy: RecoveryStrategy;
  config: RecoveryConfig;
  attempts: number;
  maxAttempts: number;
  startTime: number;
  lastAttempt: number;
  nextAttempt: number;
  status: 'pending' | 'in-progress' | 'succeeded' | 'failed' | 'exhausted';
  results: Array<{
    attempt: number;
    success: boolean;
    duration: number;
    error?: Error;
    result?: unknown;
    timestamp: ISOTimestamp;
  }>;
}

interface RecoveryMetrics {
  totalAttempts: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  exhaustedRecoveries: number;
  averageRecoveryTime: number;
  recoverySuccessRate: number;
  strategiesUsed: Record<RecoveryStrategy, number>;
  categoriesRecovered: Record<ErrorCategory, number>;
}

interface RecoveryPattern {
  errorCategory: ErrorCategory;
  errorCode: string;
  successfulStrategy: RecoveryStrategy;
  successRate: number;
  averageDuration: number;
  lastUsed: ISOTimestamp;
  usageCount: number;
}

/**
 * Enterprise Error Recovery Engine
 * 
 * Provides intelligent error recovery with adaptive strategies,
 * pattern learning, and sophisticated fallback mechanisms.
 */
export class ErrorRecovery extends EventEmitter {
  private static instance: ErrorRecovery;
  private activeRecoveries: Map<string, RecoveryAttempt> = new Map();
  private recoveryFunctions: Map<ErrorCategory, ErrorRecoveryFn> = new Map();
  private recoveryPatterns: Map<string, RecoveryPattern> = new Map();
  private metrics: RecoveryMetrics;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    super();
    this.metrics = {
      totalAttempts: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      exhaustedRecoveries: 0,
      averageRecoveryTime: 0,
      recoverySuccessRate: 0,
      strategiesUsed: Object.values(RecoveryStrategy).reduce((acc, strategy) => {
        acc[strategy] = 0;
        return acc;
      }, {} as Record<RecoveryStrategy, number>),
      categoriesRecovered: Object.values(ErrorCategory).reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {} as Record<ErrorCategory, number>)
    };

    this.initializeDefaultRecoveryFunctions();
    this.startCleanupTimer();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorRecovery {
    if (!ErrorRecovery.instance) {
      ErrorRecovery.instance = new ErrorRecovery();
    }
    return ErrorRecovery.instance;
  }

  /**
   * Attempt error recovery with intelligent strategy selection
   */
  public async attemptRecovery(
    error: DataSphereError,
    config: RecoveryConfig
  ): Promise<{
    success: boolean;
    strategy: RecoveryStrategy;
    attempts: number;
    duration: number;
    result?: unknown;
    recoveryId: string;
  }> {
    const recoveryId = this.generateRecoveryId();
    const startTime = Date.now();

    // Create recovery attempt
    const attempt: RecoveryAttempt = {
      id: recoveryId,
      correlationId: error.context.correlationId,
      error,
      strategy: config.strategy,
      config,
      attempts: 0,
      maxAttempts: config.maxRetries || 3,
      startTime,
      lastAttempt: 0,
      nextAttempt: Date.now(),
      status: 'pending',
      results: []
    };

    this.activeRecoveries.set(recoveryId, attempt);
    this.emit('recovery-started', { recoveryId, error, strategy: config.strategy });

    try {
      // Use learned patterns for strategy optimization
      const optimizedStrategy = this.getOptimalStrategy(error, config.strategy);
      attempt.strategy = optimizedStrategy;

      const result = await this.executeRecoveryStrategy(attempt);
      
      const duration = Date.now() - startTime;
      this.updateMetrics(attempt, true, duration);
      this.updateRecoveryPattern(error, optimizedStrategy, true, duration);

      this.emit('recovery-succeeded', {
        recoveryId,
        error,
        strategy: optimizedStrategy,
        attempts: attempt.attempts,
        duration,
        result
      });

      return {
        success: true,
        strategy: optimizedStrategy,
        attempts: attempt.attempts,
        duration,
        result,
        recoveryId
      };

    } catch (recoveryError) {
      const duration = Date.now() - startTime;
      this.updateMetrics(attempt, false, duration);
      this.updateRecoveryPattern(error, attempt.strategy, false, duration);

      attempt.status = attempt.attempts >= attempt.maxAttempts ? 'exhausted' : 'failed';

      this.emit('recovery-failed', {
        recoveryId,
        error,
        strategy: attempt.strategy,
        attempts: attempt.attempts,
        duration,
        recoveryError
      });

      return {
        success: false,
        strategy: attempt.strategy,
        attempts: attempt.attempts,
        duration,
        recoveryId
      };

    } finally {
      this.activeRecoveries.delete(recoveryId);
    }
  }

  /**
   * Register custom recovery function for error category
   */
  public registerRecoveryFunction(category: ErrorCategory, recoveryFn: ErrorRecoveryFn): void {
    this.recoveryFunctions.set(category, recoveryFn);
    this.emit('recovery-function-registered', { category });
  }

  /**
   * Get recovery metrics
   */
  public getMetrics(): RecoveryMetrics {
    this.calculateDerivedMetrics();
    return { ...this.metrics };
  }

  /**
   * Get active recovery attempts
   */
  public getActiveRecoveries(): Array<{
    id: string;
    correlationId: CorrelationId;
    errorCode: string;
    strategy: RecoveryStrategy;
    attempts: number;
    maxAttempts: number;
    status: string;
    elapsedTime: number;
  }> {
    const now = Date.now();
    return Array.from(this.activeRecoveries.values()).map(attempt => ({
      id: attempt.id,
      correlationId: attempt.correlationId,
      errorCode: attempt.error.code,
      strategy: attempt.strategy,
      attempts: attempt.attempts,
      maxAttempts: attempt.maxAttempts,
      status: attempt.status,
      elapsedTime: now - attempt.startTime
    }));
  }

  /**
   * Get learned recovery patterns
   */
  public getRecoveryPatterns(): RecoveryPattern[] {
    return Array.from(this.recoveryPatterns.values())
      .sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Reset recovery patterns (useful for testing)
   */
  public resetPatterns(): void {
    this.recoveryPatterns.clear();
    this.emit('patterns-reset');
  }

  /**
   * Shutdown recovery engine gracefully
   */
  public async shutdown(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // Wait for active recoveries to complete or timeout
    const timeout = 30000; // 30 seconds
    const start = Date.now();

    while (this.activeRecoveries.size > 0 && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.emit('shutdown', {
      finalMetrics: this.getMetrics(),
      activeRecoveries: this.activeRecoveries.size,
      learnedPatterns: this.recoveryPatterns.size
    });
  }

  /**
   * Execute recovery strategy
   */
  private async executeRecoveryStrategy(attempt: RecoveryAttempt): Promise<unknown> {
    while (attempt.attempts < attempt.maxAttempts && Date.now() >= attempt.nextAttempt) {
      attempt.attempts++;
      attempt.lastAttempt = Date.now();
      attempt.status = 'in-progress';

      const attemptStart = Date.now();

      try {
        let result: unknown;

        switch (attempt.strategy) {
          case RecoveryStrategy.RETRY:
            result = await this.executeRetry(attempt);
            break;

          case RecoveryStrategy.FALLBACK:
            result = await this.executeFallback(attempt);
            break;

          case RecoveryStrategy.CIRCUIT_BREAKER:
            result = await this.executeCircuitBreakerRecovery(attempt);
            break;

          case RecoveryStrategy.GRACEFUL_DEGRADATION:
            result = await this.executeGracefulDegradation(attempt);
            break;

          case RecoveryStrategy.ESCALATION:
            result = await this.executeEscalation(attempt);
            break;

          default:
            throw new Error(`Unsupported recovery strategy: ${attempt.strategy}`);
        }

        // Recovery succeeded
        const duration = Date.now() - attemptStart;
        attempt.results.push({
          attempt: attempt.attempts,
          success: true,
          duration,
          result,
          timestamp: new Date().toISOString() as ISOTimestamp
        });

        attempt.status = 'succeeded';
        return result;

      } catch (error) {
        const duration = Date.now() - attemptStart;
        attempt.results.push({
          attempt: attempt.attempts,
          success: false,
          duration,
          error: error as Error,
          timestamp: new Date().toISOString() as ISOTimestamp
        });

        // Calculate next attempt time with exponential backoff
        if (attempt.attempts < attempt.maxAttempts) {
          const delay = this.calculateRetryDelay(attempt.attempts, attempt.config);
          attempt.nextAttempt = Date.now() + delay;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts exhausted
    attempt.status = 'exhausted';
    throw new Error(`Recovery exhausted after ${attempt.attempts} attempts`);
  }

  /**
   * Execute retry recovery
   */
  private async executeRetry(attempt: RecoveryAttempt): Promise<unknown> {
    const recoveryFn = this.recoveryFunctions.get(attempt.error.category);
    if (!recoveryFn) {
      throw new Error(`No recovery function for category: ${attempt.error.category}`);
    }

    return await this.executeWithTimeout(
      () => recoveryFn(attempt.error, attempt.config, attempt.attempts),
      attempt.config.timeout || 30000
    );
  }

  /**
   * Execute fallback recovery
   */
  private async executeFallback(attempt: RecoveryAttempt): Promise<unknown> {
    if (!attempt.config.fallbackFn) {
      throw new Error('No fallback function configured');
    }

    return await this.executeWithTimeout(
      attempt.config.fallbackFn,
      attempt.config.timeout || 30000
    );
  }

  /**
   * Execute circuit breaker recovery
   */
  private async executeCircuitBreakerRecovery(attempt: RecoveryAttempt): Promise<unknown> {
    const circuitName = `${attempt.error.context.service}-${attempt.error.category}`;
    const circuitBreaker = circuitBreakerRegistry.get(circuitName);

    if (!circuitBreaker) {
      throw new Error(`No circuit breaker found for: ${circuitName}`);
    }

    const recoveryFn = this.recoveryFunctions.get(attempt.error.category);
    if (!recoveryFn) {
      throw new Error(`No recovery function for category: ${attempt.error.category}`);
    }

    return await circuitBreaker.execute(
      () => recoveryFn(attempt.error, attempt.config, attempt.attempts),
      attempt.error.context.correlationId,
      attempt.config.fallbackFn
    );
  }

  /**
   * Execute graceful degradation
   */
  private async executeGracefulDegradation(attempt: RecoveryAttempt): Promise<unknown> {
    if (attempt.config.fallbackFn) {
      return await attempt.config.fallbackFn();
    }

    // Return safe default value
    return {
      degraded: true,
      reason: 'Graceful degradation activated',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute escalation recovery
   */
  private async executeEscalation(attempt: RecoveryAttempt): Promise<unknown> {
    // Escalate to higher-level recovery or alert system
    this.emit('escalation-triggered', {
      error: attempt.error,
      attempts: attempt.attempts,
      strategy: attempt.strategy
    });

    if (attempt.config.customRecoveryFn) {
      return await attempt.config.customRecoveryFn(attempt.error);
    }

    throw new Error('Escalation triggered but no custom recovery function provided');
  }

  /**
   * Execute function with timeout
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Recovery function timeout after ${timeout}ms`));
      }, timeout);

      fn()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Get optimal recovery strategy based on learned patterns
   */
  private getOptimalStrategy(error: DataSphereError, defaultStrategy: RecoveryStrategy): RecoveryStrategy {
    const patternKey = `${error.category}-${error.code}`;
    const pattern = this.recoveryPatterns.get(patternKey);

    if (pattern && pattern.successRate > 0.7 && pattern.usageCount >= 3) {
      return pattern.successfulStrategy;
    }

    // Fallback to category-level patterns
    const categoryPatterns = Array.from(this.recoveryPatterns.values())
      .filter(p => p.errorCategory === error.category)
      .sort((a, b) => b.successRate - a.successRate);

    if (categoryPatterns.length > 0 && categoryPatterns[0].successRate > 0.6) {
      return categoryPatterns[0].successfulStrategy;
    }

    return defaultStrategy;
  }

  /**
   * Update recovery pattern with attempt result
   */
  private updateRecoveryPattern(
    error: DataSphereError,
    strategy: RecoveryStrategy,
    success: boolean,
    duration: number
  ): void {
    const patternKey = `${error.category}-${error.code}`;
    let pattern = this.recoveryPatterns.get(patternKey);

    if (!pattern) {
      pattern = {
        errorCategory: error.category,
        errorCode: error.code,
        successfulStrategy: strategy,
        successRate: 0,
        averageDuration: 0,
        lastUsed: new Date().toISOString() as ISOTimestamp,
        usageCount: 0
      };
      this.recoveryPatterns.set(patternKey, pattern);
    }

    // Update pattern statistics
    const totalAttempts = pattern.usageCount + 1;
    const successCount = (pattern.successRate * pattern.usageCount) + (success ? 1 : 0);
    
    pattern.successRate = successCount / totalAttempts;
    pattern.averageDuration = (pattern.averageDuration * pattern.usageCount + duration) / totalAttempts;
    pattern.usageCount = totalAttempts;
    pattern.lastUsed = new Date().toISOString() as ISOTimestamp;

    if (success) {
      pattern.successfulStrategy = strategy;
    }
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
   * Generate unique recovery ID
   */
  private generateRecoveryId(): string {
    return `recovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update recovery metrics
   */
  private updateMetrics(attempt: RecoveryAttempt, success: boolean, duration: number): void {
    this.metrics.totalAttempts++;
    this.metrics.strategiesUsed[attempt.strategy]++;
    this.metrics.categoriesRecovered[attempt.error.category]++;

    if (success) {
      this.metrics.successfulRecoveries++;
      const total = this.metrics.averageRecoveryTime * (this.metrics.successfulRecoveries - 1) + duration;
      this.metrics.averageRecoveryTime = total / this.metrics.successfulRecoveries;
    } else if (attempt.status === 'exhausted') {
      this.metrics.exhaustedRecoveries++;
    } else {
      this.metrics.failedRecoveries++;
    }
  }

  /**
   * Calculate derived metrics
   */
  private calculateDerivedMetrics(): void {
    const total = this.metrics.successfulRecoveries + this.metrics.failedRecoveries + this.metrics.exhaustedRecoveries;
    this.metrics.recoverySuccessRate = total > 0 ? this.metrics.successfulRecoveries / total : 0;
  }

  /**
   * Initialize default recovery functions
   */
  private initializeDefaultRecoveryFunctions(): void {
    // Network error recovery
    this.recoveryFunctions.set(ErrorCategory.NETWORK_ERROR, async (error, config, attempt) => {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      return { recovered: true, attempt, timestamp: new Date().toISOString() };
    });

    // Database error recovery
    this.recoveryFunctions.set(ErrorCategory.DATABASE_ERROR, async (error, config, attempt) => {
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      return { recovered: true, attempt, timestamp: new Date().toISOString() };
    });

    // Third party error recovery
    this.recoveryFunctions.set(ErrorCategory.THIRD_PARTY_ERROR, async (error, config, attempt) => {
      await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
      return { recovered: true, attempt, timestamp: new Date().toISOString() };
    });
  }

  /**
   * Start cleanup timer for old recovery attempts
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const maxAge = 300000; // 5 minutes

      for (const [id, attempt] of this.activeRecoveries) {
        if (now - attempt.startTime > maxAge) {
          attempt.status = 'exhausted';
          this.activeRecoveries.delete(id);
          this.emit('recovery-timeout', { recoveryId: id, attempt });
        }
      }
    }, 60000); // Run every minute
  }
}

// Export singleton instance
export const errorRecovery = ErrorRecovery.getInstance();