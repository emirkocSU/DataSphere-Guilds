/**
 * @fileoverview Growth Engine & Viral Mechanics Types
 */

export type UserId = string;
export type ReferralId = string;
export type CampaignId = string;
export type ExperimentId = string;
export type FunnelId = string;
export type CohortId = string;
export type ISOTimestamp = string;

export interface ReferralSystem {
  id: ReferralId;
  userId: UserId;
  code: string;
  type: 'user' | 'campaign' | 'influencer';
  status: 'active' | 'paused' | 'expired';
  createdAt: ISOTimestamp;
  expiresAt?: ISOTimestamp;
  rewards: ReferralReward[];
  metrics: ReferralMetrics;
}

export interface ReferralReward {
  id: string;
  type: 'points' | 'discount' | 'credits' | 'premium' | 'cash';
  value: number;
  referrerReward: number;
  refereeReward: number;
  conditions: RewardCondition[];
  claimed: boolean;
  claimedAt?: ISOTimestamp;
}

export interface RewardCondition {
  type: 'signup' | 'purchase' | 'activity' | 'retention';
  value: number;
  timeframe: number;
  description: string;
}

export interface ReferralMetrics {
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  totalRewards: number;
  revenue: number;
  lifetime: number;
}

export interface ViralLoop {
  id: string;
  name: string;
  type: 'invitation' | 'sharing' | 'challenge' | 'achievement';
  trigger: ViralTrigger;
  incentives: ViralIncentive[];
  mechanics: ViralMechanics;
  metrics: ViralMetrics;
  isActive: boolean;
}

export interface ViralTrigger {
  event: string;
  conditions: Record<string, unknown>;
  frequency: 'once' | 'unlimited' | 'limited';
  limit?: number;
}

export interface ViralIncentive {
  type: 'reward' | 'unlock' | 'boost' | 'recognition';
  value: number;
  description: string;
  requirements: string[];
}

export interface ViralMechanics {
  channels: string[];
  message: string;
  cta: string;
  landing: string;
  attribution: AttributionConfig;
}

export interface AttributionConfig {
  window: number;
  model: 'first_touch' | 'last_touch' | 'multi_touch' | 'data_driven';
  weights: Record<string, number>;
}

export interface ViralMetrics {
  shares: number;
  clicks: number;
  conversions: number;
  viralCoefficient: number;
  cycleTime: number;
}

export interface GrowthExperiment {
  id: ExperimentId;
  name: string;
  hypothesis: string;
  type: 'ab_test' | 'multivariate' | 'funnel' | 'cohort';
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: ExperimentVariant[];
  metrics: ExperimentMetrics;
  duration: number;
  targetUsers: number;
  significance: number;
  createdAt: ISOTimestamp;
  startedAt?: ISOTimestamp;
  completedAt?: ISOTimestamp;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  allocation: number;
  config: Record<string, unknown>;
  metrics: VariantMetrics;
  isControl: boolean;
}

export interface VariantMetrics {
  users: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  revenuePerUser: number;
  confidence: number;
  significance: number;
}

export interface ExperimentMetrics {
  totalUsers: number;
  winner?: string;
  lift: number;
  confidence: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface ConversionFunnel {
  id: FunnelId;
  name: string;
  steps: FunnelStep[];
  metrics: FunnelMetrics;
  segments: FunnelSegment[];
  optimization: FunnelOptimization;
}

export interface FunnelStep {
  id: string;
  name: string;
  event: string;
  order: number;
  conditions: Record<string, unknown>;
  optional: boolean;
}

export interface FunnelMetrics {
  totalUsers: number;
  completions: number;
  conversionRate: number;
  dropoffRates: Record<string, number>;
  averageTime: number;
  revenue: number;
}

export interface FunnelSegment {
  id: string;
  name: string;
  criteria: Record<string, unknown>;
  metrics: FunnelMetrics;
}

export interface FunnelOptimization {
  recommendations: Recommendation[];
  experiments: ExperimentId[];
  improvements: number;
  priority: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  type: 'content' | 'flow' | 'timing' | 'targeting';
  description: string;
  impact: number;
  effort: number;
  priority: number;
}

export interface Cohort {
  id: CohortId;
  name: string;
  definition: CohortDefinition;
  users: UserId[];
  metrics: CohortMetrics;
  retention: RetentionData;
  createdAt: ISOTimestamp;
}

export interface CohortDefinition {
  event: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: ISOTimestamp;
  endDate: ISOTimestamp;
  filters: Record<string, unknown>;
}

export interface CohortMetrics {
  size: number;
  retention: Record<string, number>;
  ltv: number;
  revenue: number;
  churn: number;
}

export interface RetentionData {
  periods: RetentionPeriod[];
  curve: number[];
  prediction: number[];
}

export interface RetentionPeriod {
  period: number;
  users: number;
  retained: number;
  rate: number;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  steps: OnboardingStep[];
  metrics: OnboardingMetrics;
  variants: OnboardingVariant[];
  optimization: OnboardingOptimization;
}

export interface OnboardingStep {
  id: string;
  name: string;
  type: 'welcome' | 'profile' | 'tutorial' | 'verification' | 'completion';
  order: number;
  required: boolean;
  content: StepContent;
  tracking: StepTracking;
}

export interface StepContent {
  title: string;
  description: string;
  media?: string;
  cta: string;
  hints: string[];
}

export interface StepTracking {
  views: number;
  completions: number;
  dropoffs: number;
  averageTime: number;
  helpRequests: number;
}

export interface OnboardingMetrics {
  totalUsers: number;
  completions: number;
  completionRate: number;
  averageTime: number;
  dropoffPoints: Record<string, number>;
  activationRate: number;
}

export interface OnboardingVariant {
  id: string;
  name: string;
  steps: OnboardingStep[];
  allocation: number;
  metrics: OnboardingMetrics;
}

export interface OnboardingOptimization {
  bottlenecks: string[];
  improvements: string[];
  experiments: ExperimentId[];
  score: number;
}

export interface RevenueAttribution {
  userId: UserId;
  revenue: number;
  touchpoints: TouchPoint[];
  attribution: AttributionResult;
  timestamp: ISOTimestamp;
}

export interface TouchPoint {
  id: string;
  channel: string;
  campaign: string;
  timestamp: ISOTimestamp;
  value: number;
  type: 'impression' | 'click' | 'conversion';
}

export interface AttributionResult {
  model: string;
  weights: Record<string, number>;
  contribution: Record<string, number>;
  confidence: number;
}

export interface GrowthMetrics {
  userAcquisition: AcquisitionMetrics;
  activation: ActivationMetrics;
  retention: RetentionMetrics;
  revenue: RevenueMetrics;
  referral: ReferralMetrics;
  viral: ViralMetrics;
}