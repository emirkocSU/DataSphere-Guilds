/** @fileoverview Business logic for the reward engine. */
import { Uuid } from '@datasphere/core/types/common.types';

export type RewardType = 'BONUS_POINTS' | 'VIRTUAL_CURRENCY' | 'BADGE' | 'PHYSICAL_ITEM';

export interface Reward {
  readonly rewardId: Uuid;
  readonly type: RewardType;
  readonly value: any; // e.g., 100 (points), '5_USD' (currency), 'GOLD_BADGE_ID'
  readonly userId: Uuid;
  readonly issuedAt: Date;
}

export class RewardEngine {
  async issueReward(reward: Omit<Reward, 'rewardId' | 'issuedAt'>): Promise<Reward> {
    console.log(`Issuing reward of type ${reward.type} to user ${reward.userId}`);
    // Placeholder
    return { rewardId: 'reward-123' as Uuid, issuedAt: new Date(), ...reward };
  }
}
