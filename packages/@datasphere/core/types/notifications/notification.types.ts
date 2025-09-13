/**
 * @fileoverview Zepto-optimized notification types with multi-channel delivery.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact notification - 32 bytes
export interface Notification {
  readonly id: UUID; // 16 bytes
  readonly recipientId: UUID; // 16 bytes
  readonly type: number; // 1 byte - notification type
  readonly channel: number; // 1 byte - delivery channel
  readonly priority: number; // 1 byte - notification priority
  readonly status: number; // 1 byte - delivery status
  readonly template: BigInt; // 8 bytes - template hash
  readonly data: BigInt; // 8 bytes - payload hash
  readonly created: number; // 4 bytes - creation time
  readonly delivered: number; // 4 bytes - delivery time
}

// Nano notification context - 24 bytes
export interface NotificationContext {
  readonly contextId: BigInt; // 8 bytes
  readonly notificationId: UUID; // 16 bytes
  readonly variables: BigInt; // 8 bytes - variables hash
  readonly locale: number; // 2 bytes - locale code
  readonly timezone: number; // 2 bytes - timezone offset
}

// Micro delivery record - 20 bytes
export interface DeliveryRecord {
  readonly deliveryId: BigInt; // 8 bytes
  readonly notificationId: UUID; // 16 bytes
  readonly attempt: number; // 1 byte - delivery attempt
  readonly status: number; // 1 byte - delivery status
  readonly attempted: number; // 4 bytes - attempt time
  readonly latency: number; // 2 bytes - delivery latency
}

// Notification batch - 16 bytes
export interface NotificationBatch {
  readonly batchId: BigInt; // 8 bytes
  readonly notifications: readonly UUID[]; // notification IDs
  readonly size: number; // 2 bytes - batch size
  readonly status: number; // 1 byte - batch status
  readonly created: number; // 4 bytes - batch creation
}

// User subscription - 12 bytes
export interface UserSubscription {
  readonly userId: UUID; // 16 bytes
  readonly types: number; // 4 bytes - notification type bitmask
  readonly channels: number; // 2 bytes - channel bitmask
  readonly active: boolean; // 1 byte - subscription status
}

// Notification statistics - 24 bytes
export interface NotificationStats {
  readonly userId: UUID; // 16 bytes
  readonly totalSent: number; // 4 bytes - total notifications
  readonly totalRead: number; // 4 bytes - read count
  readonly readRate: number; // 2 bytes - read percentage
  readonly lastActivity: number; // 4 bytes - last activity
}

// Const enums for zero overhead
export const enum NotificationType {
  TASK_ASSIGNED = 0,
  TASK_COMPLETED = 1,
  PAYMENT_RECEIVED = 2,
  QUALITY_FEEDBACK = 3,
  SYSTEM_ANNOUNCEMENT = 4,
  DEADLINE_REMINDER = 5,
  ACHIEVEMENT_UNLOCKED = 6,
  DISPUTE_FILED = 7,
  APPEAL_DECISION = 8,
  MAINTENANCE_NOTICE = 9,
  SECURITY_ALERT = 10,
  PERFORMANCE_REPORT = 11,
  BONUS_EARNED = 12,
  LEVEL_UP = 13,
  FRIEND_REQUEST = 14,
  MESSAGE_RECEIVED = 15
}

export const enum DeliveryChannel {
  EMAIL = 0,
  SMS = 1,
  PUSH = 2,
  IN_APP = 3,
  WEBHOOK = 4,
  SLACK = 5,
  DISCORD = 6,
  TELEGRAM = 7,
  WHATSAPP = 8,
  TEAMS = 9
}

export const enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
  CRITICAL = 4
}

export const enum DeliveryStatus {
  PENDING = 0,
  SENT = 1,
  DELIVERED = 2,
  READ = 3,
  FAILED = 4,
  BOUNCED = 5,
  SPAM = 6,
  UNSUBSCRIBED = 7
}

export const enum BatchStatus {
  CREATED = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  PARTIAL = 4
}

// Type aliases for micro-optimization
export type NotificationId = UUID;
export type RecipientId = UUID;
export type UserId = UUID;
export type TemplateHash = BigInt;
export type PayloadHash = BigInt;
export type VariablesHash = BigInt;
export type ContextId = BigInt;
export type DeliveryId = BigInt;
export type BatchId = BigInt;
export type Timestamp = number;
export type Latency = number;
export type LocaleCode = number;
export type TimezoneOffset = number;

// Memory-mapped notification storage
export interface NotificationStorage {
  readonly buffer: SharedArrayBuffer;
  readonly notificationOffset: number;
  readonly contextOffset: number;
  readonly deliveryOffset: number;
  readonly batchOffset: number;
  readonly subscriptionOffset: number;
  readonly statsOffset: number;
}

// High-speed notification engine
export interface NotificationEngine {
  readonly send: (notification: Notification, context?: NotificationContext) => Promise<NotificationId>;
  readonly sendBatch: (notifications: readonly Notification[]) => Promise<BatchId>;
  readonly retry: (notificationId: NotificationId) => Promise<DeliveryId>;
  readonly cancel: (notificationId: NotificationId) => Promise<boolean>;
  readonly getStatus: (notificationId: NotificationId) => DeliveryStatus;
  readonly getStats: (userId: UserId) => NotificationStats;
}

// Multi-channel dispatcher
export interface NotificationDispatcher {
  readonly dispatch: (notification: Notification, channel: DeliveryChannel) => Promise<DeliveryRecord>;
  readonly bulkDispatch: (notifications: readonly Notification[], channel: DeliveryChannel) => Promise<readonly DeliveryRecord[]>;
  readonly validateChannel: (channel: DeliveryChannel, recipientId: RecipientId) => boolean;
  readonly selectChannel: (notification: Notification) => DeliveryChannel;
}

// Notification scheduler - 16 bytes
export interface NotificationSchedule {
  readonly scheduleId: BigInt; // 8 bytes
  readonly notificationId: NotificationId; // 16 bytes
  readonly scheduledTime: Timestamp; // 4 bytes - scheduled delivery
  readonly timezone: TimezoneOffset; // 2 bytes - recipient timezone
  readonly recurring: boolean; // 1 byte - recurring notification
}

// Rate limiting config - 8 bytes
export interface RateLimit {
  readonly userId: UserId; // 16 bytes
  readonly maxPerHour: number; // 2 bytes - hourly limit
  readonly maxPerDay: number; // 2 bytes - daily limit
  readonly currentHour: number; // 2 bytes - current hour count
  readonly currentDay: number; // 2 bytes - current day count
}

// Notification analytics aggregate
export interface NotificationAnalytics {
  readonly totalSent: BigInt;
  readonly deliveryRate: number;
  readonly readRate: number;
  readonly avgLatency: number;
  readonly channelPerformance: Map<DeliveryChannel, number>;
  readonly typePerformance: Map<NotificationType, number>;
}

// Delivery attempt tracking - 12 bytes
export interface DeliveryAttempt {
  readonly attemptId: BigInt; // 8 bytes
  readonly deliveryId: DeliveryId; // 8 bytes
  readonly error: number; // 1 byte - error code
  readonly attempted: Timestamp; // 4 bytes - attempt time
}

// User device registration - 24 bytes
export interface DeviceRegistration {
  readonly deviceId: BigInt; // 8 bytes
  readonly userId: UserId; // 16 bytes
  readonly type: number; // 1 byte - device type
  readonly token: BigInt; // 8 bytes - device token hash
  readonly registered: Timestamp; // 4 bytes - registration time
  readonly active: boolean; // 1 byte - device status
}

// Notification queue entry - 20 bytes
export interface NotificationQueue {
  readonly queueId: BigInt; // 8 bytes
  readonly notificationId: NotificationId; // 16 bytes
  readonly priority: Priority; // 1 byte
  readonly scheduled: Timestamp; // 4 bytes - processing time
  readonly expires: Timestamp; // 4 bytes - expiration time
}

// Read receipt tracking - 16 bytes
export interface ReadReceipt {
  readonly receiptId: BigInt; // 8 bytes
  readonly notificationId: NotificationId; // 16 bytes
  readonly readAt: Timestamp; // 4 bytes - read timestamp
  readonly duration: number; // 2 bytes - read duration
}

// Notification digest - 20 bytes
export interface NotificationDigest {
  readonly digestId: BigInt; // 8 bytes
  readonly userId: UserId; // 16 bytes
  readonly notifications: readonly NotificationId[]; // notification list
  readonly frequency: number; // 1 byte - digest frequency
  readonly nextSend: Timestamp; // 4 bytes - next digest time
}

// Dead letter notification - 24 bytes
export interface DeadLetter {
  readonly deadLetterId: BigInt; // 8 bytes
  readonly notificationId: NotificationId; // 16 bytes
  readonly reason: number; // 1 byte - failure reason
  readonly attempts: number; // 1 byte - total attempts
  readonly failed: Timestamp; // 4 bytes - failure time
}

// Zero-allocation notification manager
export interface NotificationManager {
  readonly create: (type: NotificationType, recipientId: RecipientId, data: any) => Promise<NotificationId>;
  readonly schedule: (notification: Notification, deliveryTime: Timestamp) => Promise<NotificationId>;
  readonly send: (notificationId: NotificationId) => Promise<DeliveryRecord>;
  readonly markRead: (notificationId: NotificationId, userId: UserId) => Promise<boolean>;
  readonly subscribe: (userId: UserId, types: readonly NotificationType[], channels: readonly DeliveryChannel[]) => Promise<boolean>;
  readonly unsubscribe: (userId: UserId, types?: readonly NotificationType[]) => Promise<boolean>;
  readonly getAnalytics: () => NotificationAnalytics;
  readonly health: () => readonly RateLimit[];
}