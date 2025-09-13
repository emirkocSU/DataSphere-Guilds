/**
 * @file packages/@datasphere/core/business/ab-testing/types.ts
 * @version 2.1.0
 * @description Defines the core data structures for the A/B Testing & Experimentation Engine,
 *              now including real-time dashboard support.
 */

import { ExperimentLayer, ExperimentStatus, GoalMetricType, StatisticalTest } from './constants';

/**
 * Represents a single variation within an experiment (e.g., 'Control', 'Variation A').
 */
export interface ExperimentVariation {
  variationId: string; // e.g., 'control', 'new_signup_flow'
  name: string; // Human-readable name
  trafficSplit: number; // e.g., 0.5 for 50%
}

/**
 * Defines the primary goal metric for an experiment.
 */
export interface ExperimentGoal {
  goalId: string;
  name: string;
  metricType: GoalMetricType;
  successEvent: string; // e.g., 'User Signed Up', 'Purchase Completed'
}

/**
 * The complete definition of an A/B testing experiment.
 */
export interface ExperimentDefinition {
  experimentId: string;
  name: string;
  hypothesis: string; // e.g., "We believe that changing the signup button to green will increase conversion by 10%."
  status: ExperimentStatus;
  layer: ExperimentLayer;
  targetAudienceId: string;
  variations: ExperimentVariation[];
  primaryGoal: ExperimentGoal;
  secondaryGoals?: ExperimentGoal[];
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
}

/**
 * Represents the analysis result for a single variation at the end of an experiment.
 */
export interface VariationResult {
  variationId: string;
  userCount: number;
  conversionCount: number;
  conversionRate: number;
  improvement?: number;
  chanceToWin?: number;
  isStatisticallySignificant: boolean;
}

/**
 * The complete, final analysis result for a concluded experiment.
 */
export interface ExperimentAnalysisResult {
  analysisId: string;
  experimentId: string;
  generatedAt: string; // ISO 8601
  statisticalTestUsed: StatisticalTest;
  confidenceLevel: number; // e.g., 0.95
  resultsByVariation: Record<string, VariationResult>;
  winner?: string;
  summary: string; // A human-readable summary of the outcome.
}

// --- REAL-TIME DASHBOARD TYPES ---

/**
 * Represents a single data point in a time series analysis.
 */
export interface TimeSeriesDataPoint {
  timestamp: string; // ISO 8601, typically representing an hour or a day
  value: number;
}

/**
 * Represents the live, up-to-the-minute metrics for a single variation.
 */
export interface LiveVariationMetrics {
  variationId: string;
  userCount: number;
  conversionCount: number;
  currentConversionRate: number;
  /** A time series of the conversion rate, to visualize trends. */
  conversionRateOverTime: TimeSeriesDataPoint[];
}

/**
 * The data structure that powers the real-time experiment dashboard.
 */
export interface LiveExperimentDashboard {
  experimentId: string;
  lastUpdatedAt: string; // ISO 8601
  status: ExperimentStatus;
  timeElapsedMinutes: number;
  /** Live metrics for each variation in the experiment. */
  liveMetricsByVariation: Record<string, LiveVariationMetrics>;
  /** The current probability for each variation to be the winner. */
  chanceToWinByVariation: Record<string, number>;
  /** A real-time check for statistical significance. */
  isSignificant: boolean;
  /** An estimated time remaining until the experiment reaches significance. */
  estimatedTimeToSignificanceHours?: number;
  /** Any alerts or warnings about the experiment's health. */
  healthAlerts: Array<{ alertType: 'LOW_CONVERSION' | 'HIGH_ERROR_RATE'; message: string; }>;
}