/** @fileoverview Interfaces for Audit Trail services. */
import { Uuid } from '../../../types/common.types';
import { AuditLogEntry, AuditActionType } from './types';

export interface IAuditTrailService {
  recordAudit(entry: Omit<AuditLogEntry, 'logId' | 'timestamp'>): Promise<AuditLogEntry>;
  getAuditLogs(actorId?: Uuid, action?: AuditActionType, resourceId?: Uuid): Promise<AuditLogEntry[]>;
}
