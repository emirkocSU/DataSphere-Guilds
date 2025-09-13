
import { z } from 'zod';

/**
 * Schema for reputation calculation rules.
 */
const ReputationRulesSchema = z.object({
  /** Points awarded for a successfully completed task. */
  taskSuccessPoints: z.number().positive(),
  /** Points deducted for a rejected task. */
  taskRejectionPenalty: z.number().positive(),
  /** Weight of peer review agreement in the reputation score. */
  peerReviewAgreementWeight: z.number().min(0).max(1),
});

/**
 * Schema for task assignment logic.
 */
const TaskAssignmentRulesSchema = z.object({
  /** Minimum reputation required to become an inspector. */
  minReputationForInspector: z.number().min(0).max(1),
  /** The number of peer reviewers to assign to a single task. */
  reviewersPerTask: z.number().int().min(1).max(5),
  /** The maximum number of active tasks a user can have at one time. */
  maxActiveTasks: z.number().int().positive(),
});

/**
 * Main schema for the business rules configuration file.
 */
export const BusinessRulesConfigSchema = z.object({
  reputation: ReputationRulesSchema,
  taskAssignment: TaskAssignmentRulesSchema,
});

export type BusinessRulesConfig = z.infer<typeof BusinessRulesConfigSchema>;

/**
 * Default business rules configuration.
 * These values provide a baseline for the platform's core logic.
 */
export const defaultBusinessRulesConfig: BusinessRulesConfig = {
  reputation: {
    taskSuccessPoints: 0.01,
    taskRejectionPenalty: 0.02,
    peerReviewAgreementWeight: 0.5,
  },
  taskAssignment: {
    minReputationForInspector: 0.9,
    reviewersPerTask: 2,
    maxActiveTasks: 5,
  },
};
