/** @fileoverview Interfaces for Resource Allocation services. */
import { Uuid } from '../../../types/common.types';
import { ResourceRequest, ResourceType } from './types';

export interface IResourceAllocationService {
  requestResource(request: Omit<ResourceRequest, 'requestId' | 'createdAt'>): Promise<Uuid>;
  releaseResource(requestId: Uuid): Promise<void>;
  getAvailableResources(type: ResourceType): Promise<number>;
}
