
/**
 * @file packages/@datasphere/core/business/quality-control/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Quality Control & Moderation Engine.
 */

import { ModerationCase, ReviewDecision, ReviewRequest } from './types';

/**
 * Defines the contract for a service that orchestrates the quality control and moderation process.
 */
export interface IQualityControlService {
  /**
   * Submits a new piece of data for quality control and moderation.
   * This will create a new ModerationCase and route it to the appropriate initial queue.
   * @param submissionId - A unique identifier for the data submission.
   * @param submissionData - The data to be reviewed.
   * @param dataType - The MIME type or a custom type of the data.
   * @returns A promise that resolves to the newly created moderation case.
   */
  createModerationCase(submissionId: string, submissionData: any, dataType: string): Promise<ModerationCase>;

  /**
   * Fetches the next available review request for a qualified inspector.
   * The service handles routing from different queues based on inspector qualifications.
   * @param inspectorId - The ID of the inspector requesting a job.
   * @returns A promise that resolves to a review request, or null if no suitable case is available.
   */
  fetchNextReviewJob(inspectorId: string): Promise<ReviewRequest | null>;

  /**
   * Submits a decision from an inspector for a specific moderation case.
   * The service will process the decision, update the case, and determine the next step
   * (e.g., resolve the case, or seek more reviews).
   * @param decision - The decision payload from the inspector.
   * @returns A promise that resolves to the updated moderation case.
   */
  submitReviewDecision(decision: ReviewDecision): Promise<ModerationCase>;

  /**
   * Retrieves the current state of a specific moderation case.
   * @param caseId - The ID of the moderation case.
   * @returns A promise that resolves to the moderation case data.
   */
  getCaseStatus(caseId: string): Promise<ModerationCase>;
}
