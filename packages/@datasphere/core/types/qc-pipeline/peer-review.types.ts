/**
 * @fileoverview Types for the peer review network (Layer 3 of QC).
 * These types govern how human inspectors review submissions.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

/** The decision made by a peer reviewer. */
export type PeerReviewDecision = 'APPROVE' | 'REJECT' | 'NEEDS_WORK' | 'ESCALATE';

/** Represents a single peer review on a submission. */
export interface PeerReview {
  readonly reviewId: UUID;
  readonly submissionId: UUID;
  readonly reviewerId: UUID;
  readonly decision: PeerReviewDecision;
  readonly justification: string;
  readonly reviewTimeMs: number;
  readonly createdAt: ISOTimestamp;
  readonly criteriaScores: Record<string, number>; // e.g., { accuracy: 5, completeness: 4 }
}

/** Defines the consensus algorithm for multiple reviews. */
export interface ConsensusAlgorithm {
  readonly strategy: 'MAJORITY_VOTE' | 'WEIGHTED_AVERAGE' | 'EXPERT_OVERRIDE';
  readonly minReviews: number;
  readonly maxReviews: number;
  readonly agreementThreshold: number; // 0-1, required agreement between reviewers
}
