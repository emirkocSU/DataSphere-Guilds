/** @fileoverview Core types for User Behavior Analytics. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type UserSegment = 'NEW_USER' | 'ACTIVE_WORKER' | 'HIGH_EARNER';

export interface UserEvent {
  eventId: Uuid;
  userId: Uuid;
  eventType: string; // e.g., 'TASK_VIEWED', 'SUBMISSION_STARTED'
  timestamp: IsoTimestamp;
  properties?: Record<string, any>;
}
