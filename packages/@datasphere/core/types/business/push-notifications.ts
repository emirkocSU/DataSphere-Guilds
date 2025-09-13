/**
 * @fileoverview Push Notifications Core Types - Smart notification system
 * @version 2.0.0
 * SUPER HIGH-PERFORMANCE | SUPER PROFESSIONAL | SUPER LEAN | <550 LINES
 */

import { UUID, Timestamp, Coordinates } from '../api/common';

// Core Enums
export type NotificationType = 'task' | 'earning' | 'social' | 'system' | 'reminder' | 'achievement';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'dismissed' | 'failed';
export type DeliveryChannel = 'push' | 'email' | 'sms' | 'in_app' | 'webhook';

// Core Notification
export interface Notification {
  id: UUID;
  user_id: UUID;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  content: NotificationContent;
  targeting: TargetingConfig;
  delivery: DeliveryConfig;
  tracking: TrackingData;
  scheduled_at: Timestamp;
  sent_at?: Timestamp;
  expires_at?: Timestamp;
  created_at: Timestamp;
}

// Content
export interface NotificationContent {
  title: string;
  body: string;
  summary?: string;
  actions: NotificationAction[];
  media?: MediaContent[];
  data?: Record<string, any>;
  localization?: LocalizedContent[];
}

export interface NotificationAction {
  id: string;
  text: string;
  type: 'open_app' | 'deep_link' | 'web_url' | 'dismiss' | 'custom';
  action: string;
  style?: 'primary' | 'secondary' | 'destructive';
  icon?: string;
}

export interface MediaContent {
  type: 'image' | 'video' | 'audio' | 'gif';
  url: string;
  thumbnail?: string;
  alt_text: string;
  size?: number;
}

export interface LocalizedContent {
  locale: string;
  title: string;
  body: string;
  actions?: { id: string; text: string }[];
}

// Targeting
export interface TargetingConfig {
  audience: AudienceConfig;
  timing: TimingConfig;
  frequency: FrequencyConfig;
  conditions?: TargetingCondition[];
}

export interface AudienceConfig {
  type: 'all' | 'segment' | 'users' | 'query';
  segments?: string[];
  user_ids?: UUID[];
  query?: string;
  exclusions?: string[];
  size_estimate?: number;
}

export interface TimingConfig {
  send_immediately: boolean;
  scheduled_time?: Timestamp;
  timezone?: string;
  optimal_timing?: boolean;
  delivery_window?: {
    start: string; // HH:MM
    end: string;   // HH:MM
    days: string[];
  };
}

export interface FrequencyConfig {
  max_per_hour?: number;
  max_per_day?: number;
  max_per_week?: number;
  category_limits?: { [key: string]: number };
  respect_preferences: boolean;
}

export interface TargetingCondition {
  type: 'behavior' | 'attribute' | 'location' | 'device';
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
  value: any;
  required?: boolean;
}

// Delivery
export interface DeliveryConfig {
  channels: ChannelConfig[];
  strategy: 'immediate' | 'batched' | 'cascade' | 'priority';
  retry: RetryConfig;
  confirmation?: boolean;
}

export interface ChannelConfig {
  channel: DeliveryChannel;
  priority: number;
  fallback?: boolean;
  config?: Record<string, any>;
}

export interface RetryConfig {
  max_attempts: number;
  intervals: number[]; // minutes
  backoff?: 'linear' | 'exponential';
  alternate_channel?: boolean;
}

// Tracking
export interface TrackingData {
  delivery_events: DeliveryEvent[];
  engagement_events: EngagementEvent[];
  metrics: NotificationMetrics;
  attribution?: AttributionData;
}

export interface DeliveryEvent {
  type: 'sent' | 'delivered' | 'bounced' | 'failed';
  channel: DeliveryChannel;
  timestamp: Timestamp;
  details?: Record<string, any>;
  error?: ErrorInfo;
}

export interface EngagementEvent {
  type: 'opened' | 'clicked' | 'dismissed' | 'actioned';
  timestamp: Timestamp;
  action_id?: string;
  context?: UserContext;
}

export interface UserContext {
  location?: Coordinates;
  device?: string;
  app_version?: string;
  session_time?: number;
}

export interface NotificationMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  dismissed: number;
  conversion?: number;
}

export interface AttributionData {
  source: string;
  campaign?: string;
  value?: number;
  timestamp: Timestamp;
}

export interface ErrorInfo {
  code: string;
  message: string;
  category: 'temporary' | 'permanent' | 'rate_limit';
  retry?: boolean;
}

// Templates
export interface NotificationTemplate {
  id: UUID;
  name: string;
  type: NotificationType;
  content: NotificationContent;
  defaults: TemplateDefaults;
  variables: TemplateVariable[];
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TemplateDefaults {
  priority: NotificationPriority;
  channels: DeliveryChannel[];
  timing?: TimingConfig;
  personalization?: PersonalizationConfig;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'object';
  required: boolean;
  default?: any;
  validation?: string;
}

export interface PersonalizationConfig {
  level: 'basic' | 'advanced' | 'ai';
  tone?: 'formal' | 'casual' | 'encouraging' | 'urgent';
  adapt_to_behavior?: boolean;
  use_preferences?: boolean;
}

// Campaigns
export interface NotificationCampaign {
  id: UUID;
  name: string;
  description: string;
  type: 'single' | 'series' | 'triggered' | 'automated';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  notifications: CampaignNotification[];
  triggers?: CampaignTrigger[];
  goals: CampaignGoal[];
  performance: CampaignPerformance;
  created_at: Timestamp;
  starts_at?: Timestamp;
  ends_at?: Timestamp;
}

export interface CampaignNotification {
  template_id: UUID;
  delay?: number; // minutes from trigger/previous
  conditions?: TargetingCondition[];
  overrides?: Partial<NotificationContent>;
}

export interface CampaignTrigger {
  type: 'event' | 'time' | 'condition' | 'manual';
  event?: string;
  schedule?: string; // cron expression
  conditions?: TargetingCondition[];
}

export interface CampaignGoal {
  name: string;
  metric: string;
  target: number;
  window?: number; // hours
}

export interface CampaignPerformance {
  sent: number;
  delivered: number;
  engagement_rate: number;
  conversion_rate: number;
  goals_achieved: number;
  roi?: number;
}

// Automation
export interface AutomationRule {
  id: UUID;
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  active: boolean;
  performance: AutomationMetrics;
}

export interface AutomationTrigger {
  type: 'event' | 'schedule' | 'api' | 'webhook';
  config: Record<string, any>;
  debounce?: number; // seconds
}

export interface AutomationCondition {
  type: 'user' | 'time' | 'data' | 'performance';
  evaluate: string; // expression
  required?: boolean;
}

export interface AutomationAction {
  type: 'send' | 'update' | 'tag' | 'webhook';
  config: Record<string, any>;
  delay?: number; // seconds
}

export interface AutomationMetrics {
  executions: number;
  success_rate: number;
  avg_latency: number; // ms
  errors: number;
}

// User Preferences
export interface UserNotificationPreferences {
  user_id: UUID;
  channels: ChannelPreference[];
  frequency: FrequencyPreference;
  quiet_hours?: QuietHours;
  categories: CategoryPreference[];
  language?: string;
  timezone?: string;
  updated_at: Timestamp;
}

export interface ChannelPreference {
  channel: DeliveryChannel;
  enabled: boolean;
  priority?: number;
  config?: Record<string, any>;
}

export interface FrequencyPreference {
  mode: 'all' | 'important' | 'minimal' | 'custom';
  limits?: FrequencyConfig;
  batch_digest?: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:MM
  end: string;   // HH:MM
  days: string[];
  allow_urgent?: boolean;
}

export interface CategoryPreference {
  category: NotificationType;
  enabled: boolean;
  channels?: DeliveryChannel[];
  frequency?: 'realtime' | 'daily' | 'weekly';
}

// Analytics
export interface NotificationAnalytics {
  period: { start: Timestamp; end: Timestamp };
  summary: AnalyticsSummary;
  by_type: TypeAnalytics[];
  by_channel: ChannelAnalytics[];
  trends: TrendData[];
  insights: AnalyticsInsight[];
}

export interface AnalyticsSummary {
  total_sent: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  unsubscribe_rate: number;
}

export interface TypeAnalytics {
  type: NotificationType;
  metrics: NotificationMetrics;
  performance: number; // score 0-100
  top_templates: string[];
}

export interface ChannelAnalytics {
  channel: DeliveryChannel;
  metrics: NotificationMetrics;
  cost?: number;
  reliability: number; // percentage
}

export interface TrendData {
  metric: string;
  points: { time: Timestamp; value: number }[];
  change: number; // percentage
  forecast?: number;
}

export interface AnalyticsInsight {
  type: 'opportunity' | 'warning' | 'success';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation?: string;
}

// API Request/Response Types
export interface SendNotificationRequest {
  type: NotificationType;
  priority?: NotificationPriority;
  content: NotificationContent;
  targeting?: Partial<TargetingConfig>;
  delivery?: Partial<DeliveryConfig>;
  template_id?: UUID;
  variables?: Record<string, any>;
  idempotency_key?: string;
}

export interface BulkNotificationRequest {
  notifications: SendNotificationRequest[];
  batch_config?: {
    size?: number;
    delay?: number; // ms between batches
    parallel?: boolean;
  };
}

export interface NotificationResponse {
  notification_id: UUID;
  status: NotificationStatus;
  scheduled_at?: Timestamp;
  estimated_delivery?: Timestamp;
  warnings?: string[];
}

export interface UpdateNotificationRequest {
  content?: Partial<NotificationContent>;
  scheduled_at?: Timestamp;
  priority?: NotificationPriority;
  expires_at?: Timestamp;
}

// Filters
export interface NotificationFilters {
  type?: NotificationType[];
  priority?: NotificationPriority[];
  status?: NotificationStatus[];
  user_id?: UUID;
  campaign_id?: UUID;
  date_range?: { start?: Timestamp; end?: Timestamp };
  has_engagement?: boolean;
  sort_by?: 'created' | 'scheduled' | 'priority' | 'engagement';
  sort_order?: 'asc' | 'desc';
}

// Utility Types
export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface NotificationError {
  code: string;
  message: string;
  details?: any;
  notification_id?: UUID;
  retry_after?: number; // seconds
}

export interface BatchResult<T> {
  succeeded: T[];
  failed: { item: T; error: NotificationError }[];
  total: number;
  success_rate: number;
}

