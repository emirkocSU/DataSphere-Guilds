/** @fileoverview Core types for Resource Allocation. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ResourceType = 'CPU' | 'MEMORY' | 'STORAGE' | 'NETWORK';

export interface ResourceRequest {
  requestId: Uuid;
  resourceType: ResourceType;
  amount: number; // e.g., CPU cores, MB of memory
  unit: string; // e.g., 'cores', 'MB', 'Mbps'
  priority: number; // 1 (highest) to 5 (lowest)
  requestedBy: Uuid; // User or Service ID
  createdAt: IsoTimestamp;
}
