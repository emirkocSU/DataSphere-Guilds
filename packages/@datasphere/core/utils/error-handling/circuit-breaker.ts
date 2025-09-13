/**
 * @fileoverview Enterprise Circuit Breaker Implementation
 * 
 * Advanced circuit breaker pattern for fault tolerance and graceful degradation.
 * Provides automatic failure detection, recovery monitoring, and system protection
 * at unicorn-level enterprise scale.
 */

import { EventEmitter } from 'events';
import { 
  CircuitBreakerState, 
  CircuitBreakerConfig, 
  DataSphereError,
  ErrorCategory,
  ErrorSeverity,
  CorrelationId,
  ISOTimestamp
} from './types';
import { errorFactory } from './error-factory';

interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  timeouts: number;
  rejectedRequests: number;
  averageResponseTime: number;
  lastStateChange: ISOTimestamp;
}

interface CircuitBreakerEvent {
  type: 'state-change' | 'request-success' | 'request-failure' | 'request-timeout' | 'request-rejected';
  circuitName: string;
  previousState?: CircuitBreakerState;
  newState?: CircuitBreakerState;
  timestamp: ISOTimestamp;
  metadata?: Record<string, unknown>;
}

/**
 * Enterprise Circuit Breaker Implementation
 * 
 * Provides fault tolerance through automatic failure detection and recovery.
 * Features include configurable thresholds, sliding window monitoring,
 * and real-time metrics collection.
 */
export class CircuitBreaker extends EventEmitter {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private readonly config: Required<CircuitBreakerConfig>;
  private readonly metrics: CircuitBreakerMetrics;
  private readonly requestHistory: Array<{ timestamp: number; success: boolean; duration: number }> = [];
  private nextAttempt: number = 0;
  private readonly name: string;

  constructor(name: string, config: CircuitBreakerConfig) {
    super();
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold,
      successThreshold: config.successThreshold,
      timeout: config.timeout,
      monitoringWindow: config.monitoringWindow,
      minimumCallsThreshold: config.minimumCallsThreshold,
      expectedErrors: config.expectedErrors || []
    };

    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      rejectedRequests: 0,
      averageResponseTime: 0,
      lastStateChange: new Date().toISOString() as ISOTimestamp
    };

    this.setupMetricsCleanup();
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    correlationId?: CorrelationId,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Check if circuit should reject request
      if (this.shouldRejectRequest()) {
        this.metrics.rejectedRequests++;
        this.emitEvent('request-rejected', { correlationId });
        
        if (fallback) {
          return await fallback();
        }

        throw errorFactory.createError({
          code: 'CIRCUIT_BREAKER_OPEN',
          message: `Circuit breaker '${this.name}' is OPEN. Request rejected.`,
          category: ErrorCategory.SYSTEM_FAILURE,
          severity: ErrorSeverity.WARN,
          retryable: true,
          context: {
            correlationId: correlationId!,
            service: 'circuit-breaker',
            component: this.name,
            environment: {
              nodeEnv: process.env.NODE_ENV || 'development',
              version: process.env.APP_VERSION || '1.0.0'
            }
          },
          details: {
            state: this.state,
            metrics: this.getMetrics(),
            nextAttemptIn: Math.max(0, this.nextAttempt - Date.now())
          },
          tags: ['circuit-breaker', 'rejection']
        });
      }

      // Execute the function
      const result = await this.executeWithTimeout(fn);
      
      // Record success
      const duration = Date.now() - startTime;
      this.recordSuccess(duration);
      this.emitEvent('request-success', { correlationId, duration });

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Determine if this is a timeout or regular failure
      if (error instanceof Error && error.message.includes('timeout')) {
        this.recordTimeout(duration);
        this.emitEvent('request-timeout', { correlationId, duration });
      } else {
        this.recordFailure(duration, error as Error);
        this.emitEvent('request-failure', { correlationId, duration, error });
      }

      // Try fallback if available
      if (fallback && this.state === CircuitBreakerState.OPEN) {
        try {
          return await fallback();
        } catch (fallbackError) {
          // Fallback failed, throw original error
          throw error;
        }
      }

      throw error;
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Get circuit breaker metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    return { ...this.metrics };
  }

  /**
   * Get circuit breaker name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get circuit breaker configuration
   */
  getConfig(): CircuitBreakerConfig {
    return { ...this.config };
  }

  /**
   * Force circuit breaker to a specific state (for testing)
   */
  forceState(state: CircuitBreakerState): void {
    const previousState = this.state;
    this.state = state;
    this.metrics.lastStateChange = new Date().toISOString() as ISOTimestamp;
    
    if (state === CircuitBreakerState.HALF_OPEN) {
      this.nextAttempt = 0;
    }

    this.emitEvent('state-change', { previousState, newState: state });
  }

  /**
   * Reset circuit breaker to initial state
   */
  reset(): void {
    this.state = CircuitBreakerState.CLOSED;
    this.nextAttempt = 0;
    this.requestHistory.length = 0;
    
    // Reset metrics
    Object.assign(this.metrics, {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      rejectedRequests: 0,
      averageResponseTime: 0,
      lastStateChange: new Date().toISOString() as ISOTimestamp
    });

    this.emitEvent('state-change', { newState: CircuitBreakerState.CLOSED });
  }

  /**
   * Check if circuit breaker should reject the request
   */
  private shouldRejectRequest(): boolean {
    const now = Date.now();

    switch (this.state) {
      case CircuitBreakerState.CLOSED:
        return false;

      case CircuitBreakerState.OPEN:
        if (now >= this.nextAttempt) {
          this.transitionToHalfOpen();
          return false;
        }
        return true;

      case CircuitBreakerState.HALF_OPEN:
        return false;

      default:
        return false;
    }
  }

  /**
   * Execute function with timeout protection
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Circuit breaker timeout after ${this.config.timeout}ms`));
      }, this.config.timeout);

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
   * Record successful request
   */
  private recordSuccess(duration: number): void {
    this.metrics.totalRequests++;
    this.metrics.successfulRequests++;
    this.updateAverageResponseTime(duration);
    this.addToHistory(true, duration);

    // Check if we should close the circuit from half-open
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      const recentSuccesses = this.getRecentSuccessCount();
      if (recentSuccesses >= this.config.successThreshold) {
        this.transitionToClosed();
      }
    }
  }

  /**
   * Record failed request
   */
  private recordFailure(duration: number, error: Error): void {
    this.metrics.totalRequests++;
    this.metrics.failedRequests++;
    this.updateAverageResponseTime(duration);
    this.addToHistory(false, duration);

    // Check if we should open the circuit
    if (this.shouldOpenCircuit()) {
      this.transitionToOpen();
    }
  }

  /**
   * Record timeout
   */
  private recordTimeout(duration: number): void {
    this.metrics.totalRequests++;
    this.metrics.timeouts++;
    this.updateAverageResponseTime(duration);
    this.addToHistory(false, duration);

    // Timeouts count as failures for circuit opening
    if (this.shouldOpenCircuit()) {
      this.transitionToOpen();
    }
  }

  /**
   * Add request to history
   */
  private addToHistory(success: boolean, duration: number): void {
    const now = Date.now();
    this.requestHistory.push({ timestamp: now, success, duration });

    // Clean old entries outside monitoring window
    const cutoff = now - this.config.monitoringWindow;
    let index = 0;
    while (index < this.requestHistory.length && this.requestHistory[index].timestamp < cutoff) {
      index++;
    }
    if (index > 0) {
      this.requestHistory.splice(0, index);
    }
  }

  /**
   * Check if circuit should open
   */
  private shouldOpenCircuit(): boolean {
    if (this.requestHistory.length < this.config.minimumCallsThreshold) {
      return false;
    }

    const failures = this.requestHistory.filter(req => !req.success).length;
    const failureRate = failures / this.requestHistory.length;

    return failureRate >= this.config.failureThreshold;
  }

  /**
   * Get recent success count for half-open state
   */
  private getRecentSuccessCount(): number {
    const recentRequests = this.requestHistory.slice(-this.config.successThreshold);
    return recentRequests.filter(req => req.success).length;
  }

  /**
   * Transition to CLOSED state
   */
  private transitionToClosed(): void {
    const previousState = this.state;
    this.state = CircuitBreakerState.CLOSED;
    this.metrics.lastStateChange = new Date().toISOString() as ISOTimestamp;
    this.emitEvent('state-change', { previousState, newState: CircuitBreakerState.CLOSED });
  }

  /**
   * Transition to OPEN state
   */
  private transitionToOpen(): void {
    const previousState = this.state;
    this.state = CircuitBreakerState.OPEN;
    this.nextAttempt = Date.now() + this.config.timeout;
    this.metrics.lastStateChange = new Date().toISOString() as ISOTimestamp;
    this.emitEvent('state-change', { previousState, newState: CircuitBreakerState.OPEN });
  }

  /**
   * Transition to HALF_OPEN state
   */
  private transitionToHalfOpen(): void {
    const previousState = this.state;
    this.state = CircuitBreakerState.HALF_OPEN;
    this.metrics.lastStateChange = new Date().toISOString() as ISOTimestamp;
    this.emitEvent('state-change', { previousState, newState: CircuitBreakerState.HALF_OPEN });
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(duration: number): void {
    const total = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + duration;
    this.metrics.averageResponseTime = total / this.metrics.totalRequests;
  }

  /**
   * Emit circuit breaker event
   */
  private emitEvent(type: CircuitBreakerEvent['type'], metadata: Record<string, unknown> = {}): void {
    const event: CircuitBreakerEvent = {
      type,
      circuitName: this.name,
      timestamp: new Date().toISOString() as ISOTimestamp,
      metadata
    };

    if (type === 'state-change' && metadata.previousState && metadata.newState) {
      event.previousState = metadata.previousState as CircuitBreakerState;
      event.newState = metadata.newState as CircuitBreakerState;
    }

    this.emit('circuit-breaker-event', event);
    this.emit(type, event);
  }

  /**
   * Setup periodic cleanup of old metrics
   */
  private setupMetricsCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const cutoff = now - this.config.monitoringWindow;
      
      let index = 0;
      while (index < this.requestHistory.length && this.requestHistory[index].timestamp < cutoff) {
        index++;
      }
      
      if (index > 0) {
        this.requestHistory.splice(0, index);
      }
    }, this.config.monitoringWindow / 10); // Clean up every 10% of monitoring window
  }
}

/**
 * Circuit Breaker Registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private static instance: CircuitBreakerRegistry;
  private breakers: Map<string, CircuitBreaker> = new Map();

  private constructor() {}

  static getInstance(): CircuitBreakerRegistry {
    if (!CircuitBreakerRegistry.instance) {
      CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
    }
    return CircuitBreakerRegistry.instance;
  }

  /**
   * Create or get a circuit breaker
   */
  getOrCreate(name: string, config: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(name)) {
      const breaker = new CircuitBreaker(name, config);
      this.breakers.set(name, breaker);
    }
    return this.breakers.get(name)!;
  }

  /**
   * Get a circuit breaker by name
   */
  get(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  /**
   * Remove a circuit breaker
   */
  remove(name: string): boolean {
    return this.breakers.delete(name);
  }

  /**
   * Get registry health overview
   */
  getHealthOverview(): Record<string, {
    state: CircuitBreakerState;
    metrics: CircuitBreakerMetrics;
    health: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    const overview: Record<string, any> = {};

    for (const [name, breaker] of this.breakers) {
      const metrics = breaker.getMetrics();
      const state = breaker.getState();
      
      let health: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if (state === CircuitBreakerState.OPEN) {
        health = 'unhealthy';
      } else if (state === CircuitBreakerState.HALF_OPEN || metrics.failedRequests > metrics.successfulRequests) {
        health = 'degraded';
      }

      overview[name] = { state, metrics, health };
    }

    return overview;
  }
}

// Export singleton instance
export const circuitBreakerRegistry = CircuitBreakerRegistry.getInstance();

// Utility function for creating circuit breakers with common configs
export const createCircuitBreaker = (
  name: string, 
  options: Partial<CircuitBreakerConfig> = {}
): CircuitBreaker => {
  const defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 0.5, // 50% failure rate
    successThreshold: 3, // 3 consecutive successes to close
    timeout: 60000, // 60 seconds
    monitoringWindow: 120000, // 2 minutes
    minimumCallsThreshold: 10, // Minimum 10 calls before evaluation
    expectedErrors: [ErrorCategory.NETWORK_ERROR, ErrorCategory.THIRD_PARTY_ERROR]
  };

  const config = { ...defaultConfig, ...options };
  return circuitBreakerRegistry.getOrCreate(name, config);
};