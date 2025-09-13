/**
 * @fileoverview Atto-optimized event system types with streaming processing.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact event record - 32 bytes
export interface EventRecord {
  readonly id: UUID; // 16 bytes
  readonly type: number; // 1 byte - event type enum
  readonly source: number; // 1 byte - event source
  readonly severity: number; // 1 byte - event severity
  readonly category: number; // 1 byte - event category
  readonly data: BigInt; // 8 bytes - event data hash
  readonly timestamp: number; // 4 bytes - event time
}

// Nano event subscription - 20 bytes
export interface EventSubscription {
  readonly subscriptionId: BigInt; // 8 bytes
  readonly subscriberId: UUID; // 16 bytes
  readonly eventMask: number; // 4 bytes - event type bitmask
  readonly filters: number; // 2 bytes - filter flags
  readonly active: boolean; // 1 byte - subscription status
}

// Micro event stream - 24 bytes
export interface EventStream {
  readonly streamId: BigInt; // 8 bytes
  readonly name: BigInt; // 8 bytes - stream name hash
  readonly partition: number; // 2 bytes - stream partition
  readonly offset: BigInt; // 8 bytes - current offset
  readonly timestamp: number; // 4 bytes - last event time
}

// Event processing state - 16 bytes
export interface ProcessingState {
  readonly processorId: BigInt; // 8 bytes
  readonly streamId: BigInt; // 8 bytes
  readonly lastOffset: BigInt; // 8 bytes - last processed offset
  readonly lag: number; // 4 bytes - processing lag ms
  readonly errors: number; // 2 bytes - error count
  readonly status: number; // 1 byte - processor status
}

// Event batch - 20 bytes
export interface EventBatch {
  readonly batchId: BigInt; // 8 bytes
  readonly events: readonly EventRecord[]; // event list
  readonly size: number; // 4 bytes - batch size
  readonly checksum: BigInt; // 8 bytes - batch integrity
}

// Stream consumer - 16 bytes
export interface StreamConsumer {
  readonly consumerId: BigInt; // 8 bytes
  readonly groupId: BigInt; // 8 bytes - consumer group hash
  readonly lastHeartbeat: number; // 4 bytes - last heartbeat
  readonly status: number; // 1 byte - consumer status
}

// Const enums for zero overhead
export const enum EventType {
  SYSTEM_START = 0,
  SYSTEM_STOP = 1,
  USER_LOGIN = 2,
  USER_LOGOUT = 3,
  TASK_ASSIGNED = 4,
  TASK_SUBMITTED = 5,
  TASK_COMPLETED = 6,
  PAYMENT_INITIATED = 7,
  PAYMENT_COMPLETED = 8,
  ERROR_OCCURRED = 9,
  WARNING_ISSUED = 10,
  AUDIT_ENTRY = 11,
  SECURITY_ALERT = 12,
  PERFORMANCE_ALERT = 13,
  CAPACITY_ALERT = 14,
  MAINTENANCE_SCHEDULED = 15
}

export const enum EventSource {
  API = 0,
  WEBAPP = 1,
  MOBILE = 2,
  WORKER = 3,
  SCHEDULER = 4,
  MONITOR = 5,
  WEBHOOK = 6,
  CRON = 7,
  EXTERNAL = 8,
  SYSTEM = 9
}

export const enum EventSeverity {
  DEBUG = 0,
  INFO = 1,
  NOTICE = 2,
  WARNING = 3,
  ERROR = 4,
  CRITICAL = 5,
  ALERT = 6,
  EMERGENCY = 7
}

export const enum EventCategory {
  BUSINESS = 0,
  TECHNICAL = 1,
  SECURITY = 2,
  PERFORMANCE = 3,
  AUDIT = 4,
  MONITORING = 5,
  NOTIFICATION = 6,
  INTEGRATION = 7
}

export const enum ProcessorStatus {
  IDLE = 0,
  RUNNING = 1,
  PAUSED = 2,
  ERROR = 3,
  STOPPING = 4,
  STOPPED = 5
}

export const enum ConsumerStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  REBALANCING = 2,
  FAILED = 3,
  SHUTDOWN = 4
}

// Type aliases for micro-optimization
export type EventId = UUID;
export type SubscriptionId = BigInt;
export type StreamId = BigInt;
export type ProcessorId = BigInt;
export type ConsumerId = BigInt;
export type GroupId = BigInt;
export type BatchId = BigInt;
export type EventData = BigInt;
export type Timestamp = number;
export type Offset = BigInt;
export type EventMask = number;

// Memory-mapped event storage
export interface EventStorage {
  readonly buffer: SharedArrayBuffer;
  readonly recordOffset: number;
  readonly subscriptionOffset: number;
  readonly streamOffset: number;
  readonly stateOffset: number;
  readonly batchOffset: number;
  readonly consumerOffset: number;
}

// High-speed event processor
export interface EventProcessor {
  readonly process: (event: EventRecord) => Promise<boolean>;
  readonly processBatch: (batch: EventBatch) => Promise<number>;
  readonly subscribe: (subscription: EventSubscription) => Promise<SubscriptionId>;
  readonly unsubscribe: (subscriptionId: SubscriptionId) => Promise<boolean>;
  readonly getState: () => ProcessingState;
}

// Event stream manager
export interface EventStreamManager {
  readonly createStream: (name: string, partitions: number) => Promise<StreamId>;
  readonly publish: (streamId: StreamId, event: EventRecord) => Promise<Offset>;
  readonly consume: (streamId: StreamId, consumerId: ConsumerId, offset?: Offset) => Promise<EventBatch>;
  readonly seek: (streamId: StreamId, consumerId: ConsumerId, offset: Offset) => Promise<boolean>;
  readonly commit: (streamId: StreamId, consumerId: ConsumerId, offset: Offset) => Promise<boolean>;
}

// Event routing engine - 12 bytes
export interface EventRouter {
  readonly ruleId: BigInt; // 8 bytes
  readonly conditions: number; // 2 bytes - routing conditions
  readonly action: number; // 1 byte - routing action
  readonly priority: number; // 1 byte - rule priority
}

// Event aggregation window - 16 bytes
export interface AggregationWindow {
  readonly windowId: BigInt; // 8 bytes
  readonly startTime: Timestamp; // 4 bytes - window start
  readonly endTime: Timestamp; // 4 bytes - window end
  readonly eventCount: number; // 4 bytes - events in window
}

// Event analytics metrics
export interface EventAnalytics {
  readonly totalEvents: BigInt;
  readonly eventsPerSecond: number;
  readonly avgProcessingTime: number;
  readonly errorRate: number;
  readonly topEventTypes: readonly EventType[];
  readonly sourceDistribution: Map<EventSource, number>;
}

// Dead letter event - 28 bytes
export interface DeadLetterEvent {
  readonly deadLetterId: BigInt; // 8 bytes
  readonly originalEvent: EventRecord; // 32 bytes - original event
  readonly reason: number; // 1 byte - failure reason
  readonly attempts: number; // 1 byte - processing attempts
  readonly failed: Timestamp; // 4 bytes - failure time
}

// Event correlation - 24 bytes
export interface EventCorrelation {
  readonly correlationId: BigInt; // 8 bytes
  readonly parentEventId: EventId; // 16 bytes
  readonly childEventId: EventId; // 16 bytes
  readonly relationship: number; // 1 byte - correlation type
  readonly strength: number; // 2 bytes - correlation strength
}

// Stream checkpoint - 20 bytes
export interface StreamCheckpoint {
  readonly checkpointId: BigInt; // 8 bytes
  readonly streamId: StreamId; // 8 bytes
  readonly offset: Offset; // 8 bytes - checkpoint offset
  readonly timestamp: Timestamp; // 4 bytes - checkpoint time
}

// Event transformation rule - 16 bytes
export interface TransformationRule {
  readonly ruleId: BigInt; // 8 bytes
  readonly inputType: EventType; // 1 byte - source event type
  readonly outputType: EventType; // 1 byte - target event type
  readonly transformation: BigInt; // 8 bytes - transform function hash
  readonly active: boolean; // 1 byte - rule status
}

// Consumer group rebalance - 16 bytes
export interface ConsumerRebalance {
  readonly rebalanceId: BigInt; // 8 bytes
  readonly groupId: GroupId; // 8 bytes
  readonly generation: number; // 2 bytes - rebalance generation
  readonly members: number; // 2 bytes - group member count
  readonly started: Timestamp; // 4 bytes - rebalance start
}

// Zero-allocation event engine
export interface EventEngine {
  readonly emit: (event: EventRecord) => Promise<EventId>;
  readonly emitBatch: (events: readonly EventRecord[]) => Promise<readonly EventId[]>;
  readonly subscribe: (subscription: EventSubscription) => Promise<SubscriptionId>;
  readonly createStream: (name: string) => Promise<StreamId>;
  readonly getAnalytics: () => EventAnalytics;
  readonly health: () => readonly ProcessingState[];
}