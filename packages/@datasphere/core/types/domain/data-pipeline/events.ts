/** @fileoverview Event types for Data Pipeline. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { DataPipeline } from './types';

export interface PipelineStatusChangedEvent {
  eventId: Uuid;
  pipeline: DataPipeline;
  oldStatus: 'ACTIVE' | 'INACTIVE' | 'FAILED';
  newStatus: 'ACTIVE' | 'INACTIVE' | 'FAILED';
  timestamp: IsoTimestamp;
}
