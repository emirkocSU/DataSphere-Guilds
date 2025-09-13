/**
 * @fileoverview Auto Feedback Extended Types - Enterprise AI feedback system
 * @version 2.0.0
 * PRODUCTION READY | SUPER LEAN | SUPER HIGH-PERFORMANCE | <275 LINES
 */

import { UUID, Timestamp } from '../api/common';
import { FeedbackType, FeedbackSource, FeedbackSentiment, UrgencyLevel } from './auto-feedback';

// Extended Tracking & Analytics
export interface EngagementTracking {
  metrics: InteractionMetric[];
  completion: CompletionTracking;
  attention: AttentionIndicator[];
  drop_offs: DropOffPoint[];
}

export interface InteractionMetric {
  name: string;
  unit: string;
  value: number;
  benchmark: number;
  trend: string;
}

export interface CompletionTracking {
  start_time: Timestamp;
  completion_time?: Timestamp;
  checkpoints: ProgressCheckpoint[];
  abandonment_indicators: string[];
}

export interface ProgressCheckpoint {
  name: string;
  completion_pct: number;
  timestamp: Timestamp;
  performance: PerformanceSnapshot;
}

export interface PerformanceSnapshot {
  accuracy: number;
  speed: number;
  engagement: number;
  confidence: number;
  assistance_used: boolean;
}

export interface AttentionIndicator {
  type: 'focus_time' | 'interaction_freq' | 'navigation' | 'response_time';
  value: number;
  level: 'high' | 'medium' | 'low';
  factors: string[];
}

export interface DropOffPoint {
  location: string;
  drop_off_rate: number;
  reasons: string[];
  interventions: string[];
  recovery_rate: number;
}

export interface LearningOutcome {
  type: 'knowledge' | 'skill' | 'behavior' | 'confidence';
  description: string;
  criteria: string;
  achievement_level: number;
  validation_method: string;
}

// Personalization System - Ultra-efficient
export interface FeedbackPersonalization {
  user_adaptation: UserProfileAdaptation;
  contextual: ContextualCustomization;
  learning_path: LearningPathIntegration;
  behavioral: BehavioralAdaptation;
}

export interface UserProfileAdaptation {
  skill_adjusted: boolean;
  experience_based: boolean;
  preference_based: boolean;
  goal_aligned: boolean;
  culturally_sensitive: boolean;
}

export interface ContextualCustomization {
  task_specific: boolean;
  situational_aware: boolean;
  temporally_relevant: boolean;
  environmentally_adapted: boolean;
  workload_considered: boolean;
}

export interface LearningPathIntegration {
  curriculum_aligned: boolean;
  prerequisite_aware: boolean;
  progression_tracked: boolean;
  adaptive_difficulty: boolean;
  mastery_based: boolean;
}

export interface BehavioralAdaptation {
  habit_support: boolean;
  motivation_maintained: boolean;
  resistance_mitigated: boolean;
  engagement_optimized: boolean;
  retention_enhanced: boolean;
}

// Delivery System - Production-optimized
export interface FeedbackDelivery {
  channel: DeliveryChannel;
  timing: TimingOptimization;
  format: FormatAdaptation;
  interaction: InteractionDesign;
  accessibility: AccessibilityFeature[];
}

export interface DeliveryChannel {
  primary: 'in_app' | 'email' | 'push' | 'sms' | 'voice';
  fallbacks: string[];
  selection_logic: ChannelSelectionLogic;
  cross_channel: boolean;
}

export interface ChannelSelectionLogic {
  urgency_based: boolean;
  preference_weighted: boolean;
  context_aware: boolean;
  effectiveness_optimized: boolean;
  availability_checked: boolean;
}

export interface TimingOptimization {
  optimal_prediction: boolean;
  interruption_minimized: boolean;
  cognitive_load_considered: boolean;
  workflow_integrated: boolean;
  availability_detected: boolean;
}

export interface FormatAdaptation {
  device_optimized: boolean;
  attention_adjusted: boolean;
  density_adaptive: boolean;
  multimedia_integrated: boolean;
  progressive_disclosure: boolean;
}

export interface InteractionDesign {
  responses: ResponseMechanism[];
  navigation: NavigationPattern[];
  engagement: EngagementElement[];
  usability: UsabilityOptimization[];
}

export interface ResponseMechanism {
  type: 'quick_response' | 'detailed_feedback' | 'action_confirmation';
  input: 'tap' | 'voice' | 'text' | 'gesture';
  validation_required: boolean;
  response_feedback: boolean;
}

export interface NavigationPattern {
  type: 'linear' | 'branching' | 'exploratory' | 'guided';
  complexity: 'simple' | 'moderate' | 'complex';
  user_control: 'high' | 'medium' | 'low';
  backtracking: boolean;
}

export interface EngagementElement {
  type: 'gamification' | 'social_proof' | 'progress' | 'achievement';
  level: 'subtle' | 'moderate' | 'prominent';
  personalization: 'generic' | 'segmented' | 'individual';
  metrics: string[];
}

export interface UsabilityOptimization {
  type: 'cognitive_load' | 'accessibility' | 'error_prevention' | 'efficiency';
  details: string;
  tested: boolean;
  performance_impact: string;
}

export interface AccessibilityFeature {
  type: 'screen_reader' | 'high_contrast' | 'large_text' | 'voice_nav';
  compliance: string;
  customizable: boolean;
  auto_detection: boolean;
}

// Impact & Analytics - Enterprise-grade
export interface ImpactTracking {
  immediate: ImmediateImpact;
  short_term: ShortTermOutcome[];
  long_term: LongTermEffect[];
  behavioral: BehavioralChange[];
  learning: LearningProgression;
}

export interface ImmediateImpact {
  user_reaction: UserReaction;
  engagement_metrics: EngagementMetrics;
  comprehension: ComprehensionIndicator[];
  action_taken: boolean;
  satisfaction: number;
}

export interface UserReaction {
  emotional: 'positive' | 'neutral' | 'negative';
  cognitive: 'understanding' | 'confusion' | 'insight';
  behavioral: 'acceptance' | 'resistance' | 'curiosity';
  physiological: PhysiologicalIndicator[];
}

export interface PhysiologicalIndicator {
  type: 'eye_tracking' | 'click_patterns' | 'scroll_behavior' | 'dwell_time';
  value: number;
  interpretation: string;
  confidence: number;
}

export interface EngagementMetrics {
  attention_duration: number;
  interaction_frequency: number;
  content_consumption: number;
  exploration_depth: number;
  return_visits: number;
}

export interface ComprehensionIndicator {
  type: 'self_reported' | 'behavioral' | 'performance' | 'question_quality';
  level: number;
  confusion_areas: string[];
  clarity_needs: string[];
}

export interface ShortTermOutcome {
  category: 'performance' | 'skill' | 'behavior' | 'knowledge';
  period: string;
  baseline: number;
  current: number;
  improvement_rate: number;
  sustainability: string[];
}

export interface LongTermEffect {
  type: 'career' | 'earning' | 'mastery' | 'habit' | 'mindset';
  timeline: string;
  attribution_confidence: number;
  evidence: SupportingEvidence[];
  confounders: string[];
}

export interface SupportingEvidence {
  type: 'quantitative' | 'qualitative' | 'observational' | 'third_party';
  strength: number;
  source: string;
  method: string;
}

export interface BehavioralChange {
  type: 'habit_formation' | 'habit_breaking' | 'skill_application' | 'decision_making';
  magnitude: number;
  consistency: number;
  sustainability: number;
  reinforcement: ReinforcementStrategy[];
}

export interface ReinforcementStrategy {
  type: 'positive' | 'negative' | 'environmental' | 'social';
  details: string;
  effectiveness: number;
  acceptance: number;
}

export interface LearningProgression {
  metrics: ProgressionMetric[];
  milestones: MilestoneAchievement[];
  velocity: LearningVelocity;
  retention: KnowledgeRetention;
  transfer: TransferCapability;
}

export interface ProgressionMetric {
  name: string;
  current_level: number;
  target_level: number;
  rate: number;
  time_to_target: string;
  accelerators: string[];
}

export interface MilestoneAchievement {
  name: string;
  date: Timestamp;
  quality: number;
  time_taken: string;
  celebrated: boolean;
}

export interface LearningVelocity {
  concepts_per_week: number;
  skill_acquisition_rate: number;
  application_speed: number;
  retention_efficiency: number;
  velocity_factors: string[];
}

export interface KnowledgeRetention {
  short_term: number;
  long_term: number;
  decay_rate: number;
  forgetting_curve: ForgettingCurveAnalysis;
  strategies: RetentionStrategy[];
}

export interface ForgettingCurveAnalysis {
  initial_strength: number;
  decay_constant: number;
  half_life: number;
  critical_points: number[];
  intervention_effectiveness: number;
}

export interface RetentionStrategy {
  name: string;
  type: 'spaced_repetition' | 'active_recall' | 'elaborative' | 'interleaving';
  effectiveness: number;
  preference: number;
  complexity: string;
}

export interface TransferCapability {
  near_transfer: number;
  far_transfer: number;
  cross_domain: number;
  analogical_reasoning: number;
  facilitators: string[];
}

// Request/Response Types - API-optimized
export interface GenerateFeedbackRequest {
  user_id: UUID;
  context: FeedbackContext;
  feedback_type: FeedbackType;
  urgency_level: UrgencyLevel;
  preferences?: PersonalizationPreferences;
}

export interface FeedbackContext {
  task?: any;
  performance?: any;
  learning?: any;
  behavioral?: any;
  environmental?: any;
}

export interface PersonalizationPreferences {
  communication_style: string;
  detail_level: 'brief' | 'moderate' | 'detailed';
  frequency: string;
  delivery: DeliveryPreferences;
}

export interface DeliveryPreferences {
  channels: string[];
  timing: TimingPreferences;
  format: FormatPreferences;
  interaction: InteractionPreferences;
}

export interface TimingPreferences {
  immediate: boolean;
  scheduled: boolean;
  context_sensitive: boolean;
  do_not_disturb: DoNotDisturbPeriod[];
}

export interface DoNotDisturbPeriod {
  start: string;
  end: string;
  days: string[];
  exceptions: string[];
}

export interface FormatPreferences {
  text: boolean;
  visual: boolean;
  audio: boolean;
  interactive: boolean;
  multimedia: boolean;
}

export interface InteractionPreferences {
  responses: string[];
  engagement: 'minimal' | 'moderate' | 'high';
  gamification: boolean;
  social: boolean;
}

export interface BulkFeedbackRequest {
  requests: GenerateFeedbackRequest[];
  batch_options: BatchProcessingOptions;
  coordination: CoordinationRule[];
}

export interface BatchProcessingOptions {
  parallel: boolean;
  prioritized: boolean;
  optimized: boolean;
  error_handling: 'stop' | 'continue' | 'retry';
}

export interface CoordinationRule {
  type: 'timing' | 'deduplication' | 'channel_optimization' | 'frequency';
  parameters: any;
  priority: number;
  enforcement: 'strict' | 'flexible' | 'advisory';
}

// Filter Parameters - Query-optimized
export interface AutoFeedbackFilterParams {
  user_id?: UUID;
  task_id?: UUID;
  feedback_type?: FeedbackType;
  feedback_source?: FeedbackSource;
  sentiment?: FeedbackSentiment;
  urgency_level?: UrgencyLevel;
  delivered?: boolean;
  acknowledged?: boolean;
  created_after?: Timestamp;
  created_before?: Timestamp;
  effectiveness_min?: number;
  impact_level?: string;
  sort_by?: 'created_at' | 'delivered_at' | 'urgency_level' | 'effectiveness';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}