/** @fileoverview Event types for Real-Time Collaboration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { CollaborationSession } from './types';

export interface SessionStartedEvent {
  eventId: Uuid;
  session: CollaborationSession;
  timestamp: IsoTimestamp;
}
