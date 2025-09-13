/** @fileoverview Interfaces for Real-Time Collaboration services. */
import { Uuid } from '../../../types/common.types';
import { CollaborationSession } from './types';

export interface ICollaborationService {
  startSession(resourceId: Uuid, userId: Uuid): Promise<CollaborationSession>;
  joinSession(sessionId: Uuid, userId: Uuid): Promise<CollaborationSession>;
  leaveSession(sessionId: Uuid, userId: Uuid): Promise<void>;
  getParticipants(sessionId: Uuid): Promise<{ userId: Uuid; role: CollaborationRole; }[]>;
}
