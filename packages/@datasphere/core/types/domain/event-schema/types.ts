/** @fileoverview Core types for Event Schema. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type EventSource = 'API' | 'WEBHOOK' | 'INTERNAL_SERVICE';

export interface EventSchema {
  schemaId: Uuid;
  name: string;
  version: string;
  source: EventSource;
  definition: Record<string, any>; // JSON Schema definition
  createdAt: IsoTimestamp;
}
