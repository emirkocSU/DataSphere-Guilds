/**
 * @fileoverview Femto-optimized webhook types with real-time event delivery.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact webhook endpoint - 32 bytes
export interface WebhookEndpoint {
  readonly id: UUID; // 16 bytes
  readonly urlHash: BigInt; // 8 bytes - URL hash for privacy
  readonly secretHash: BigInt; // 8 bytes - secret hash
  readonly events: number; // 4 bytes - subscribed events bitmask
  readonly status: number; // 1 byte - endpoint status
  readonly created: number; // 4 bytes - creation time
}

// Nano webhook event - 28 bytes
export interface WebhookEvent {
  readonly id: UUID; // 16 bytes
  readonly type: number; // 1 byte - event type enum
  readonly payload: BigInt; // 8 bytes - payload hash
  readonly timestamp: number; // 4 bytes - event time
  readonly priority: number; // 1 byte - delivery priority
}

// Micro delivery attempt - 24 bytes
export interface DeliveryAttempt {
  readonly attemptId: BigInt; // 8 bytes
  readonly eventId: UUID; // 16 bytes
  readonly status: number; // 1 byte - delivery status
  readonly httpCode: number; // 2 bytes - HTTP response code
  readonly duration: number; // 2 bytes - delivery time ms
  readonly attempted: number; // 4 bytes - attempt time
}

// Webhook subscription - 20 bytes
export interface WebhookSubscription {
  readonly subscriptionId: BigInt; // 8 bytes
  readonly endpointId: UUID; // 16 bytes
  readonly eventMask: number; // 4 bytes - event type bitmask
  readonly filters: number; // 2 bytes - filter flags
  readonly active: boolean; // 1 byte - subscription status
}

// Delivery statistics - 16 bytes
export interface DeliveryStats {
  readonly endpointId: UUID; // 16 bytes
  readonly totalAttempts: number; // 4 bytes
  readonly successCount: number; // 4 bytes
  readonly failureCount: number; // 4 bytes
  readonly avgLatency: number; // 2 bytes - avg response time
  readonly lastDelivery: number; // 4 bytes - last successful delivery
}

// Const enums for zero overhead
export const enum EventType {
  TASK_CREATED = 0,
  TASK_COMPLETED = 1,
  TASK_FAILED = 2,
  SUBMISSION_CREATED = 3,
  SUBMISSION_APPROVED = 4,
  SUBMISSION_REJECTED = 5,
  PAYMENT_PROCESSED = 6,
  PAYMENT_FAILED = 7,
  USER_REGISTERED = 8,
  USER_BANNED = 9,
  EARNINGS_UPDATED = 10,
  QUALITY_SCORED = 11,
  DISPUTE_FILED = 12,
  APPEAL_SUBMITTED = 13,
  SYSTEM_ALERT = 14,
  MAINTENANCE_START = 15
}

export const enum EndpointStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  SUSPENDED = 2,
  FAILED = 3,
  RATE_LIMITED = 4,
  EXPIRED = 5
}

export const enum DeliveryStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2,
  TIMEOUT = 3,
  RATE_LIMITED = 4,
  RETRYING = 5,
  EXPIRED = 6,
  CANCELLED = 7
}

export const enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
  IMMEDIATE = 4
}

export const enum RetryStrategy {
  NONE = 0,
  LINEAR = 1,
  EXPONENTIAL = 2,
  FIBONACCI = 3,
  CUSTOM = 4
}

// Type aliases for micro-optimization
export type EndpointId = UUID;
export type EventId = UUID;
export type SubscriptionId = BigInt;
export type AttemptId = BigInt;
export type UrlHash = BigInt;
export type SecretHash = BigInt;
export type PayloadHash = BigInt;
export type Timestamp = number;
export type EventMask = number;

// Memory-mapped webhook storage
export interface WebhookStorage {
  readonly buffer: SharedArrayBuffer;
  readonly endpointOffset: number;
  readonly eventOffset: number;
  readonly attemptOffset: number;
  readonly subscriptionOffset: number;
  readonly statsOffset: number;
}

// High-speed webhook dispatcher
export interface WebhookDispatcher {
  readonly dispatch: (event: WebhookEvent) => Promise<readonly AttemptId[]>;
  readonly retry: (attemptId: AttemptId) => Promise<DeliveryStatus>;
  readonly cancel: (eventId: EventId) => boolean;
  readonly bulkDispatch: (events: readonly WebhookEvent[]) => Promise<number>;
  readonly getStats: (endpointId: EndpointId) => DeliveryStats;
}

// Webhook security manager
export interface WebhookSecurity {
  readonly validateSignature: (payload: ArrayBuffer, signature: string, secret: string) => boolean;
  readonly generateSecret: () => string;
  readonly rotateSecret: (endpointId: EndpointId) => string;
  readonly validateUrl: (url: string) => boolean;
  readonly encryptPayload: (payload: ArrayBuffer, key: string) => ArrayBuffer;
}

// Event filter engine - 12 bytes
export interface EventFilter {
  readonly filterId: BigInt; // 8 bytes
  readonly conditions: number; // 2 bytes - filter conditions
  readonly action: number; // 1 byte - filter action
  readonly priority: number; // 1 byte - filter priority
}

// Rate limiter config - 8 bytes
export interface RateLimit {
  readonly requestsPerSecond: number; // 2 bytes
  readonly burstSize: number; // 2 bytes
  readonly windowSize: number; // 2 bytes - time window seconds
  readonly strategy: number; // 1 byte - limiting strategy
  readonly enabled: boolean; // 1 byte
}

// Webhook analytics aggregate
export interface WebhookAnalytics {
  readonly totalEvents: BigInt;
  readonly totalAttempts: BigInt;
  readonly successRate: number;
  readonly avgLatency: number;
  readonly errorRate: number;
  readonly topEventTypes: readonly EventType[];
  readonly failureReasons: Map<number, number>;
}

// Delivery queue entry - 20 bytes
export interface DeliveryQueue {
  readonly queueId: BigInt; // 8 bytes
  readonly eventId: EventId; // 16 bytes
  readonly scheduled: Timestamp; // 4 bytes - delivery time
  readonly retries: number; // 1 byte - retry count
  readonly priority: Priority; // 1 byte
}

// Webhook circuit breaker - 12 bytes
export interface CircuitBreaker {
  readonly endpointId: EndpointId; // 16 bytes
  readonly state: number; // 1 byte - breaker state
  readonly failures: number; // 2 bytes - failure count
  readonly lastFailure: Timestamp; // 4 bytes
  readonly timeout: number; // 4 bytes - timeout duration
}

// Dead letter queue entry - 24 bytes
export interface DeadLetter {
  readonly deadLetterId: BigInt; // 8 bytes
  readonly eventId: EventId; // 16 bytes
  readonly reason: number; // 1 byte - failure reason
  readonly attempts: number; // 1 byte - total attempts
  readonly created: Timestamp; // 4 bytes
}

// Webhook monitoring alert - 20 bytes
export interface WebhookAlert {
  readonly alertId: BigInt; // 8 bytes
  readonly endpointId: EndpointId; // 16 bytes
  readonly severity: number; // 1 byte - alert severity
  readonly type: number; // 1 byte - alert type
  readonly triggered: Timestamp; // 4 bytes
}

// Zero-allocation webhook manager
export interface WebhookManager {
  readonly register: (endpoint: WebhookEndpoint) => Promise<EndpointId>;
  readonly subscribe: (endpointId: EndpointId, events: readonly EventType[]) => Promise<SubscriptionId>;
  readonly unsubscribe: (subscriptionId: SubscriptionId) => Promise<boolean>;
  readonly send: (event: WebhookEvent) => Promise<readonly AttemptId[]>;
  readonly getDeliveryStats: (endpointId: EndpointId) => DeliveryStats;
  readonly health: () => readonly CircuitBreaker[];
  readonly analytics: () => WebhookAnalytics;
}
