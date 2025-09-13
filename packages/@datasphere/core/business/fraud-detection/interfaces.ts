
/**
 * @file packages/@datasphere/core/business/fraud-detection/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Real-time Fraud Detection Engine.
 */

import { RiskAnalysisResult, UserRiskProfile } from './types';

/**
 * Defines the contract for a service that detects and prevents fraudulent activity.
 */
export interface IFraudDetectionService {
  /**
   * Analyzes a specific event in real-time to assess its fraud risk.
   * @param eventName - The name of the event to analyze (e.g., 'USER_LOGIN', 'TASK_SUBMISSION').
   * @param eventData - The data associated with the event.
   * @returns A promise that resolves to the risk analysis result, including any automated actions taken.
   */
  analyzeEvent(eventName: string, eventData: Record<string, any>): Promise<RiskAnalysisResult>;

  /**
   * Retrieves the complete risk profile for a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the user's risk profile.
   */
  getUserRiskProfile(userId: string): Promise<UserRiskProfile>;

  /**
   * Manually places a user on a watchlist for heightened monitoring.
   * @param userId - The ID of the user to place on the watchlist.
   * @param reason - The reason for adding the user to the watchlist.
   * @returns A promise that resolves when the action is complete.
   */
  addToWatchlist(userId: string, reason: string): Promise<void>;

  /**
   * Manually triggers a review for a high-risk user or transaction.
   * @param entityId - The ID of the user or transaction to review.
   * @param entityType - The type of the entity ('USER' or 'TRANSACTION').
   * @returns A promise that resolves with the ID of the created review case.
   */
  triggerManualReview(entityId: string, entityType: 'USER' | 'TRANSACTION'): Promise<string>;
}
