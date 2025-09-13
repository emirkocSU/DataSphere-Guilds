/** @fileoverview Core types for Audit Trail. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type AuditActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export interface AuditLogEntry {
  logId: Uuid;
  actorId: Uuid; // User or System ID
  action: AuditActionType;
  resourceType: string; // e.g., 'Task', 'User', 'Payment'
  resourceId: Uuid;
  timestamp: IsoTimestamp;
  details?: Record<string, any>;
  ipAddress?: string;
}
