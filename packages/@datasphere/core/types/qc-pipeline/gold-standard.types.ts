/**
 * @fileoverview Types for gold standard and calibration tasks (Layer 4 of QC).
 * These are tasks with a known, correct answer used to benchmark quality.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

/** Represents a task with a known, correct "ground truth" answer. */
export interface GoldStandardTask {
  readonly taskId: UUID;
  readonly groundTruth: Record<string, any>;
  readonly tolerance: number; // Allowed deviation from the ground truth, 0-1
  readonly version: number;
  readonly domain: string;
}

/** The result of a worker's submission against a gold standard task. */
export interface GoldStandardResult {
  readonly resultId: UUID;
  readonly submissionId: UUID;
  readonly workerId: UUID;
  readonly isMatch: boolean;
  readonly deviationScore: number; // 0-1, how far off the submission was
  readonly feedback: string;
}
