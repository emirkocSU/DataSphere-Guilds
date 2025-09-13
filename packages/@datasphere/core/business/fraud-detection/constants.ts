
/**
 * @file packages/@datasphere/core/business/fraud-detection/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Real-time Fraud Detection Engine.
 */

/**
 * Defines the types of potentially fraudulent activities the system monitors.
 */
export enum FraudSignalType {
  // Account-level signals
  MULTIPLE_ACCOUNTS_SAME_DEVICE = 'MULTIPLE_ACCOUNTS_SAME_DEVICE',
  ACCOUNT_TAKEOVER_SUSPICION = 'ACCOUNT_TAKEOVER_SUSPICION', // e.g., sudden change in location/IP
  RAPID_PROFILE_CHANGES = 'RAPID_PROFILE_CHANGES',

  // Submission-level signals
  BOT_LIKE_SUBMISSION_SPEED = 'BOT_LIKE_SUBMISSION_SPEED',
  PLAGIARISM_OR_DUPLICATE_DATA = 'PLAGIARISM_OR_DUPLICATE_DATA',
  LOW_QUALITY_SUBMISSION_SPIKE = 'LOW_QUALITY_SUBMISSION_SPIKE',

  // Collusion signals
  INSPECTOR_WORKER_COLLUSION = 'INSPECTOR_WORKER_COLLUSION', // Inspector consistently approves a specific worker
  TASK_FARMING_PATTERN = 'TASK_FARMING_PATTERN', // Group of users working in a coordinated, unnatural way

  // Payment signals
  UNUSUAL_PAYOUT_BEHAVIOR = 'UNUSUAL_PAYOUT_BEHAVIOR',
}

/**
 * The risk level assigned to a user, transaction, or event.
 */
export enum RiskLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  SEVERE = 'SEVERE',
}

/**
 * The automated action taken by the system in response to a high-risk score.
 */
export enum AutomatedAction {
  /** Require additional verification like 2FA or CAPTCHA. */
  REQUIRE_STEP_UP_AUTH = 'REQUIRE_STEP_UP_AUTH',
  /** Temporarily freeze the user's account pending review. */
  TEMPORARILY_FREEZE_ACCOUNT = 'TEMPORARILY_FREEZE_ACCOUNT',
  /** Block a specific transaction or submission. */
  BLOCK_TRANSACTION = 'BLOCK_TRANSACTION',
  /** Flag the user and their recent activity for manual review. */
  FLAG_FOR_MANUAL_REVIEW = 'FLAG_FOR_MANUAL_REVIEW',
  /** Reduce the user's access level or permissions. */
  REDUCE_PERMISSIONS = 'REDUCE_PERMISSIONS',
}
