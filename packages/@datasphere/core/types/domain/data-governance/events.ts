/** @fileoverview Event types for Data Governance. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { DataPolicy } from './types';

export interface DataPolicyUpdatedEvent {
  eventId: Uuid;
  policy: DataPolicy;
  timestamp: IsoTimestamp;
}
