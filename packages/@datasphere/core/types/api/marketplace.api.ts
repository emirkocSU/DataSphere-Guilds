/** @fileoverview API types for marketplace interactions. */
import { Uuid } from '../../types/common.types';

export interface TaskListingRequest {
  taskId: Uuid;
  price: number;
  currency: string;
}

export interface TaskListingResponse {
  listingId: Uuid;
  status: 'ACTIVE' | 'INACTIVE';
}
