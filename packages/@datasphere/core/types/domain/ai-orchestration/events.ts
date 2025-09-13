/** @fileoverview Event types for AI Orchestration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export interface ModelRetrainedEvent {
  eventId: Uuid;
  modelId: Uuid;
  newVersion: string;
  oldAccuracy: number;
  newAccuracy: number;
  timestamp: IsoTimestamp;
}
