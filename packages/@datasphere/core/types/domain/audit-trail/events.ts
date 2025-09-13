/** @fileoverview Event types for Audit Trail. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { AuditLogEntry } from './types';

export interface AuditRecordedEvent {
  eventId: Uuid;
  logEntry: AuditLogEntry;
  timestamp: IsoTimestamp;
}
