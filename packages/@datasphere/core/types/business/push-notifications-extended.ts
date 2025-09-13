/**
 * @fileoverview Push Notifications Extended Types - Advanced Features
 * @version 2.0.0
 * SUPER LEAN | PRODUCTION READY | SPLIT FOR OPTIMIZATION
 */

import { UUID, Timestamp } from '../api/common';
import { 
  NotificationType, 
  NotificationPriority, 
  DeliveryChannel,
  NotificationContent,
  TargetingCondition 
} from './push-notifications';

// Rich Content Extensions
export interface RichNotificationContent extends NotificationContent {
  interactive?: InteractiveContent;
  layout?: LayoutConfig;
  styling?: StylingConfig;
}

export interface InteractiveContent {
  type: 'form' | 'survey' | 'poll' | 'game';
  elements: InteractiveElement[];
  submit_action: string;
  validation?: ValidationRule[];
}

export interface InteractiveElement {
  id: string;
  type: 'input' | 'select' | 'button' | 'slider';
  label: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface LayoutConfig {
  template: 'standard' | 'hero' | 'carousel' | 'grid';
  sections: LayoutSection[];
  responsive?: boolean;
}

export interface LayoutSection {
  type: 'header' | 'body' | 'media' | 'actions' | 'footer';
  content: any;
  style?: Record<string, any>;
}

export interface StylingConfig {
  theme: 'light' | 'dark' | 'auto' | 'custom';
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  animations?: boolean;
}

// Advanced Targeting
export interface SmartTargeting {
  ml_segments?: MLSegment[];
  predictive_filters?: PredictiveFilter[];
  real_time_context?: RealTimeContext[];
  cross_channel_state?: CrossChannelState;
}

export interface MLSegment {
  model_id: string;
  segment_name: string;
  confidence_threshold: number;
  features_used: string[];
  performance: number;
}

export interface PredictiveFilter {
  metric: 'engagement' | 'conversion' | 'churn' | 'ltv';
  operator: 'likely' | 'unlikely' | 'above' | 'below';
  threshold: number;
  lookback_days: number;
}

export interface RealTimeContext {
  type: 'location' | 'activity' | 'device' | 'environment';
  conditions: Record<string, any>;
  weight?: number;
}

export interface CrossChannelState {
  require_no_recent_contact?: number; // hours
  coordinate_with_campaigns?: string[];
  respect_journey_stage?: boolean;
}

// A/B Testing
export interface NotificationExperiment {
  id: UUID;
  name: string;
  hypothesis: string;
  variants: ExperimentVariant[];
  audience_split: AudienceSplit;
  metrics: ExperimentMetric[];
  status: 'draft' | 'running' | 'completed' | 'aborted';
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  changes: VariantChange[];
  allocation: number; // percentage
  min_sample_size: number;
}

export interface VariantChange {
  type: 'content' | 'timing' | 'channel' | 'personalization';
  field: string;
  value: any;
}

export interface AudienceSplit {
  method: 'random' | 'deterministic' | 'stratified';
  seed?: string;
  stratification_fields?: string[];
}

export interface ExperimentMetric {
  name: string;
  type: 'primary' | 'secondary' | 'guardrail';
  calculation: string;
  success_criteria: number;
  minimum_detectable_effect: number;
}

export interface ExperimentResults {
  winner?: string;
  confidence_level: number;
  metrics_results: MetricResult[];
  recommendation: string;
}

export interface MetricResult {
  metric: string;
  control_value: number;
  variant_values: { [variant: string]: number };
  statistical_significance: number;
  confidence_interval: [number, number];
}

// Machine Learning Integration
export interface MLOptimization {
  send_time_optimization?: SendTimeOptimization;
  content_optimization?: ContentOptimization;
  channel_optimization?: ChannelOptimization;
  frequency_optimization?: FrequencyOptimization;
}

export interface SendTimeOptimization {
  enabled: boolean;
  model_version: string;
  features: string[];
  override_timezone?: boolean;
  fallback_time?: string;
}

export interface ContentOptimization {
  personalize_subject?: boolean;
  personalize_body?: boolean;
  tone_adaptation?: boolean;
  length_optimization?: boolean;
  emoji_optimization?: boolean;
}

export interface ChannelOptimization {
  auto_select_channel?: boolean;
  multi_channel_orchestration?: boolean;
  cost_consideration?: boolean;
  reliability_threshold?: number;
}

export interface FrequencyOptimization {
  adaptive_capping?: boolean;
  engagement_based?: boolean;
  fatigue_prevention?: boolean;
  surge_protection?: boolean;
}

// Compliance & Privacy
export interface ComplianceConfig {
  gdpr?: GDPRConfig;
  ccpa?: CCPAConfig;
  consent_management?: ConsentConfig;
  data_retention?: DataRetentionConfig;
}

export interface GDPRConfig {
  require_explicit_consent: boolean;
  right_to_erasure: boolean;
  data_portability: boolean;
  purpose_limitation: string[];
}

export interface CCPAConfig {
  honor_do_not_sell: boolean;
  provide_opt_out: boolean;
  disclosure_required: boolean;
}

export interface ConsentConfig {
  require_double_opt_in?: boolean;
  consent_expiry_days?: number;
  granular_preferences?: boolean;
  audit_trail?: boolean;
}

export interface DataRetentionConfig {
  notification_days: number;
  analytics_days: number;
  user_data_days: number;
  auto_delete: boolean;
}

// Performance Monitoring
export interface PerformanceMonitoring {
  sla_monitoring?: SLAConfig;
  error_tracking?: ErrorTrackingConfig;
  cost_tracking?: CostTrackingConfig;
  quality_metrics?: QualityMetricsConfig;
}

export interface SLAConfig {
  delivery_time_sla: number; // seconds
  availability_target: number; // percentage
  alert_thresholds: AlertThreshold[];
}

export interface AlertThreshold {
  metric: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notification_channels: string[];
}

export interface ErrorTrackingConfig {
  track_delivery_errors: boolean;
  track_rendering_errors: boolean;
  error_sampling_rate: number;
  error_grouping: string[];
}

export interface CostTrackingConfig {
  track_per_channel: boolean;
  cost_per_thousand: { [channel: string]: number };
  budget_alerts: BudgetAlert[];
}

export interface BudgetAlert {
  threshold: number;
  period: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
}

export interface QualityMetricsConfig {
  spam_score_threshold: number;
  accessibility_check: boolean;
  content_quality_score: boolean;
  link_validation: boolean;
}

// Workflow Automation
export interface NotificationWorkflow {
  id: UUID;
  name: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  exit_conditions: ExitCondition[];
  performance: WorkflowPerformance;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'api' | 'condition';
  config: Record<string, any>;
  filters?: TargetingCondition[];
}

export interface WorkflowStep {
  id: string;
  type: 'notification' | 'delay' | 'condition' | 'action';
  config: Record<string, any>;
  next_steps: NextStep[];
}

export interface NextStep {
  step_id: string;
  condition?: string;
  probability?: number;
}

export interface ExitCondition {
  type: 'goal' | 'timeout' | 'user_action' | 'error';
  config: Record<string, any>;
}

export interface WorkflowPerformance {
  total_entries: number;
  completion_rate: number;
  avg_duration: number; // minutes
  conversion_rate: number;
}

// Integration Types
export interface NotificationIntegration {
  id: UUID;
  type: 'crm' | 'analytics' | 'cdp' | 'marketing';
  provider: string;
  config: IntegrationConfig;
  sync_settings: SyncSettings;
  field_mappings: FieldMapping[];
}

export interface IntegrationConfig {
  api_key?: string;
  endpoint?: string;
  auth_type: 'api_key' | 'oauth' | 'basic';
  custom_headers?: Record<string, string>;
}

export interface SyncSettings {
  sync_events: boolean;
  sync_user_data: boolean;
  sync_frequency: 'realtime' | 'batch';
  batch_size?: number;
}

export interface FieldMapping {
  source_field: string;
  target_field: string;
  transformation?: string;
  required?: boolean;
}

// Admin Tools
export interface NotificationAudit {
  id: UUID;
  action: 'created' | 'updated' | 'sent' | 'cancelled';
  actor: string;
  timestamp: Timestamp;
  changes?: AuditChange[];
  reason?: string;
}

export interface AuditChange {
  field: string;
  old_value: any;
  new_value: any;
}

export interface AdminDashboard {
  overview: DashboardOverview;
  alerts: DashboardAlert[];
  trends: DashboardTrend[];
  recommendations: DashboardRecommendation[];
}

export interface DashboardOverview {
  total_sent_today: number;
  delivery_rate: number;
  engagement_rate: number;
  active_campaigns: number;
  system_health: 'healthy' | 'degraded' | 'critical';
}

export interface DashboardAlert {
  type: 'performance' | 'error' | 'compliance' | 'budget';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Timestamp;
  action_required?: string;
}

export interface DashboardTrend {
  metric: string;
  current_value: number;
  previous_value: number;
  change_percentage: number;
  trend_direction: 'up' | 'down' | 'stable';
}

export interface DashboardRecommendation {
  category: string;
  recommendation: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimated_improvement: number;
}

// Helper Functions
export const calculateEngagementScore = (
  metrics: any
): number => {
  const weights = {
    open_rate: 0.3,
    click_rate: 0.4,
    conversion_rate: 0.3
  };
  
  return Object.entries(weights).reduce((score, [key, weight]) => {
    return score + (metrics[key] || 0) * weight;
  }, 0);
};

export const shouldSendNotification = (
  user_prefs: any,
  notification: any
): boolean => {
  // Simplified logic for demonstration
  if (!user_prefs.channels.some((c: any) => c.enabled)) return false;
  if (user_prefs.quiet_hours?.enabled) {
    // Check quiet hours logic
  }
  return true;
};

export const optimizeDeliveryTime = (
  user_behavior: any,
  timezone: string
): Date => {
  // Simplified optimization logic
  const optimalHour = user_behavior.most_active_hour || 10;
  const date = new Date();
  date.setHours(optimalHour);
  return date;
};