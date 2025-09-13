
/**
 * @file packages/@datasphere/core/business/viral-metrics/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contracts (interfaces) for the Growth and Viral Analytics module.
 */

import { Cohort, KFactorSnapshot, Referral, ViralLoopAnalytics } from './types';
import { ViralAnalyticsEvent } from './events';

/**
 * Defines the contract for a service that calculates and retrieves growth metrics.
 */
export interface IViralAnalyticsService {
  /**
   * Calculates the K-factor for a given time period.
   * @param period - The time period to calculate for (e.g., 'WEEKLY').
   * @returns A promise that resolves to the K-factor snapshot.
   */
  getKFactor(period: 'DAILY' | 'WEEKLY' | 'MONTHLY'): Promise<KFactorSnapshot>;

  /**
   * Retrieves cohort analysis data for user retention.
   * @param cohortId - The identifier of the cohort to analyze.
   * @returns A promise that resolves to the cohort data.
   */
  getCohort(cohortId: string): Promise<Cohort>;

  /**
   * Analyzes the performance of a specific viral loop.
   * @param loopName - The name of the viral loop.
   * @returns A promise that resolves to the loop's analytics.
   */
  getViralLoopAnalytics(loopName: string): Promise<ViralLoopAnalytics>;

  /**
   * Tracks a specific viral event.
   * @param event - The analytics event to track.
   */
  trackEvent(event: ViralAnalyticsEvent): Promise<void>;
}

/**
 * Defines the contract for a service that manages growth hacking operations.
 */
export interface IGrowthHackingService {
  /**
   * Generates a unique referral code for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the unique referral code.
   */
  generateReferralCode(userId: string): Promise<string>;

  /**
   * Creates and sends referral invitations.
   * @param referrerId - The ID of the user sending the invites.
   * @param recipients - A list of recipient identifiers (e.g., emails).
   * @returns A promise that resolves to a list of created Referral objects.
   */
  sendReferrals(referrerId: string, recipients: string[]): Promise<Referral[]>;

  /**
   * Processes a successful referral and applies rewards.
   * @param referralCode - The referral code used by the new user.
   * @param newUserId - The ID of the new user who signed up.
   * @returns A promise that resolves when the rewards have been successfully applied.
   */
  applyReferral(referralCode: string, newUserId: string): Promise<void>;
}
