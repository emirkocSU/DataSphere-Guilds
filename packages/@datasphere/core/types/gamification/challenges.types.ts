/** @fileoverview Types for challenges and quests. */
import { UUID, ISOTimestamp } from '../../types/common.types';

export type ChallengeStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface Challenge {
  readonly challengeId: UUID;
  readonly name: string;
  readonly description: string;
  readonly status: ChallengeStatus;
  readonly reward: string; // e.g., '10 USD', 'Gold Badge'
  readonly startsAt: ISOTimestamp;
  readonly endsAt: ISOTimestamp;
  readonly criteria: Record<string, any>; // e.g., { completeTasks: 5, inCategory: 'IMAGE_ANNOTATION' }
}

export interface UserChallengeProgress {
  readonly userId: UUID;
  readonly challengeId: UUID;
  readonly currentProgress: number;
  readonly lastUpdated: ISOTimestamp;
}
