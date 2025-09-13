/** @fileoverview Core types for Real-Time Collaboration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type CollaborationRole = 'VIEWER' | 'EDITOR' | 'OWNER';

export interface CollaborationSession {
  sessionId: Uuid;
  resourceId: Uuid; // e.g., taskId, documentId
  participants: { userId: Uuid; role: CollaborationRole; }[];
  startedAt: IsoTimestamp;
  endedAt?: IsoTimestamp;
}
