/**
 * @fileoverview Challenges Core Types - Duolingo-Style Challenges
 * @version 2.0.0
 * SUPER HIGH-PERFORMANCE | SUPER PROFESSIONAL | SUPER LEAN | <550 LINES
 */

import { UUID, Timestamp, CurrencyCode } from '../api/common';

// Core Enums
export type ChallengeType = 'skill_building' | 'performance' | 'consistency' | 'social' | 'innovation' | 'speed' | 'quality' | 'collaborative';
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'legendary';
export type ChallengeStatus = 'draft' | 'upcoming' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
export type ParticipationStatus = 'enrolled' | 'active' | 'completed' | 'failed' | 'quit' | 'disqualified';
export type RewardType = 'xp' | 'badge' | 'title' | 'cosmetic' | 'currency' | 'access' | 'recognition';
export type AssessmentType = 'task' | 'quiz' | 'peer_review' | 'portfolio' | 'demo';

// Core Challenge
export interface Challenge {
  id: UUID;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  status: ChallengeStatus;
  category: string;
  tags: string[];
  objectives: LearningObjective[];
  progression: ProgressionSystem;
  gamification: Gamification;
  social: SocialFeatures;
  timing: ChallengeTiming;
  rewards: Reward[];
  rules: ParticipationRules;
  analytics: AnalyticsSummary;
  created_by: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Learning & Objectives
export interface LearningObjective {
  id: UUID;
  objective: string;
  skill_area: string;
  target_proficiency: number;
  prerequisites?: string[];
  assessment: Assessment;
}

export interface Assessment {
  method: AssessmentType;
  passing_score: number;
  max_attempts: number;
  time_limit?: number; // minutes
}

// Progression System
export interface ProgressionSystem {
  total_levels: number;
  current_level: number;
  xp_system: XpSystem;
  milestones: Milestone[];
  skill_tree?: SkillNode[];
}

export interface XpSystem {
  base_xp: number;
  multipliers: XpMultiplier[];
  level_thresholds: number[];
  decay?: XpDecay;
}

export interface XpMultiplier {
  condition: string;
  multiplier: number;
  cap?: number;
  stacking: boolean;
}

export interface XpDecay {
  enabled: boolean;
  rate: number; // % per day
  grace_period: number; // days
  minimum: number; // %
}

export interface Milestone {
  id: UUID;
  name: string;
  level_required: number;
  objectives: MilestoneObjective[];
  rewards: Reward[];
}

export interface MilestoneObjective {
  description: string;
  target: number;
  current: number;
  metric: string;
}

export interface SkillNode {
  id: UUID;
  name: string;
  level: number;
  prerequisites: UUID[];
  unlocks: UUID[];
  proficiency_levels: number;
}

// Gamification
export interface Gamification {
  points: PointSystem;
  achievements: Achievement[];
  leaderboards: LeaderboardConfig;
  streaks: StreakSystem;
}

export interface PointSystem {
  name: string;
  base_points: number;
  bonus_events: BonusEvent[];
  decay?: PointDecay;
}

export interface BonusEvent {
  name: string;
  trigger: string;
  bonus: number;
  limit?: string;
}

export interface PointDecay {
  rate: number; // % per period
  period: string;
  minimum: number;
}

export interface Achievement {
  id: UUID;
  name: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: Reward;
  shareable: boolean;
}

export interface LeaderboardConfig {
  scopes: ('global' | 'regional' | 'friends' | 'skill')[];
  update_frequency: string;
  reset_period?: string;
  prizes?: Prize[];
}

export interface Prize {
  rank_range: { min: number; max: number };
  reward: Reward;
}

export interface StreakSystem {
  enabled: boolean;
  bonus_multiplier: number;
  grace_period: number; // hours
  milestone_bonuses: { days: number; bonus: number }[];
}

// Social Features
export interface SocialFeatures {
  collaboration: CollaborationConfig;
  mentorship: MentorshipConfig;
  community: CommunityConfig;
}

export interface CollaborationConfig {
  enabled: boolean;
  max_team_size: number;
  tools: ('chat' | 'workspace' | 'video' | 'docs')[];
  team_challenges: boolean;
}

export interface MentorshipConfig {
  enabled: boolean;
  matching: 'skill' | 'personality' | 'goals' | 'availability';
  duration: string;
  tools: string[];
}

export interface CommunityConfig {
  forums: boolean;
  study_groups: boolean;
  peer_review: boolean;
  knowledge_sharing: boolean;
}

// Timing & Rules
export interface ChallengeTiming {
  duration: number; // days
  start_date?: Timestamp;
  end_date?: Timestamp;
  time_commitment: 'light' | 'moderate' | 'intensive';
  flexibility: TimingFlexibility;
}

export interface TimingFlexibility {
  self_paced: boolean;
  extensions_allowed: boolean;
  pause_allowed: boolean;
  async_options: boolean;
}

export interface ParticipationRules {
  eligibility: EligibilityCriteria[];
  max_participants?: number;
  commitment_hours: number; // per week
  behavior_code: string[];
  consequences: ConsequenceLevel[];
}

export interface EligibilityCriteria {
  type: 'skill' | 'prerequisite' | 'location' | 'level';
  requirement: any;
  waivable: boolean;
}

export interface ConsequenceLevel {
  violation: string;
  action: 'warning' | 'restriction' | 'suspension' | 'removal';
  duration?: number; // days
}

// Rewards
export interface Reward {
  id: UUID;
  type: RewardType;
  value: any;
  description: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  expires_at?: Timestamp;
  transferable: boolean;
}

// Analytics
export interface AnalyticsSummary {
  participation_rate: number;
  completion_rate: number;
  avg_satisfaction: number;
  dropout_rate: number;
  skill_improvement: number;
  engagement_score: number;
}

// User Participation
export interface ChallengeParticipation {
  id: UUID;
  user_id: UUID;
  challenge_id: UUID;
  status: ParticipationStatus;
  progress: ParticipantProgress;
  achievements: UUID[]; // Achievement IDs
  social_stats: SocialStats;
  joined_at: Timestamp;
  completed_at?: Timestamp;
}

export interface ParticipantProgress {
  current_level: number;
  total_xp: number;
  completed_milestones: UUID[];
  skill_proficiencies: Map<string, number>;
  streak_days: number;
  time_invested: number; // minutes
}

export interface SocialStats {
  helps_given: number;
  helps_received: number;
  collaborations: number;
  peer_rating: number;
  mentor_sessions: number;
}

// API Request/Response Types
export interface CreateChallengeRequest {
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  category: string;
  objectives: Partial<LearningObjective>[];
  duration: number; // days
  max_participants?: number;
  start_date?: Timestamp;
  tags?: string[];
}

export interface JoinChallengeRequest {
  challenge_id: UUID;
  motivation?: string;
  goals?: string[];
  availability: string;
  preferences?: UserPreference[];
}

export interface UserPreference {
  type: 'skill' | 'style' | 'timezone' | 'communication';
  value: string;
  priority: 'required' | 'preferred' | 'optional';
}

export interface UpdateProgressRequest {
  challenge_id: UUID;
  activity: ActivityUpdate;
  reflections?: string;
  help_needed?: string[];
}

export interface ActivityUpdate {
  completed_tasks: TaskCompletion[];
  time_spent: number; // minutes
  quality_rating: number;
  insights: string[];
  challenges: string[];
}

export interface TaskCompletion {
  task_id: UUID;
  duration: number; // minutes
  score: number;
  difficulty_felt: number;
  notes?: string;
}

// Filter & Search
export interface ChallengeFilters {
  type?: ChallengeType;
  difficulty?: ChallengeDifficulty;
  status?: ChallengeStatus;
  category?: string;
  tags?: string[];
  duration?: { min?: number; max?: number };
  start_date?: { after?: Timestamp; before?: Timestamp };
  has_rewards?: boolean;
  has_social?: boolean;
  sort_by?: 'popularity' | 'start_date' | 'difficulty' | 'rewards';
  sort_order?: 'asc' | 'desc';
}

// Leaderboard & Rankings
export interface LeaderboardEntry {
  rank: number;
  user_id: UUID;
  display_name: string;
  score: number;
  level: number;
  achievements: number;
  streak: number;
  change: number; // rank change
}

export interface ChallengeStats {
  total_participants: number;
  active_users: number;
  avg_progress: number;
  top_performers: LeaderboardEntry[];
  completion_forecast: number;
  engagement_trend: 'rising' | 'stable' | 'falling';
}

// Events & Notifications
export interface ChallengeEvent {
  id: UUID;
  type: 'milestone' | 'achievement' | 'bonus' | 'social' | 'system';
  title: string;
  description: string;
  data: any;
  importance: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Timestamp;
}

export interface NotificationPreferences {
  milestones: boolean;
  achievements: boolean;
  social_interactions: boolean;
  reminders: boolean;
  leaderboard_updates: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
}

// Utility Types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface BatchOperation<T> {
  operation: 'create' | 'update' | 'delete';
  items: T[];
  options?: { validate?: boolean; atomic?: boolean };
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: Timestamp;
}

