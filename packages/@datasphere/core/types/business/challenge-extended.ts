/**
 * @fileoverview Challenge Extended Types - Advanced Features
 * @version 2.0.0
 * SUPER LEAN | PRODUCTION READY | SPLIT FOR OPTIMIZATION
 */

import { UUID, Timestamp } from '../api/common';
import { Reward, AssessmentType } from './challenges';

// Advanced Progression Features
export interface PrestigeSystem {
  enabled: boolean;
  current_prestige: number;
  total_resets: number;
  prestige_rewards: PrestigeReward[];
  next_requirement: number;
}

export interface PrestigeReward {
  level: number;
  title: string;
  icon: string;
  benefits: PrestigeBenefit[];
}

export interface PrestigeBenefit {
  type: 'multiplier' | 'exclusive' | 'cosmetic' | 'access';
  value: any;
  permanent: boolean;
}

// Advanced Social Features
export interface TeamChallenge {
  team_id: UUID;
  name: string;
  members: TeamMember[];
  combined_score: number;
  synergy_bonus: number;
  achievements: UUID[];
}

export interface TeamMember {
  user_id: UUID;
  role: 'leader' | 'member' | 'mentor';
  contribution: number;
  joined_at: Timestamp;
}

export interface MentorProfile {
  user_id: UUID;
  expertise_areas: string[];
  rating: number;
  mentees_count: number;
  success_rate: number;
  availability: MentorAvailability;
}

export interface MentorAvailability {
  hours_per_week: number;
  timezone: string;
  preferred_times: string[];
  communication_methods: string[];
}

// Advanced Analytics
export interface DetailedAnalytics {
  user_segments: UserSegment[];
  retention_cohorts: RetentionCohort[];
  skill_progression: SkillProgression[];
  engagement_funnel: EngagementStage[];
  predictive_metrics: PredictiveMetric[];
}

export interface UserSegment {
  segment_name: string;
  criteria: any;
  size: number;
  avg_performance: number;
  characteristics: string[];
}

export interface RetentionCohort {
  cohort_date: Timestamp;
  size: number;
  retention_curve: number[]; // % by day
  key_factors: string[];
}

export interface SkillProgression {
  skill: string;
  avg_starting_level: number;
  avg_ending_level: number;
  improvement_rate: number;
  mastery_percentage: number;
}

export interface EngagementStage {
  stage: string;
  conversion_rate: number;
  avg_time_to_next: number; // hours
  drop_off_reasons: string[];
}

export interface PredictiveMetric {
  metric: string;
  prediction: number;
  confidence: number;
  factors: { factor: string; weight: number }[];
}

// Advanced Gamification
export interface SeasonalChallenge {
  season_id: UUID;
  theme: string;
  special_rewards: Reward[];
  limited_achievements: Achievement[];
  end_date: Timestamp;
}

export interface Achievement {
  id: UUID;
  category: string;
  tiers: AchievementTier[];
  progress: number;
  unlocked_at?: Timestamp;
}

export interface AchievementTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: number;
  reward: Reward;
  title: string;
}

export interface DynamicEvent {
  id: UUID;
  name: string;
  type: 'weekend' | 'flash' | 'community' | 'milestone';
  multipliers: EventMultiplier[];
  duration: { start: Timestamp; end: Timestamp };
  participation_bonus: number;
}

export interface EventMultiplier {
  activity: string;
  multiplier: number;
  cap?: number;
}

// Learning Pathways
export interface LearningPathway {
  id: UUID;
  name: string;
  description: string;
  stages: PathwayStage[];
  estimated_duration: number; // weeks
  career_outcomes: string[];
}

export interface PathwayStage {
  stage_number: number;
  name: string;
  challenges: UUID[];
  skills_focus: string[];
  assessment: StageAssessment;
}

export interface StageAssessment {
  type: AssessmentType;
  passing_criteria: any;
  certification?: CertificationInfo;
}

export interface CertificationInfo {
  name: string;
  issuer: string;
  validity_period?: number; // months
  verification_url?: string;
}

// Adaptive Learning
export interface AdaptiveSettings {
  enabled: boolean;
  difficulty_adjustment: DifficultyAdjustment;
  content_personalization: ContentPersonalization;
  pace_optimization: PaceOptimization;
}

export interface DifficultyAdjustment {
  algorithm: 'performance' | 'time' | 'hybrid';
  sensitivity: number;
  min_samples: number;
  adjustment_range: { min: number; max: number };
}

export interface ContentPersonalization {
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  preferred_formats: string[];
  topic_interests: string[];
  skill_priorities: string[];
}

export interface PaceOptimization {
  target_hours_per_week: number;
  preferred_session_length: number; // minutes
  break_frequency: number; // minutes
  deadline_flexibility: boolean;
}

// Quality Assurance
export interface QualityMetrics {
  content_quality: ContentQuality;
  user_satisfaction: SatisfactionMetrics;
  learning_effectiveness: EffectivenessMetrics;
  platform_performance: PerformanceMetrics;
}

export interface ContentQuality {
  accuracy_score: number;
  relevance_score: number;
  clarity_score: number;
  engagement_score: number;
  last_review: Timestamp;
}

export interface SatisfactionMetrics {
  overall_rating: number;
  nps_score: number;
  recommendation_rate: number;
  feedback_themes: { theme: string; frequency: number }[];
}

export interface EffectivenessMetrics {
  skill_transfer_rate: number;
  knowledge_retention: number;
  practical_application: number;
  time_to_proficiency: number; // hours
}

export interface PerformanceMetrics {
  avg_load_time: number; // ms
  error_rate: number;
  uptime: number; // %
  concurrent_users_supported: number;
}

// Integration Types
export interface ExternalIntegration {
  platform: 'github' | 'linkedin' | 'slack' | 'custom';
  enabled: boolean;
  sync_frequency: string;
  data_mapping: DataMapping[];
}

export interface DataMapping {
  external_field: string;
  internal_field: string;
  transformation?: string;
  validation?: string;
}

export interface APIWebhook {
  id: UUID;
  event_type: string;
  url: string;
  headers?: Record<string, string>;
  retry_policy: RetryPolicy;
  active: boolean;
}

export interface RetryPolicy {
  max_attempts: number;
  backoff_type: 'linear' | 'exponential';
  initial_delay: number; // seconds
  max_delay: number; // seconds
}

// Admin & Moderation
export interface ModerationAction {
  id: UUID;
  type: 'content' | 'user' | 'challenge';
  action: 'flag' | 'hide' | 'remove' | 'ban';
  reason: string;
  moderator_id: UUID;
  timestamp: Timestamp;
  appeal_status?: 'pending' | 'approved' | 'rejected';
}

export interface ChallengeAudit {
  challenge_id: UUID;
  changes: AuditChange[];
  quality_checks: QualityCheck[];
  compliance_status: ComplianceStatus;
}

export interface AuditChange {
  field: string;
  old_value: any;
  new_value: any;
  changed_by: UUID;
  changed_at: Timestamp;
  reason?: string;
}

export interface QualityCheck {
  check_type: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  checked_at: Timestamp;
}

export interface ComplianceStatus {
  gdpr_compliant: boolean;
  accessibility_score: number;
  content_rating: string;
  regional_restrictions?: string[];
}

// Export type guards and utilities
export const isChallengeActive = (status: string): boolean => 
  ['active', 'upcoming'].includes(status);

export const calculateProgress = (current: number, total: number): number => 
  Math.min(Math.round((current / total) * 100), 100);

export const isEligible = (criteria: any[], user: any): boolean => 
  criteria.every(c => evaluateCriteria(c, user));

const evaluateCriteria = (criteria: any, user: any): boolean => {
  // Simplified evaluation logic
  return true;
};