/**
 * @fileoverview Pico-optimized delivery types with guaranteed delivery semantics.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact delivery record - 32 bytes
export interface DeliveryRecord {
  readonly id: UUID; // 16 bytes
  readonly eventId: UUID; // 16 bytes
  readonly endpointId: UUID; // 16 bytes
  readonly status: number; // 1 byte - delivery status
  readonly httpCode: number; // 2 bytes - HTTP response code
  readonly attempts: number; // 1 byte - delivery attempts
  readonly duration: number; // 2 bytes - total delivery time
  readonly delivered: number; // 4 bytes - delivery timestamp
}

// Nano retry configuration - 12 bytes
export interface RetryConfig {
  readonly configId: BigInt; // 8 bytes
  readonly maxAttempts: number; // 1 byte - max retry attempts
  readonly baseDelay: number; // 2 bytes - initial delay ms
  readonly maxDelay: number; // 2 bytes - maximum delay ms
  readonly backoffFactor: number; // 2 bytes - backoff multiplier
  readonly strategy: number; // 1 byte - retry strategy
}

// Micro delivery attempt - 24 bytes
export interface DeliveryAttempt {
  readonly attemptId: BigInt; // 8 bytes
  readonly deliveryId: UUID; // 16 bytes
  readonly httpCode: number; // 2 bytes - response code
  readonly latency: number; // 2 bytes - response time ms
  readonly attempted: number; // 4 bytes - attempt timestamp
  readonly error: number; // 1 byte - error code
}

// Delivery batch processing - 20 bytes
export interface DeliveryBatch {
  readonly batchId: BigInt; // 8 bytes
  readonly deliveries: readonly UUID[]; // delivery IDs
  readonly size: number; // 2 bytes - batch size
  readonly status: number; // 1 byte - batch status
  readonly created: number; // 4 bytes - batch creation
  readonly completed: number; // 4 bytes - batch completion
}

// Endpoint health status - 16 bytes
export interface EndpointHealth {
  readonly endpointId: UUID; // 16 bytes
  readonly successRate: number; // 2 bytes - success percentage
  readonly avgLatency: number; // 2 bytes - average response time
  readonly lastSuccess: number; // 4 bytes - last successful delivery
  readonly consecutiveFailures: number; // 1 byte - failure streak
  readonly status: number; // 1 byte - health status
}

// Delivery queue entry - 20 bytes
export interface DeliveryQueueEntry {
  readonly queueId: BigInt; // 8 bytes
  readonly deliveryId: UUID; // 16 bytes
  readonly priority: number; // 1 byte - delivery priority
  readonly scheduled: number; // 4 bytes - scheduled delivery time
  readonly expires: number; // 4 bytes - expiration time
}

// Const enums for zero overhead
export const enum DeliveryStatus {
  QUEUED = 0,
  PROCESSING = 1,
  SUCCESS = 2,
  FAILED = 3,
  TIMEOUT = 4,
  RATE_LIMITED = 5,
  CANCELLED = 6,
  EXPIRED = 7,
  RETRYING = 8
}

export const enum RetryStrategy {
  FIXED = 0,
  LINEAR = 1,
  EXPONENTIAL = 2,
  FIBONACCI = 3,
  CUSTOM = 4
}

export const enum HealthStatus {
  HEALTHY = 0,
  DEGRADED = 1,
  UNHEALTHY = 2,
  FAILED = 3,
  SUSPENDED = 4
}

export const enum BatchStatus {
  CREATED = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  PARTIAL = 4
}

export const enum DeliveryPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
  IMMEDIATE = 4
}

export const enum ErrorCode {
  NONE = 0,
  NETWORK_ERROR = 1,
  TIMEOUT = 2,
  DNS_ERROR = 3,
  SSL_ERROR = 4,
  HTTP_ERROR = 5,
  PARSING_ERROR = 6,
  RATE_LIMITED = 7,
  ENDPOINT_DOWN = 8,
  INVALID_RESPONSE = 9
}

// Type aliases for micro-optimization
export type DeliveryId = UUID;
export type EndpointId = UUID;
export type EventId = UUID;
export type AttemptId = BigInt;
export type BatchId = BigInt;
export type ConfigId = BigInt;
export type QueueId = BigInt;
export type Timestamp = number;
export type Latency = number;
export type HttpCode = number;

// Memory-mapped delivery storage
export interface DeliveryStorage {
  readonly buffer: SharedArrayBuffer;
  readonly recordOffset: number;
  readonly attemptOffset: number;
  readonly batchOffset: number;
  readonly configOffset: number;
  readonly healthOffset: number;
  readonly queueOffset: number;
}

// High-speed delivery engine
export interface DeliveryEngine {
  readonly deliver: (eventId: EventId, endpointId: EndpointId) => Promise<DeliveryId>;
  readonly deliverBatch: (deliveries: readonly DeliveryId[]) => Promise<BatchId>;
  readonly retry: (deliveryId: DeliveryId) => Promise<AttemptId>;
  readonly cancel: (deliveryId: DeliveryId) => Promise<boolean>;
  readonly getStatus: (deliveryId: DeliveryId) => DeliveryStatus;
  readonly getHealth: (endpointId: EndpointId) => EndpointHealth;
}

// Delivery monitoring system
export interface DeliveryMonitor {
  readonly trackAttempt: (attempt: DeliveryAttempt) => Promise<boolean>;
  readonly updateHealth: (endpointId: EndpointId) => Promise<EndpointHealth>;
  readonly checkQueue: () => Promise<readonly DeliveryQueueEntry[]>;
  readonly getMetrics: () => DeliveryMetrics;
  readonly alert: (endpointId: EndpointId, issue: ErrorCode) => Promise<boolean>;
}

// Delivery circuit breaker - 12 bytes
export interface DeliveryCircuitBreaker {
  readonly endpointId: EndpointId; // 16 bytes
  readonly state: number; // 1 byte - breaker state
  readonly failures: number; // 2 bytes - failure count
  readonly lastFailure: Timestamp; // 4 bytes
  readonly timeout: number; // 4 bytes - breaker timeout
}

// Rate limiting configuration - 8 bytes
export interface DeliveryRateLimit {
  readonly endpointId: EndpointId; // 16 bytes
  readonly requestsPerSecond: number; // 2 bytes
  readonly burstSize: number; // 2 bytes
  readonly windowSize: number; // 2 bytes - time window
  readonly enabled: boolean; // 1 byte
}

// Delivery metrics aggregate
export interface DeliveryMetrics {
  readonly totalDeliveries: BigInt;
  readonly successRate: number;
  readonly failureRate: number;
  readonly avgLatency: number;
  readonly queueDepth: number;
  readonly activeEndpoints: number;
  readonly errorDistribution: Map<ErrorCode, number>;
}

// Delivery notification - 20 bytes
export interface DeliveryNotification {
  readonly notificationId: BigInt; // 8 bytes
  readonly deliveryId: DeliveryId; // 16 bytes
  readonly event: number; // 1 byte - notification event
  readonly timestamp: Timestamp; // 4 bytes
}

// Webhook response cache - 24 bytes
export interface ResponseCache {
  readonly cacheId: BigInt; // 8 bytes
  readonly endpointId: EndpointId; // 16 bytes
  readonly responseHash: BigInt; // 8 bytes - response hash
  readonly cached: Timestamp; // 4 bytes - cache time
  readonly expires: Timestamp; // 4 bytes - expiration time
}

// Zero-allocation delivery manager
export interface DeliveryManager {
  readonly schedule: (eventId: EventId, endpointId: EndpointId, priority?: DeliveryPriority) => Promise<DeliveryId>;
  readonly process: (queueEntry: DeliveryQueueEntry) => Promise<DeliveryRecord>;
  readonly handleFailure: (deliveryId: DeliveryId, error: ErrorCode) => Promise<boolean>;
  readonly updateCircuitBreaker: (endpointId: EndpointId, success: boolean) => Promise<boolean>;
  readonly getQueueStatus: () => readonly DeliveryQueueEntry[];
  readonly metrics: () => DeliveryMetrics;
}
