/** @fileoverview Core types for Fraud Detection. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type FraudSignalType = 'IP_MISMATCH' | 'BEHAVIOR_ANOMALY' | 'ACCOUNT_TAKEOVER';

export interface FraudSignal {
  signalId: Uuid;
  userId: Uuid;
  type: FraudSignalType;
  score: number; // 0-1
  timestamp: IsoTimestamp;
  details?: Record<string, any>;
}
