/**
 * @file packages/@datasphere/core/business/dispute-resolution/interfaces.ts
 * @version 2.1.0
 * @description Defines the advanced service contract for the Dispute Resolution Engine.
 */

import { DisputeCase, DisputeResolution, ResolutionRule, CaseEvidence, FairnessReport } from './types';
import { DisputeType, EvidenceType } from './constants';

/**
 * Defines the contract for a service that manages and resolves disputes with advanced capabilities.
 */
export interface IDisputeResolutionService {
  /**
   * Initiates a new dispute case.
   * @param initiatorId - The ID of the user opening the dispute.
   * @param disputeType - The type of the dispute.
   * @param sourceEntityId - The ID of the task, payment, etc., being disputed.
   * @param userStatement - An initial statement from the user.
   * @returns A promise that resolves to the newly created dispute case.
   */
  openCase(initiatorId: string, disputeType: DisputeType, sourceEntityId: string, userStatement: string): Promise<DisputeCase>;

  /**
   * Retrieves the current status and details of a dispute case.
   * @param caseId - The ID of the dispute case.
   * @returns A promise that resolves to the dispute case data.
   */
  getCase(caseId: string): Promise<DisputeCase>;

  /**
   * Adds a new piece of evidence to an open case.
   * @param caseId - The ID of the dispute case.
   * @param evidenceType - The type of evidence being added.
   * @param evidenceData - The data for the evidence, e.g., { url: '... ', text: '...' }.
   * @returns A promise that resolves to the added CaseEvidence object.
   */
  addEvidence(caseId: string, evidenceType: EvidenceType, evidenceData: Record<string, any>): Promise<CaseEvidence>;

  /**
   * Triggers the automated resolution process for a case.
   * The service will check for fast-track eligibility before applying the standard ruleset.
   * @param caseId - The ID of the case to process.
   * @returns A promise that resolves to the case status after the attempt (e.g., RESOLVED or ESCALATED).
   */
  processAutomatedResolution(caseId: string): Promise<DisputeCase>;

  /**
   * Allows a human arbitrator to submit a final resolution for an escalated case.
   * @param caseId - The ID of the escalated case.
   * @param arbitratorId - The ID of the human arbitrator.
   * @param decision - The final decision.
   * @param justification - The reasoning for the decision.
   * @returns A promise that resolves to the final dispute resolution.
   */
  resolveEscalatedCase(caseId: string, arbitratorId: string, decision: 'FAVOR_INITIATOR' | 'FAVOR_RESPONDENT', justification: string): Promise<DisputeResolution>;

  /**
   * Generates a shareable, public report for a resolved case to promote platform fairness.
   * @param caseId - The ID of the resolved case.
   * @returns A promise that resolves to the FairnessReport object.
   */
  generateFairnessReport(caseId: string): Promise<FairnessReport>;

  /**
   * Updates the ruleset used by the automated resolution engine.
   * @param rules - An array of resolution rules.
   * @returns A promise that resolves when the ruleset is successfully updated.
   */
  updateResolutionRules(rules: ResolutionRule[]): Promise<void>;
}