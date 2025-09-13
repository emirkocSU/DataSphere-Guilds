/** @fileoverview Event types for Security Policies. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { SecurityPolicy } from './types';

export interface PolicyEnforcedEvent {
  eventId: Uuid;
  policy: SecurityPolicy;
  outcome: 'SUCCESS' | 'FAILURE';
  timestamp: IsoTimestamp;
}
