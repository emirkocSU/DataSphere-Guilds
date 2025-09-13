/** @fileoverview Types related to business reputation. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export interface ReputationScore {
  userId: Uuid;
  score: number; // 0-1
  lastUpdated: IsoTimestamp;
  history: { timestamp: IsoTimestamp; score: number; }[];
}

export interface ReputationEvent {
  eventId: Uuid;
  userId: Uuid;
  type: 'TASK_APPROVAL' | 'TASK_REJECTION' | 'HONEYPOT_SUCCESS' | 'HONEYPOT_FAILURE';
  scoreChange: number;
  timestamp: IsoTimestamp;
}
