/** @fileoverview Interfaces for Event Schema services. */
import { Uuid } from '../../../types/common.types';
import { EventSchema, EventSource } from './types';

export interface IEventSchemaService {
  getSchema(schemaId: Uuid): Promise<EventSchema | null>;
  validateEvent(schemaId: Uuid, eventData: Record<string, any>): Promise<boolean>;
  listSchemas(source?: EventSource): Promise<EventSchema[]>;
}
