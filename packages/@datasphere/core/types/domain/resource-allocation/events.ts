/** @fileoverview Event types for Resource Allocation. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { ResourceRequest } from './types';

export interface ResourceAllocatedEvent {
  eventId: Uuid;
  request: ResourceRequest;
  allocatedAmount: number;
  timestamp: IsoTimestamp;
}
