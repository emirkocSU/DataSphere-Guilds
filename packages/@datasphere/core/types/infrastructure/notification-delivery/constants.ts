/**
 * @file packages/@datasphere/core/types/infrastructure/notification-delivery/constants.ts
 * @version 3.0.0
 * @description Ultra-optimized notification constants for DataSphere Guilds
 */

/**
 * Multi-modal notification channels with delivery optimization
 */
export enum NotificationChannel {
  // Push (Mobile-First)
  PUSH_FCM = 'PUSH_FCM',
  PUSH_APNS = 'PUSH_APNS',
  PUSH_WEB = 'PUSH_WEB',
  
  // Email (Rich Media)
  EMAIL_SENDGRID = 'EMAIL_SENDGRID',
  EMAIL_SES = 'EMAIL_SES',
  EMAIL_RESEND = 'EMAIL_RESEND',
  
  // SMS/Chat (Instant)
  SMS_TWILIO = 'SMS_TWILIO',
  SMS_MESSAGEBIRD = 'SMS_MESSAGEBIRD',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  
  // Rich Media
  SLACK = 'SLACK',
  DISCORD = 'DISCORD',
  TEAMS = 'TEAMS',
  
  // System
  WEBHOOK = 'WEBHOOK',
  IN_APP = 'IN_APP',
  WEBSOCKET = 'WEBSOCKET',
}

/**
 * Performance-optimized delivery status
 */
export enum DeliveryStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  CLICKED = 'CLICKED',
  OPENED = 'OPENED',
  DISMISSED = 'DISMISSED',
}

/**
 * Smart priority with delivery optimization
 */
export enum NotificationPriority {
  LOW = 'LOW',        // Batch delivery, cost-optimized
  NORMAL = 'NORMAL',  // Standard queue
  HIGH = 'HIGH',      // Priority queue
  URGENT = 'URGENT',  // Immediate delivery, all channels
}

/**
 * Streamlined categories for better UX
 */
export enum NotificationCategory {
  SECURITY = 'SECURITY',
  FINANCIAL = 'FINANCIAL',
  SOCIAL = 'SOCIAL',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
}

/**
 * Rich media types for multi-modal support
 */
export enum MediaType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  INTERACTIVE = 'INTERACTIVE',
  CAROUSEL = 'CAROUSEL',
}

/**
 * Delivery optimization strategies
 */
export enum DeliveryStrategy {
  IMMEDIATE = 'IMMEDIATE',    // Send now
  BATCHED = 'BATCHED',       // Cost-optimized batching
  SCHEDULED = 'SCHEDULED',   // Time-based delivery
  SMART = 'SMART',           // AI-optimized timing
}

/**
 * Channel reliability tiers for failover
 */
export enum ChannelTier {
  PRIMARY = 'PRIMARY',       // High reliability, premium cost
  SECONDARY = 'SECONDARY',   // Good reliability, standard cost
  FALLBACK = 'FALLBACK',     // Basic reliability, low cost
}

/**
 * Content optimization levels
 */
export enum ContentOptimization {
  MINIMAL = 'MINIMAL',       // Text only
  STANDARD = 'STANDARD',     // Text + basic formatting
  RICH = 'RICH',            // Full media support
  INTERACTIVE = 'INTERACTIVE' // Interactive elements
}