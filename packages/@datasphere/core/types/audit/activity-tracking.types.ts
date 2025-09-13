/** @fileoverview Types for tracking user activity. */
import { Uuid, IsoTimestamp } from '../common.types';

export interface UserActivity {
  readonly activityId: Uuid;
  readonly userId: Uuid;
  readonly sessionId: Uuid;
  readonly action: string; // e.g., 'VIEW_DASHBOARD', 'SUBMIT_TASK'
  readonly timestamp: IsoTimestamp;
  readonly metadata?: Record<string, any>;
}

export interface SessionHistory {
  readonly sessionId: Uuid;
  readonly userId: Uuid;
  readonly startedAt: IsoTimestamp;
  readonly endedAt: IsoTimestamp;
  readonly userAgent: string;
  readonly ipAddress: string;
}
