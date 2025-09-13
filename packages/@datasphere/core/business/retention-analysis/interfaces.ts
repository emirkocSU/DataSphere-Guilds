
/**
 * @file packages/@datasphere/core/business/retention-analysis/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Retention & LTV Analytics Engine.
 */

import { CohortRetentionAnalysis, UserRetentionProfile } from './types';
import { CohortInterval } from './constants';

/**
 * Defines the contract for a service that analyzes user retention and predicts churn.
 */
export interface IRetentionAnalysisService {
  /**
   * Retrieves the complete retention profile for a specific user.
   * @param userId - The ID of the user to profile.
   * @returns A promise that resolves to the user's retention profile.
   */
  getUserRetentionProfile(userId: string): Promise<UserRetentionProfile>;

  /**
   * Calculates and retrieves the retention analysis for a specific cohort.
   * @param cohortId - The identifier for the cohort (e.g., '2025-MONTH-07').
   * @param interval - The time interval for the analysis (e.g., WEEKLY).
   * @returns A promise that resolves to the cohort retention analysis.
   */
  getCohortRetention(cohortId: string, interval: CohortInterval): Promise<CohortRetentionAnalysis>;

  /**
   * Identifies users who are at a high risk of churning.
   * @param limit - The maximum number of users to return.
   * @param minLtv - Optional: only return users with a lifetime value greater than this amount.
   * @returns A promise that resolves to a list of high-risk user profiles.
   */
  getHighChurnRiskUsers(limit: number, minLtv?: number): Promise<UserRetentionProfile[]>;

  /**
   * Triggers a proactive intervention for a user at risk of churning.
   * @param userId - The ID of the user.
   * @param interventionType - The type of intervention to apply (e.g., 'SEND_BONUS_OFFER', 'SURVEY_FEEDBACK').
   * @returns A promise that resolves with the status of the intervention.
   */
  triggerIntervention(userId: string, interventionType: string): Promise<{ success: boolean; message: string }>;
}
