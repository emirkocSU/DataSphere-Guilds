/**
 * @fileoverview Push Notification Orchestrator Types
 */

export type NotificationId = string;
export type UserId = string;
export type SegmentId = string;
export type TemplateId = string;
export type CampaignId = string;
export type ISOTimestamp = string;

export interface Notification {
  id: NotificationId;
  userId: UserId;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels: NotificationChannel[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'scheduled' | 'sent' | 'delivered' | 'failed' | 'bounced';
  scheduledAt?: ISOTimestamp;
  sentAt?: ISOTimestamp;
  deliveredAt?: ISOTimestamp;
  templateId?: TemplateId;
  campaignId?: CampaignId;
  metadata: NotificationMetadata;
}

export interface NotificationMetadata {
  source: string;
  tags: string[];
  customData: Record<string, unknown>;
  tracking: TrackingConfig;
  personalization: PersonalizationData;
  retryCount: number;
  maxRetries: number;
}

export interface NotificationChannel {
  type: 'push' | 'email' | 'sms' | 'webhook' | 'slack' | 'teams';
  config: ChannelConfig;
  enabled: boolean;
  fallback?: boolean;
}

export interface ChannelConfig {
  provider: string;
  credentials: Record<string, string>;
  settings: Record<string, unknown>;
  rateLimit?: RateLimitConfig;
}

export interface RateLimitConfig {
  requests: number;
  window: number;
  burst: number;
}

export interface UserProfile {
  userId: UserId;
  preferences: NotificationPreferences;
  segments: SegmentId[];
  deviceTokens: DeviceToken[];
  timezone: string;
  language: string;
  subscriptions: Subscription[];
  analytics: UserAnalytics;
}

export interface NotificationPreferences {
  enabled: boolean;
  channels: Record<string, boolean>;
  quietHours: QuietHours;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  categories: Record<string, boolean>;
}

export interface QuietHours {
  enabled: boolean;
  start: string;
  end: string;
  timezone: string;
}

export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android' | 'web' | 'desktop';
  active: boolean;
  registeredAt: ISOTimestamp;
  lastUsed: ISOTimestamp;
}

export interface Subscription {
  id: string;
  type: string;
  status: 'active' | 'paused' | 'unsubscribed';
  subscribedAt: ISOTimestamp;
  unsubscribedAt?: ISOTimestamp;
  reason?: string;
}

export interface UserAnalytics {
  totalNotifications: number;
  deliveredNotifications: number;
  openedNotifications: number;
  clickedNotifications: number;
  lastEngagement: ISOTimestamp;
  engagementScore: number;
  optimalSendTime: string;
}

export interface Segment {
  id: SegmentId;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  userCount: number;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  isActive: boolean;
}

export interface SegmentCriteria {
  rules: SegmentRule[];
  operator: 'AND' | 'OR';
}

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

export interface NotificationTemplate {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  channels: Record<string, ChannelTemplate>;
  variables: TemplateVariable[];
  scheduling: SchedulingOptions;
  personalization: PersonalizationOptions;
  isActive: boolean;
}

export interface ChannelTemplate {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  style?: Record<string, unknown>;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  defaultValue?: unknown;
  validation?: string;
}

export interface NotificationAction {
  id: string;
  title: string;
  action: string;
  url?: string;
  data?: Record<string, unknown>;
}

export interface SchedulingOptions {
  timezone: string;
  sendTime?: string;
  daysOfWeek?: number[];
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  endDate?: ISOTimestamp;
  respectQuietHours: boolean;
}

export interface PersonalizationOptions {
  enabled: boolean;
  fields: string[];
  rules: PersonalizationRule[];
}

export interface PersonalizationRule {
  condition: string;
  action: 'include' | 'exclude' | 'replace';
  value: unknown;
}

export interface PersonalizationData {
  userId: UserId;
  variables: Record<string, unknown>;
  preferences: Record<string, unknown>;
  context: Record<string, unknown>;
}

export interface TrackingConfig {
  enabled: boolean;
  events: string[];
  parameters: Record<string, unknown>;
}

export interface Campaign {
  id: CampaignId;
  name: string;
  description: string;
  templateId: TemplateId;
  segmentIds: SegmentId[];
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'cancelled';
  scheduling: CampaignScheduling;
  targeting: CampaignTargeting;
  analytics: CampaignAnalytics;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface CampaignScheduling {
  type: 'immediate' | 'scheduled' | 'recurring';
  startDate: ISOTimestamp;
  endDate?: ISOTimestamp;
  timezone: string;
  sendTime?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export interface CampaignTargeting {
  segments: SegmentId[];
  includeUsers: UserId[];
  excludeUsers: UserId[];
  maxUsers?: number;
  samplePercentage?: number;
}

export interface CampaignAnalytics {
  totalUsers: number;
  sentNotifications: number;
  deliveredNotifications: number;
  openedNotifications: number;
  clickedNotifications: number;
  bounceRate: number;
  unsubscribeRate: number;
  conversionRate: number;
  revenue: number;
}

export interface NotificationMetrics {
  totalNotifications: number;
  deliveredNotifications: number;
  failedNotifications: number;
  bounceRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  averageDeliveryTime: number;
  channelPerformance: Record<string, ChannelMetrics>;
}

export interface ChannelMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  deliveryRate: number;
  engagementRate: number;
  averageDeliveryTime: number;
}