/** @fileoverview Event types for System Resilience. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { ResiliencePolicy } from './types';

export interface ResiliencePolicyTriggeredEvent {
  eventId: Uuid;
  policy: ResiliencePolicy;
  timestamp: IsoTimestamp;
}
