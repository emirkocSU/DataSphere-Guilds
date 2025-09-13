/** @fileoverview Event types for API Contracts. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { ApiContract } from './types';

export interface ContractUpdatedEvent {
  eventId: Uuid;
  contract: ApiContract;
  timestamp: IsoTimestamp;
}
