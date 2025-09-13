/** @fileoverview Event types for Blockchain Integration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { SmartContract } from './types';

export interface ContractDeployedEvent {
  eventId: Uuid;
  contract: SmartContract;
  timestamp: IsoTimestamp;
}
