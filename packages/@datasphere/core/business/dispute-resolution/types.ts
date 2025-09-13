/**
 * @file packages/@datasphere/core/business/dispute-resolution/types.ts
 * @version 2.1.0
 * @description Defines the advanced core data structures for the Dispute Resolution Engine,
 *              incorporating social proof, reputation fast-tracking, and viral mechanisms.
 */

import {
  DisputeStatus,
  DisputeType,
  EvidenceType,
  ResolutionMethod,
  DisputeOutcome,
  ResolutionActionType
} from './constants';

/**
 * Represents a piece of evidence collected for a dispute case.
 * Now supports structured content for different evidence types.
 */
export interface CaseEvidence {
  evidenceId: string;
  evidenceType: EvidenceType;
  timestamp: string; // ISO 8601
  source: string; // e.g., 'QC_SERVICE', 'USER_UPLOAD', 'SOCIAL_MEDIA_API'
  content: Record<string, any>; // e.g., { url: '...', text: '...' } for SOCIAL_MEDIA_POST
  analysis?: {
    summary: string;
    relevanceScore: number; // 0 to 1
    isVerified: boolean; // e.g., if a social media post is verified to belong to the user
  };
}

/**
 * Represents a single rule in a ruleset for automated resolution.
 * The condition can now check for reputation to enable fast-tracking.
 */
export interface ResolutionRule {
  ruleId: string;
  description: string;
  condition: string; // e.g., "user.reputation_tier === 'ELITE' && dispute.value < 5.00"
  outcome: DisputeOutcome | 'ESCALATE';
  resolutionMethod: ResolutionMethod;
}

/**
 * Represents a single, executable action resulting from a dispute resolution.
 */
export interface ResolutionAction {
  actionType: ResolutionActionType;
  payload: Record<string, any>; // e.g., { submissionId: '...', reputationChange: -50 }
}

/**
 * Represents the final resolution of a dispute case.
 */
export interface DisputeResolution {
  resolutionId: string;
  caseId: string;
  resolvedAt: string; // ISO 8601
  method: ResolutionMethod;
  finalOutcome: DisputeOutcome;
  justification: string;
  actions: ResolutionAction[];
}

/**
 * The complete data structure for a single dispute case, with added metadata.
 */
export interface DisputeCase {
  caseId: string;
  disputeType: DisputeType;
  status: DisputeStatus;
  initiatorId: string;
  respondentId: string;
  sourceEntityId: string;
  openedAt: string; // ISO 8601
  resolvedAt?: string; // ISO 8601
  evidencePackage: CaseEvidence[];
  resolution?: DisputeResolution;
  metadata: {
    isFastTrackEligible: boolean;
    disputedValue: number;
    currency: string;
  };
}

/**
 * The core of the viral mechanism: a shareable, anonymized report on a resolved case.
 * Designed to be embedded or shared on social media to build trust.
 */
export interface FairnessReport {
  reportId: string;
  caseId: string;
  shareableUrl: string;
  generatedAt: string; // ISO 8601
  anonymizedSummary: {
    title: string; // e.g., "A Dispute Regarding Task Quality Was Resolved Fairly"
    situation: string; // e.g., "A worker's submission was initially rejected by a quality check."
    dispute: string; // e.g., "The worker believed the rejection was incorrect and opened a dispute."
    resolution: string; // e.g., "After automated analysis of the evidence, the system overturned the rejection."
    outcome: string; // e.g., "Outcome: Worker's appeal was successful."
  };
  visuals: {
    headerImageUrl: string;
    outcomeIcon: 'check-circle' | 'x-circle';
  };
}