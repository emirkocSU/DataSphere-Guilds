/** @fileoverview Types for the core audit log entries. */
import { Uuid, IsoTimestamp } from '../common.types';

export type AuditEventType = 'USER_LOGIN' | 'TASK_CREATED' | 'PAYMENT_PROCESSED' | 'SECURITY_ALERT';

export interface AuditEvent {
  readonly eventId: Uuid;
  readonly timestamp: IsoTimestamp;
  readonly eventType: AuditEventType;
  readonly actor: { type: 'USER' | 'SYSTEM'; id: string; };
  readonly resource: { type: string; id: string; };
  readonly outcome: 'SUCCESS' | 'FAILURE';
  readonly details: Record<string, any>;
  readonly ipAddress: string;
}
