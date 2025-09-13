/** @fileoverview Event types for Event Schema. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { EventSchema } from './types';

export interface SchemaValidatedEvent {
  eventId: Uuid;
  schema: EventSchema;
  isValid: boolean;
  timestamp: IsoTimestamp;
}
