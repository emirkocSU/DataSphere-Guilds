
/**
 * @file real-time-updates.ts
 * @version 2.0.0
 * @description Defines the enterprise-grade type structures for the real-time event streaming system
 *              of the DataSphere Guilds platform. This system is responsible for delivering live updates
 *              on project progress, QC status, payments, and other critical events to all participants.
 *
 * @copyright Copyright (c) 2024-2025 DataSphere Guilds, Inc.
 * @license MIT
 *
 * @description
 * This file establishes the contract for the event-driven architecture that powers the platform's
 * dynamic user experience. By defining a strongly-typed, granular, and extensible event system,
 * we ensure reliability, efficiency, and a superior developer experience for both frontend and
 * backend services. The architecture is designed to be transport-agnostic (WebSockets, SSE, etc.)
 * and to scale to millions of concurrent events.
 */

// Define missing types locally to avoid import errors
export type TaskStatus = 'pending' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'failed' | 'cancelled';
export type TaskDomain = 'DATA_COLLECTION' | 'IMAGE_ANNOTATION' | 'TEXT_PROCESSING' | 'AUDIO_TRANSCRIPTION';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  domain: TaskDomain;
}

export interface QcResult {
  id: string;
  decision: 'APPROVED' | 'REJECTED';
  score: number;
  feedback?: string;
}

export type QualityLevel = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';

export interface UserProfile {
  id: string;
  username: string;
  reputation: number;
}

/**
 * A comprehensive enumeration of all real-time events that can occur within the DataSphere Guilds ecosystem.
 * Each event represents a specific, meaningful state change.
 */
export enum RealTimeEventType {
  // Task Lifecycle Events
  TASK_CREATED = 'task.created',
  TASK_CLAIMED = 'task.claimed',
  TASK_SUBMITTED = 'task.submitted',
  TASK_STATUS_CHANGED = 'task.status.changed',
  TASK_DEADLINE_EXTENDED = 'task.deadline.extended',
  TASK_EXPIRED = 'task.expired',

  // Quality Control (QC) Pipeline Events
  QC_PROCESS_STARTED = 'qc.process.started',
  QC_LAYER_ADVANCED = 'qc.layer.advanced',
  QC_REVIEW_ASSIGNED = 'qc.review.assigned',
  QC_COMPLETED = 'qc.completed',

  // Appeal System Events
  APPEAL_SUBMITTED = 'appeal.submitted',
  APPEAL_STATUS_CHANGED = 'appeal.status.changed',

  // Financial & Earning Events
  PAYMENT_PROCESSED = 'payment.processed',
  EARNINGS_ACCRUED = 'earnings.accrued',

  // Worker & Reputation Events
  REPUTATION_SCORE_UPDATED = 'reputation.score.updated',
  SKILL_BADGE_AWARDED = 'skill.badge.awarded',

  // Communication & Notification Events
  NEW_COMMENT_ON_TASK = 'communication.new_comment',
  PLATFORM_ANNOUNCEMENT = 'system.announcement',

  // System & Health Events
  SYSTEM_STATUS_CHANGED = 'system.status.changed',
}

// --- Payload Definitions ---
// Each event type has a corresponding, specific payload interface for maximum type safety.

export interface TaskStatusChangedPayload {
  taskId: string;
  submissionId: string;
  previousStatus: TaskStatus;
  newStatus: TaskStatus;
  message: string;
}

export interface QcLayerAdvancedPayload {
  submissionId: string;
  fromLayer: string; // e.g., 'AI_VALIDATION'
  toLayer: string;   // e.g., 'PEER_REVIEW'
  aiConfidenceScore?: number;
}

export interface QcCompletedPayload {
  submissionId: string;
  finalDecision: 'APPROVED' | 'REJECTED';
  qcResult: QcResult;
  workerId: string;
}

export interface PaymentProcessedPayload {
  workerId: string;
  transactionId: string;
  amount: number;
  currency: string;
  payoutMethod: string;
}

export interface ReputationScoreUpdatedPayload {
  workerId: string;
  previousScore: number;
  newScore: number;
  reason: string;
}

export interface PlatformAnnouncementPayload {
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  link?: string;
}

/**
 * A master mapping of each event type to its corresponding payload interface.
 * This is the core of the strongly-typed event system.
 */
export interface EventPayloadMap {
  [RealTimeEventType.TASK_STATUS_CHANGED]: TaskStatusChangedPayload;
  [RealTimeEventType.QC_LAYER_ADVANCED]: QcLayerAdvancedPayload;
  [RealTimeEventType.QC_COMPLETED]: QcCompletedPayload;
  [RealTimeEventType.PAYMENT_PROCESSED]: PaymentProcessedPayload;
  [RealTimeEventType.REPUTATION_SCORE_UPDATED]: ReputationScoreUpdatedPayload;
  [RealTimeEventType.PLATFORM_ANNOUNCEMENT]: PlatformAnnouncementPayload;
  // ... other event payloads would be mapped here
}

/**
 * The generic envelope for any real-time event sent through the system.
 * @template T - The specific event type from RealTimeEventType.
 * @template P - The specific payload type for that event.
 */
export interface RealTimeEvent<T extends RealTimeEventType, P> {
  /** A unique identifier for this specific event instance. */
  eventId: string;
  /** The specific type of the event. */
  eventType: T;
  /** The timestamp when the event was generated on the server. */
  timestamp: string; // ISO 8601 format
  /** The data payload containing information specific to this event. */
  payload: P;
  /** Optional metadata for tracing, versioning, and context. */
  metadata: {
    /** A correlation ID to trace a request through multiple services. */
    correlationId?: string;
    /** The service that originated the event. */
    sourceService: string; // e.g., 'qc-engine', 'payment-service'
    /** The version of the payload schema. */
    schemaVersion: string;
  };
}

/**
 * A powerful mapped type that creates a discriminated union of all possible real-time events.
 * When you check `event.eventType`, TypeScript will automatically infer the correct type for `event.payload`.
 * This is the primary type that should be used by clients consuming the real-time stream.
 */
export type DataSphereRealTimeEvent = {
  [K in keyof EventPayloadMap]: RealTimeEvent<K, EventPayloadMap[K]>;
}[keyof EventPayloadMap];


// --- Subscription and Channel Management ---

/**
 * Defines the possible channel patterns a client can subscribe to.
 * This allows for granular control over which updates a client receives.
 * Examples:
 * - `tasks:task_123` -> Updates for a specific task.
 * - `workers:worker_abc` -> Updates relevant to a specific worker (payments, reputation).
 * - `system:announcements` -> Platform-wide announcements.
 */
export type ChannelName = `tasks:${string}` | `workers:${string}` | `system:announcements` | `qc-jobs:${string}`;

/**
 * Represents a request from a client to subscribe to or unsubscribe from a channel.
 */
export interface SubscriptionRequest {
  action: 'SUBSCRIBE' | 'UNSUBSCRIBE';
  channel: ChannelName;
  /** A token to authorize the subscription request. */
  authToken: string;
}

/**
 * Represents a confirmation or error response to a subscription request.
 */
export interface SubscriptionResponse {
  channel: ChannelName;
  status: 'CONFIRMED' | 'DENIED';
  message?: string;
}
