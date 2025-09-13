
/**
 * @file packages/@datasphere/core/business/skill-verification/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Skill Verification & Certification Engine.
 */

import { SkillCertification, SkillTestAttemptResult, SkillTestDefinition, UserAnswer } from './types';

/**
 * Defines the contract for a service that manages skill tests and certifications.
 */
export interface ISkillVerificationService {
  /**
   * Retrieves the definition for a specific skill test.
   * @param testId - The ID of the skill test.
   * @returns A promise that resolves to the test definition.
   */
  getTestDefinition(testId: string): Promise<SkillTestDefinition>;

  /**
   * Starts a new test attempt for a user.
   * This would typically return the first question and an attempt ID.
   * @param userId - The ID of the user taking the test.
   * @param testId - The ID of the test to start.
   * @returns A promise that resolves to an object containing the session/attempt ID and the first question.
   */
  startTestAttempt(userId: string, testId: string): Promise<{ attemptId: string; firstQuestion: any; }>;

  /**
   * Submits a user's answers for a test attempt and gets the result.
   * @param attemptId - The ID of the test attempt.
   * @param answers - An array of the user's answers.
   * @returns A promise that resolves to the final result of the test attempt.
   */
  submitTestAttempt(attemptId: string, answers: UserAnswer[]): Promise<SkillTestAttemptResult>;

  /**
   * Retrieves a list of all certifications for a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of the user's skill certifications.
   */
  getUserCertifications(userId: string): Promise<SkillCertification[]>;

  /**
   * Checks if a user is certified for a specific skill.
   * @param userId - The ID of the user.
   * @param skillId - The ID of the skill to check.
   * @returns A promise that resolves to true if the user holds an active certification for the skill.
   */
  isUserCertified(userId: string, skillId: string): Promise<boolean>;
}
