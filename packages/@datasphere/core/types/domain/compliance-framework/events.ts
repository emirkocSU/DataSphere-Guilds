/** @fileoverview Event types for Compliance Framework. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { CompliancePolicy } from './types';

export interface PolicyEvaluatedEvent {
  eventId: Uuid;
  policy: CompliancePolicy;
  isCompliant: boolean;
  timestamp: IsoTimestamp;
}
