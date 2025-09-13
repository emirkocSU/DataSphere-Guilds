/** @fileoverview Types for achievements and badges. */
import { UUID, ISOTimestamp } from '../../types/common.types';

export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Achievement {
  readonly achievementId: UUID;
  readonly name: string;
  readonly description: string;
  readonly tier: AchievementTier;
  readonly iconUrl: string;
  readonly criteria: Record<string, any>; // e.g., { tasksCompleted: 100, approvalRate: 0.9 }
}

export interface UserAchievement {
  readonly userId: UUID;
  readonly achievementId: UUID;
  readonly unlockedAt: ISOTimestamp;
}
