/** @fileoverview Event types for Task Taxonomy. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export interface TaskTypeCreatedEvent {
  eventId: Uuid;
  taskTypeId: Uuid;
  name: string;
  timestamp: IsoTimestamp;
}
