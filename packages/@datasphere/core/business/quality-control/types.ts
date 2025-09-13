
/**
 * @file packages/@datasphere/core/business/quality-control/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Quality Control & Moderation Engine.
 */

import { ModerationAction, ModerationFlagType, ModerationQueue, FlagSource } from './constants';

/**
 * Represents a single flag raised against a submission.
 */
export interface ModerationFlag {
  flagId: string;
  flagType: ModerationFlagType;
  source: FlagSource;
  sourceIdentifier: string; // e.g., 'AI_MODEL_XYZ' or inspector's userId
  timestamp: string; // ISO 8601
  confidence?: number; // Confidence score from AI systems (0 to 1)
  details: string; // Human-readable details about the flag
  /** Specific region of the data being flagged, e.g., bounding box coordinates or audio timestamp. */
  targetRegion?: Record<string, any>;
}

/**
 * Defines a policy for how to handle submissions of a certain type.
 */
export interface ModerationPolicy {
  policyId: string;
  name: string;
  /** The type of data this policy applies to (e.g., 'image/jpeg', 'audio/mp3'). */
  targetDataType: string;
  /** A set of rules that automatically trigger flags. */
  automatedRules: Array<{ ruleId: string; condition: string; flagToRaise: ModerationFlagType; }>;
  /** The default queue for submissions that pass automated filtering. */
  defaultQueue: ModerationQueue;
  /** The number of peer reviews required for a decision. */
  requiredPeerReviews: number;
}

/**
 * Represents the complete moderation case for a single data submission.
 */
export interface ModerationCase {
  caseId: string;
  submissionId: string;
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  currentQueue: ModerationQueue;
  assignedPolicyId: string;
  flags: ModerationFlag[];
  reviewHistory: Array<{
    reviewerId: string;
    action: ModerationAction;
    timestamp: string;
    justification?: string;
  }>;
  finalDecision?: {
    action: ModerationAction;
    resolvedAt: string;
    resolvedBy: string;
  };
}

/**
 * The payload for a request to review a submission.
 */
export interface ReviewRequest {
  caseId: string;
  submissionData: any; // The actual data to be reviewed
  policy: ModerationPolicy;
  instructions: string;
}

/**
 * The payload submitted by an inspector after reviewing a case.
 */
export interface ReviewDecision {
  caseId: string;
  inspectorId: string;
  action: ModerationAction;
  /** Flags to add or confirm. */
  flags?: Partial<ModerationFlag>[];
  justification: string;
}
