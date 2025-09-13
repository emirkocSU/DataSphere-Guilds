/** @fileoverview Types related to the business marketplace. */
import { Uuid, IsoTimestamp } from '../../types/common.types';
import { Task } from './task.types';

export interface MarketplaceListing {
  listingId: Uuid;
  taskId: Uuid;
  task: Task;
  price: MoneyValue;
  currency: string;
  listedAt: IsoTimestamp;
  expiresAt: IsoTimestamp;
}

export interface TaskBidding {
  bidId: Uuid;
  taskId: Uuid;
  userId: Uuid;
  bidAmount: MoneyValue;
  currency: string;
  bidAt: IsoTimestamp;
}
