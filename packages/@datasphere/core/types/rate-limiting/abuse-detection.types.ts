/** @fileoverview Types for detecting and flagging abusive behavior. */
import { Uuid } from '../common.types';

export interface AbusePattern {
  readonly patternId: Uuid;
  readonly description: string;
  readonly signature: Record<string, any>; // e.g., { ipFrequency: 100, requestPattern: '/auth/login' }
}

export interface SuspiciousActivityReport {
  readonly reportId: Uuid;
  readonly sourceIp: string;
  readonly userId?: Uuid;
  readonly matchedPatterns: AbusePattern[];
  readonly riskScore: number;
  readonly actionTaken: 'NONE' | 'FLAGGED' | 'TEMP_BLOCKED' | 'PERMA_BLOCKED';
}
