/** @fileoverview Types for advanced gamification mechanics. */
import { UUID, ISOTimestamp } from '../../types/common.types';

export type ProgressionLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface ProgressionSystem {
  readonly systemId: UUID;
  readonly name: string;
  readonly levels: ProgressionLevel[];
  readonly pointsRequired: Record<ProgressionLevel, number>;
  readonly rewards: Record<ProgressionLevel, string>; // e.g., '10_USD_BONUS', 'EXCLUSIVE_BADGE'
}

export interface UserProgression {
  readonly userId: UUID;
  readonly currentLevel: ProgressionLevel;
  readonly currentPoints: number;
  readonly lastLevelUpAt: ISOTimestamp;
}
