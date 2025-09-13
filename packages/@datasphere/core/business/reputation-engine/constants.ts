
/**
 * @file packages/@datasphere/core/business/reputation-engine/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Reputation Engine.
 */

/**
 * Defines the types of events that can trigger a reputation score update.
 */
export enum ReputationEvent {
  TASK_COMPLETED_SUCCESSFULLY = 'TASK_COMPLETED_SUCCESSFULLY',
  TASK_REJECTED_BY_QC = 'TASK_REJECTED_BY_QC',
  APPEAL_WON = 'APPEAL_WON',
  APPEAL_LOST = 'APPEAL_LOST',
  HONEYPOT_TASK_PASSED = 'HONEYPOT_TASK_PASSED',
  HONEYPOT_TASK_FAILED = 'HONEYPOT_TASK_FAILED',
  SKILL_CERTIFICATION_PASSED = 'SKILL_CERTIFICATION_PASSED',
  PEER_REVIEW_AGREEMENT = 'PEER_REVIEW_AGREEMENT', // When an inspector's review matches the consensus
  PEER_REVIEW_DISAGREEMENT = 'PEER_REVIEW_DISAGREEMENT',
  REPUTATION_DECAY = 'REPUTATION_DECAY', // For inactivity
}

/**
 * Defines the different tiers or levels a user can achieve based on their reputation.
 */
export enum ReputationTier {
  NEWBIE = 'NEWBIE', // 0-100
  ROOKIE = 'ROOKIE', // 101-300
  REGULAR = 'REGULAR', // 301-700
  VETERAN = 'VETERAN', // 701-900
  ELITE = 'ELITE', // 901-980
  LEGEND = 'LEGEND', // 981-1000
}

/**
 * Defines the core dimensions of a user's reputation.
 */
export enum ReputationDimension {
  /** The quality and accuracy of submitted work. */
  QUALITY = 'QUALITY',
  /** The speed and efficiency of task completion. */
  SPEED = 'SPEED',
  /** The reliability and consistency of the user. */
  RELIABILITY = 'RELIABILITY',
  /** The user's expertise in specific domains. */
  DOMAIN_EXPERTISE = 'DOMAIN_EXPERTISE',
}
