
/**
 * @file packages/@datasphere/core/business/reputation-engine/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Reputation Engine.
 */

import { ReputationEvent } from './constants';
import { ReputationLogEntry, UserReputationProfile, ReputationWeightConfig } from './types';

/**
 * Defines the contract for a service that manages user reputation.
 */
export interface IReputationService {
  /**
   * Retrieves the complete reputation profile for a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the user's reputation profile.
   */
  getUserReputation(userId: string): Promise<UserReputationProfile>;

  /**
   * Applies a reputation-affecting event to a user's profile.
   * This is the primary method for updating a user's score.
   * @param userId - The ID of the user to update.
   * @param event - The type of event that occurred.
   * @param eventContext - Additional context about the event (e.g., task complexity, payout amount).
   * @returns A promise that resolves to the newly created reputation log entry.
   */
  applyEvent(userId: string, event: ReputationEvent, eventContext: Record<string, any>): Promise<ReputationLogEntry>;

  /**
   * Retrieves the detailed history of reputation changes for a user.
   * @param userId - The ID of the user.
   * @param limit - The number of log entries to return.
   * @param offset - The offset for pagination.
   * @returns A promise that resolves to a list of reputation log entries.
   */
  getReputationHistory(userId: string, limit: number, offset: number): Promise<ReputationLogEntry[]>;

  /**
   * Recalculates a user's entire reputation score from their event history.
   * Useful for applying new weighting rules or correcting discrepancies.
   * @param userId - The ID of the user to recalculate.
   * @returns A promise that resolves to the updated reputation profile.
   */
  recalculateReputation(userId: string): Promise<UserReputationProfile>;

  /**
   * Updates the reputation weighting configuration for the entire system.
   * @param config - An array of reputation weight configurations.
   * @returns A promise that resolves when the configuration is successfully updated.
   */
  updateWeightConfiguration(config: ReputationWeightConfig[]): Promise<void>;
}
