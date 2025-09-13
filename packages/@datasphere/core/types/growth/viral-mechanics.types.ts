/** @fileoverview Types for viral growth mechanics. */
import { Uuid, IsoTimestamp, Percentage } from '../../types/common.types';

export type ReferralStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Referral {
  readonly referralId: Uuid;
  readonly referrerId: Uuid;
  readonly referredUserId: Uuid;
  readonly status: ReferralStatus;
  readonly createdAt: IsoTimestamp;
  readonly rewardClaimedAt?: IsoTimestamp;
}

export interface ViralLoopConfig {
  readonly loopId: Uuid;
  readonly name: string;
  readonly triggerEvent: string; // e.g., 'user.signup', 'task.completed'
  readonly incentive: string; // e.g., '10_USD_BONUS', 'FREE_TASK'
  readonly isActive: boolean;
}
