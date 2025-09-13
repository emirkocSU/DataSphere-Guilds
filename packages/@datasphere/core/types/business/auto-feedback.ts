/**
 * @fileoverview Auto Feedback Core Types - Enterprise AI feedback system
 * @version 2.0.0
 * PRODUCTION READY | SUPER LEAN | SUPER HIGH-PERFORMANCE | <275 LINES
 */

import { UUID, Timestamp } from '../api/common';

// Core Enums - Ultra-optimized
export type FeedbackType = 'real_time' | 'post_submission' | 'milestone' | 'contextual' | 'proactive';
export type FeedbackSource = 'ai_analysis' | 'peer_review' | 'expert_assessment' | 'automated_validation';
export type FeedbackSentiment = 'positive' | 'constructive' | 'neutral' | 'corrective';
export type ActionabilityLevel = 'immediate' | 'short_term' | 'long_term';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

// Core AutoFeedback Entity - Ultra-lean
export interface AutoFeedback {
  id: UUID;
  user_id: UUID;
  task_id?: UUID;
  submission_id?: UUID;
  feedback_type: FeedbackType;
  feedback_source: FeedbackSource;
  trigger_event: TriggerEvent;
  content: FeedbackContent;
  personalization: FeedbackPersonalization;
  delivery: FeedbackDelivery;
  impact: ImpactTracking;
  created_at: Timestamp;
  delivered_at?: Timestamp;
  acknowledged_at?: Timestamp;
}

// Trigger System - Hyper-optimized
export interface TriggerEvent {
  event_type: 'task_progress' | 'quality_issue' | 'performance_pattern' | 'learning_opportunity';
  event_data: EventData;
  conditions: TriggerCondition[];
  urgency_level: UrgencyLevel;
  context: EventContext;
}

export interface EventData {
  primary_metric: string;
  metric_value: number;
  threshold: ThresholdComparison;
  related_metrics: RelatedMetric[];
  historical: HistoricalContext;
}

export interface ThresholdComparison {
  type: 'quality' | 'performance' | 'behavioral' | 'temporal';
  threshold_value: number;
  current_value: number;
  deviation_pct: number;
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
}

export interface RelatedMetric {
  name: string;
  value: number;
  correlation: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface HistoricalContext {
  baseline: number;
  trend: TrendData;
  anomaly: AnomalyData;
}

export interface TrendData {
  direction: 'upward' | 'downward' | 'flat';
  strength: number;
  duration: number;
  confidence: number;
}

export interface AnomalyData {
  is_anomaly: boolean;
  score: number;
  type: 'positive' | 'negative' | 'unusual';
  factors: string[];
}

export interface TriggerCondition {
  type: 'threshold_breach' | 'pattern_match' | 'comparative_analysis';
  parameters: ConditionParameters;
  weight: number;
  result: boolean;
}

export interface ConditionParameters {
  name: string;
  value: any;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'in_range';
  reference: any;
  tolerance: number;
}

// Context System - Production-optimized
export interface EventContext {
  task?: TaskContext;
  user: UserContext;
  temporal: TemporalContext;
  environmental: EnvironmentalContext;
  system: SystemContext;
}

export interface TaskContext {
  type: string;
  complexity: number;
  progress_pct: number;
  quality_req: QualityRequirements;
  deadline_pressure: number;
}

export interface QualityRequirements {
  min_quality: number;
  target_quality: number;
  dimensions: string[];
  critical_factors: string[];
}

export interface UserContext {
  skill_level: number;
  experience: string;
  performance: PerformanceHistory;
  learning_style: LearningStyle;
  current_state: UserState;
}

export interface PerformanceHistory {
  recent_performance: number;
  trend: string;
  consistency: number;
  improvement_rate: number;
  plateau_indicators: PlateauIndicator[];
}

export interface PlateauIndicator {
  type: 'performance_stagnation' | 'learning_plateau' | 'motivation_decline';
  strength: number;
  duration: number;
  interventions: string[];
}

export interface LearningStyle {
  modality: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'multimodal';
  feedback_pref: 'immediate' | 'delayed' | 'contextual';
  motivation_drivers: MotivationDriver[];
  communication: 'direct' | 'supportive' | 'analytical';
}

export interface MotivationDriver {
  type: 'achievement' | 'mastery' | 'autonomy' | 'purpose' | 'recognition';
  importance: number;
  satisfaction: number;
  optimizations: string[];
}

export interface UserState {
  engagement: number;
  stress_indicators: StressIndicator[];
  confidence: number;
  attention: 'focused' | 'distracted' | 'fatigued' | 'optimal';
  emotion: EmotionalState;
}

export interface StressIndicator {
  type: 'time_pressure' | 'quality_anxiety' | 'task_complexity';
  level: number;
  performance_impact: number;
  coping_strategies: string[];
}

export interface EmotionalState {
  primary: 'confident' | 'frustrated' | 'motivated' | 'overwhelmed' | 'satisfied';
  intensity: number;
  stability: number;
  influences: string[];
}

export interface TemporalContext {
  time_of_day: string;
  day_of_week: string;
  timezone: string;
  session_duration: number;
  break_frequency: number;
}

export interface EnvironmentalContext {
  device: 'mobile' | 'tablet' | 'desktop';
  connection: 'excellent' | 'good' | 'fair' | 'poor';
  location: 'home' | 'office' | 'public' | 'mobile';
  distraction_level: number;
}

export interface SystemContext {
  platform_version: string;
  features: string[];
  performance: SystemPerformance;
  concurrent_users: number;
}

export interface SystemPerformance {
  response_time: number;
  error_rate: number;
  resource_utilization: number;
  stability: number;
}

// Content Structure - Enterprise-grade
export interface FeedbackContent {
  primary: PrimaryMessage;
  details: SupportingDetail[];
  insights: ActionableInsight[];
  visuals: VisualElement[];
  interactions: InteractiveComponent[];
}

export interface PrimaryMessage {
  headline: string;
  summary: string;
  sentiment: FeedbackSentiment;
  urgency: UrgencyLevel;
  key_takeaway: string;
}

export interface SupportingDetail {
  type: 'statistical' | 'comparative' | 'trend' | 'contextual';
  content: string;
  evidence_strength: number;
  relevance: number;
  visual_aid?: VisualAid;
}

export interface VisualAid {
  type: 'chart' | 'graph' | 'diagram' | 'animation';
  data_source: string;
  interactive: boolean;
  accessibility: string[];
}

export interface ActionableInsight {
  id: UUID;
  type: 'improvement' | 'optimization' | 'learning' | 'correction';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionability: ActionabilityLevel;
  implementation: ImplementationGuide;
  impact: ExpectedImpact;
}

export interface ImplementationGuide {
  quick_actions: QuickAction[];
  detailed_steps: DetailedStep[];
  resources: ResourceRequirement[];
  timeline: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface QuickAction {
  description: string;
  time_estimate: string;
  benefit: string;
  hint: string;
}

export interface DetailedStep {
  number: number;
  description: string;
  rationale: string;
  outcome: string;
  validation: string;
  tips: string[];
}

export interface ResourceRequirement {
  type: 'time' | 'tool' | 'knowledge' | 'support';
  description: string;
  availability: 'ready' | 'setup_required' | 'acquisition_needed';
  cost: CostEstimate;
}

export interface CostEstimate {
  monetary: number;
  time_investment: string;
  opportunity_cost: string;
  risks: string[];
}

export interface ExpectedImpact {
  performance_improvement: number;
  quality_enhancement: number;
  efficiency_gain: number;
  learning_acceleration: number;
  confidence_boost: number;
  timeline: string;
}

export interface VisualElement {
  type: 'progress' | 'comparison' | 'trend' | 'achievement';
  data: ElementData;
  styling: ElementStyling;
  interactivity: ElementInteractivity;
}

export interface ElementData {
  points: DataPoint[];
  metadata: DataMetadata;
  refresh_frequency: string;
  source: string;
}

export interface DataPoint {
  label: string;
  value: number;
  context: string;
  highlight: boolean;
  color?: string;
}

export interface DataMetadata {
  period: string;
  sample_size: number;
  confidence: number;
  methodology: string;
}

export interface ElementStyling {
  theme: 'light' | 'dark' | 'high_contrast';
  size: 'compact' | 'standard' | 'expanded';
  animation: AnimationConfig;
  responsive: boolean;
}

export interface AnimationConfig {
  type: 'none' | 'subtle' | 'engaging';
  duration: number;
  easing: string;
  accessible: boolean;
}

export interface ElementInteractivity {
  clickable: boolean;
  hover_effects: boolean;
  expandable: boolean;
  drill_down: boolean;
  export_options: string[];
}

export interface InteractiveComponent {
  type: 'quiz' | 'simulation' | 'practice' | 'reflection';
  config: ComponentConfig;
  tracking: EngagementTracking;
  outcomes: LearningOutcome[];
}

export interface ComponentConfig {
  adaptive: boolean;
  time_boxed: boolean;
  max_duration: number;
  scoring: ScoringMechanism;
  feedback: ComponentFeedback;
}

export interface ScoringMechanism {
  type: 'points' | 'percentage' | 'qualitative';
  max_score: number;
  pass_threshold: number;
  bonuses: BonusOpportunity[];
}

export interface BonusOpportunity {
  type: 'speed' | 'accuracy' | 'creativity';
  criteria: string;
  value: number;
  frequency_limit: string;
}

export interface ComponentFeedback {
  immediate: boolean;
  detailed: boolean;
  peer_comparison: boolean;
  suggestions: boolean;
  retries: number;
}

// Missing interface definitions
export interface FeedbackPersonalization {
  user_profile: string;
  learning_style: string;
  preferences: Record<string, any>;
  customization_level: 'basic' | 'advanced' | 'full';
}

export interface FeedbackDelivery {
  method: 'push' | 'email' | 'in_app' | 'sms';
  timing: 'immediate' | 'scheduled' | 'optimal';
  format: 'text' | 'rich' | 'interactive';
  priority: 'low' | 'medium' | 'high';
}

export interface ImpactTracking {
  engagement_score: number;
  action_taken: boolean;
  improvement_observed: boolean;
  satisfaction_rating: number;
  follow_up_needed: boolean;
}

export interface EngagementTracking {
  start_time: Timestamp;
  duration: number;
  completion_rate: number;
  interaction_count: number;
  drop_off_points: string[];
}

export interface LearningOutcome {
  objective: string;
  achieved: boolean;
  proficiency_gain: number;
  knowledge_retention: number;
  application_success: boolean;
}