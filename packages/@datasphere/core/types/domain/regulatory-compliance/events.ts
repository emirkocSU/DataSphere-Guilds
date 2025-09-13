/** @fileoverview Event types for Regulatory Compliance. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { Regulation } from './types';

export interface ComplianceEvaluatedEvent {
  eventId: Uuid;
  regulation: Regulation;
  isCompliant: boolean;
  timestamp: IsoTimestamp;
}
