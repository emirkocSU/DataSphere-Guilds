
/**
 * @file packages/@datasphere/core/business/reputation-engine/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Reputation Engine.
 */

import { ReputationDimension, ReputationEvent, ReputationTier } from './constants';

/**
 * Represents a single event that has affected a user's reputation score.
 * A complete history of these events provides full transparency.
 */
export interface ReputationLogEntry {
  logId: string;
  userId: string;
  event: ReputationEvent;
  timestamp: string; // ISO 8601
  /** The change in reputation points resulting from this event (can be positive or negative). */
  pointsChange: number;
  /** The user's new total reputation score after this event. */
  newTotalScore: number;
  /** A human-readable description of the event. */
  description: string;
  /** Optional reference to the entity that caused the event (e.g., taskId, qcJobId). */
  sourceEntityId?: string;
}

/**
 * Represents a user's reputation score broken down by different dimensions.
 */
export interface ReputationScoreBreakdown {
  /** The overall reputation score, typically a weighted average of the dimensions. */
  overallScore: number;
  /** Scores for each core dimension of reputation. */
  dimensionalScores: Partial<Record<ReputationDimension, number>>;
}

/**
 * The complete reputation profile for a user.
 * This is a core object used throughout the platform for decision-making.
 */
export interface UserReputationProfile {
  profileId: string;
  userId: string;
  lastUpdatedAt: string; // ISO 8601
  currentScore: ReputationScoreBreakdown;
  currentTier: ReputationTier;
  /** A summary of the user's performance statistics. */
  statistics: {
    totalTasksCompleted: number;
    acceptanceRate: number; // Percentage of tasks approved by QC
    appealWinRate: number;
    honeypotPassRate: number;
  };
  /** The user's rank on the platform, globally and/or locally. */
  rank?: {
    global: number;
    country?: number;
  };
  /** A flag indicating if the user's reputation is currently under review. */
  isUnderReview: boolean;
}

/**
 * Defines the configuration for how different events affect reputation points.
 * This allows the platform to easily tune the reputation system.
 */
export interface ReputationWeightConfig {
  event: ReputationEvent;
  points: number; // The base points for this event
  /** Optional multipliers that can affect the base points. */
  multipliers?: Array<{
    condition: string; // e.g., 'task_complexity === HIGH'
    multiplier: number;
  }>;
}
