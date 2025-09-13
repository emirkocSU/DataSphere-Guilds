/**
 * @file packages/@datasphere/core/business/dispute-resolution/constants.ts
 * @version 2.1.0
 * @description Contains all enumerations and constant values for the Advanced Dispute Resolution Engine.
 *              This version includes reputation-based fast-tracking and social proof mechanisms.
 */

/**
 * Defines the subject of the dispute.
 */
export enum DisputeType {
  QC_REJECTION = 'QC_REJECTION',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  HONEYPOT_FAILURE = 'HONEYPOT_FAILURE',
  REPUTATION_PENALTY = 'REPUTATION_PENALTY',
  TASK_CANCELLATION = 'TASK_CANCELLATION',
}

/**
 * The lifecycle status of a dispute case.
 */
export enum DisputeStatus {
  OPENED = 'OPENED',
  GATHERING_EVIDENCE = 'GATHERING_EVIDENCE',
  PENDING_AUTOMATED_RESOLUTION = 'PENDING_AUTOMATED_RESOLUTION',
  ESCALATED_TO_HUMAN_REVIEW = 'ESCALATED_TO_HUMAN_REVIEW',
  RESOLVED = 'RESOLVED',
  WITHDRAWN = 'WITHDRAWN',
}

/**
 * Defines how a dispute was resolved, now including reputation-based methods.
 */
export enum ResolutionMethod {
  /** Resolved automatically by the standard rules engine. */
  AUTOMATED_RULE_ENGINE = 'AUTOMATED_RULE_ENGINE',
  /** Resolved instantly in favor of a high-reputation user for a low-risk issue. */
  REPUTATION_FAST_TRACK = 'REPUTATION_FAST_TRACK',
  /** Resolved by a human arbitrator after escalation. */
  HUMAN_ARBITRATOR = 'HUMAN_ARBITRATOR',
  /** Resolved as a goodwill gesture, e.g., for a new user's first minor issue. */
  AUTOMATIC_GOODWILL = 'AUTOMATIC_GOODWILL',
}

/**
 * Defines the types of evidence that can be attached to a dispute case, now including social media.
 */
export enum EvidenceType {
  ORIGINAL_SUBMISSION_DATA = 'ORIGINAL_SUBMISSION_DATA',
  QC_REVIEW_LOG = 'QC_REVIEW_LOG',
  AI_VALIDATION_REPORT = 'AI_VALIDATION_REPORT',
  USER_REPUTATION_SNAPSHOT = 'USER_REPUTATION_SNAPSHOT',
  COMMUNICATION_LOGS = 'COMMUNICATION_LOGS',
  USER_PROVIDED_STATEMENT = 'USER_PROVIDED_STATEMENT',
  /** Publicly available social media posts used as contextual evidence. */
  SOCIAL_MEDIA_POST = 'SOCIAL_MEDIA_POST',
}

/**
 * Defines the possible outcomes of a dispute resolution.
 */
export enum DisputeOutcome {
  FAVOR_INITIATOR = 'FAVOR_INITIATOR',
  FAVOR_RESPONDENT = 'FAVOR_RESPONDENT',
  COMPROMISE = 'COMPROMISE',
  DISMISSED = 'DISMISSED',
}

/**
 * Defines the types of actions to be executed upon resolution.
 */
export enum ResolutionActionType {
  REVERSE_QC_REJECTION = 'REVERSE_QC_REJECTION',
  ISSUE_REFUND = 'ISSUE_REFUND',
  ADJUST_REPUTATION = 'ADJUST_REPUTATION',
  GENERATE_FAIRNESS_REPORT = 'GENERATE_FAIRNESS_REPORT',
  NO_ACTION = 'NO_ACTION',
}