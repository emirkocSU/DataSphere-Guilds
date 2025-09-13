
/**
 * @file packages/@datasphere/core/business/skill-verification/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Skill Verification & Certification Engine.
 */

import { CertificationStatus, SkillTestDifficulty, SkillTestQuestionType, SkillTestStatus } from './constants';

/**
 * Represents a single question within a skill test.
 */
export interface SkillTestQuestion {
  questionId: string;
  questionType: SkillTestQuestionType;
  difficulty: SkillTestDifficulty;
  text: string;
  /** Data for the question, e.g., image URL for a practical task, or options for multiple choice. */
  data: Record<string, any>; // e.g., { options: ['A', 'B', 'C'], imageUrl: '...' }
}

/**
 * Represents the complete definition of a skill test.
 */
export interface SkillTestDefinition {
  testId: string;
  /** The skill being tested, e.g., 'image-annotation-bounding-box'. */
  skillId: string;
  name: string;
  description: string;
  difficulty: SkillTestDifficulty;
  questions: SkillTestQuestion[];
  /** The minimum score required to pass the test (e.g., 0.8 for 80%). */
  passingScore: number;
  /** The time limit for the test in minutes. */
  timeLimitMinutes: number;
  /** The number of days a user must wait before retaking a failed test. */
  cooldownPeriodDays: number;
}

/**
 * Represents a user's attempt to answer a single question.
 */
export interface UserAnswer {
  questionId: string;
  /** The answer provided by the user. The structure depends on the question type. */
  answer: any; // e.g., ['A'] for multiple choice, { boundingBoxes: [...] } for practical
}

/**
 * Represents the result of a user's completed skill test attempt.
 */
export interface SkillTestAttemptResult {
  attemptId: string;
  testId: string;
  userId: string;
  startedAt: string; // ISO 8601
  completedAt: string; // ISO 8601
  status: SkillTestStatus;
  score: number; // The final score, from 0 to 1
  wasPassed: boolean;
  /** Detailed feedback on each answer, if applicable. */
  feedback?: Array<{ questionId: string; isCorrect: boolean; explanation: string; }>;
}

/**
 * Represents a certification awarded to a user for passing a skill test.
 * This is a valuable asset on the user's profile.
 */
export interface SkillCertification {
  certificationId: string;
  userId: string;
  skillId: string;
  testId: string;
  status: CertificationStatus;
  issuedAt: string; // ISO 8601
  expiresAt?: string; // ISO 8601, for skills that require periodic re-certification
  certifiedBy: string; // e.g., 'DataSphere Automated System', 'Expert Reviewer ID'
}
