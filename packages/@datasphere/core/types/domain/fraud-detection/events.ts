/** @fileoverview Event types for Fraud Detection. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { FraudSignal } from './types';

export interface FraudDetectedEvent {
  eventId: Uuid;
  signal: FraudSignal;
  timestamp: IsoTimestamp;
}
