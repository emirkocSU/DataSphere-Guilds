/**
 * @fileoverview Types for honeypot and fraud detection mechanisms (Layer 5 of QC).
 * These are tasks designed to catch inattentive or fraudulent workers.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

/** The strategy used to generate a honeypot. */
export type HoneypotStrategy = 'OBVIOUS_ERROR' | 'SUBTLE_INCONSISTENCY' | 'ATTENTION_CHECK';

/** Represents a honeypot task injected into a worker's queue. */
export interface HoneypotTask {
  readonly honeypotId: UUID;
  readonly originalTaskId: UUID;
  readonly strategy: HoneypotStrategy;
  readonly expectedAction: string; // e.g., 'REJECT', 'FLAG_AS_INCORRECT'
  readonly description: string;
}

/** The result of a worker's interaction with a honeypot. */
export interface HoneypotResult {
  readonly resultId: UUID;
  readonly honeypotId: UUID;
  readonly workerId: UUID;
  readonly wasTriggered: boolean; // True if the worker failed the check
  readonly actualAction: string;
  readonly timestamp: ISOTimestamp;
  readonly penaltyApplied?: { type: 'REPUTATION_DECREASE'; amount: number; };
}
