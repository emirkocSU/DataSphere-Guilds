/** @fileoverview Types for real-time security monitoring. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type SecurityEventSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type SecurityEventType = 'LOGIN_ATTEMPT' | 'DATA_ACCESS' | 'ANOMALY_DETECTED';

export interface SecurityEvent {
  readonly eventId: Uuid;
  readonly type: SecurityEventType;
  readonly userId?: Uuid;
  readonly ipAddress: string;
  readonly timestamp: IsoTimestamp;
  readonly severity: SecurityEventSeverity;
  readonly details?: Record<string, any>;
}

export interface Threat {
  readonly threatId: Uuid;
  readonly type: 'MALWARE' | 'PHISHING' | 'DDOS' | 'INSIDER';
  readonly description: string;
  readonly severity: SecurityEventSeverity;
  readonly detectedAt: IsoTimestamp;
  readonly status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
}
