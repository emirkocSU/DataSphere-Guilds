
/**
 * @file packages/@datasphere/core/business/quality-control/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Quality Control & Moderation Engine.
 */

/**
 * Defines the types of flags that can be raised against a data submission.
 * These can be raised by AI or human inspectors.
 */
export enum ModerationFlagType {
  // General Quality Flags
  LOW_QUALITY = 'LOW_QUALITY', // e.g., blurry image, noisy audio
  INCOMPLETE_DATA = 'INCOMPLETE_DATA',
  INCORRECT_FORMAT = 'INCORRECT_FORMAT',

  // Content Safety Flags
  PII_DETECTED = 'PII_DETECTED', // Personally Identifiable Information
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',

  // Accuracy Flags
  INACCURATE_LABEL = 'INACCURATE_LABEL',
  INCONSISTENT_WITH_INSTRUCTIONS = 'INCONSISTENT_WITH_INSTRUCTIONS',
}

/**
 * Defines the actions that can be taken on a submission under review.
 */
export enum ModerationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_REWORK = 'REQUEST_REWORK', // Ask the original worker to fix specific issues
  ESCALATE_TO_EXPERT = 'ESCALATE_TO_EXPERT',
  AUTO_FIX = 'AUTO_FIX', // AI automatically fixes a minor issue
}

/**
 * Defines the different queues a submission can be in during the QC process.
 */
export enum ModerationQueue {
  /** Initial automated screening by AI. */
  AUTOMATED_FILTERING = 'AUTOMATED_FILTERING',
  /** Standard review by peer inspectors. */
  PEER_REVIEW = 'PEER_REVIEW',
  /** Review for submissions with sensitive content flags. */
  SENSITIVE_CONTENT_REVIEW = 'SENSITIVE_CONTENT_REVIEW',
  /** Review by domain experts for complex or escalated cases. */
  EXPERT_ARBITRATION = 'EXPERT_ARBITRATION',
}

/**
 * The source that raised a moderation flag.
 */
export enum FlagSource {
  AI_SYSTEM = 'AI_SYSTEM',
  PEER_INSPECTOR = 'PEER_INSPECTOR',
  EXPERT_INSPECTOR = 'EXPERT_INSPECTOR',
  SYSTEM_RULE = 'SYSTEM_RULE',
}
