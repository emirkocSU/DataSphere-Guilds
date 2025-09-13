
/**
 * @file packages/@datasphere/core/business/skill-verification/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Skill Verification & Certification Engine.
 */

/**
 * Defines the different types of questions that can be used in a skill test.
 */
export enum SkillTestQuestionType {
  /** A question with a single correct answer from a list of options. */
  MULTIPLE_CHOICE_SINGLE_ANSWER = 'MULTIPLE_CHOICE_SINGLE_ANSWER',
  /** A question with multiple correct answers from a list of options. */
  MULTIPLE_CHOICE_MULTIPLE_ANSWERS = 'MULTIPLE_CHOICE_MULTIPLE_ANSWERS',
  /** A practical test where the user must perform a task, e.g., label a sample image. */
  PRACTICAL_TASK = 'PRACTICAL_TASK',
  /** A question requiring a free-text answer, often graded by AI. */
  FREE_TEXT = 'FREE_TEXT',
}

/**
 * Defines the difficulty level of a skill test or a specific question.
 */
export enum SkillTestDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

/**
 * The final status of a completed skill test attempt.
 */
export enum SkillTestStatus {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  PENDING_MANUAL_REVIEW = 'PENDING_MANUAL_REVIEW', // For tests requiring expert review
}

/**
 * The status of a skill certification for a user.
 */
export enum CertificationStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED', // Revoked due to poor performance
}
