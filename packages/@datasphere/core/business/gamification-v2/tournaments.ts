/** @fileoverview Business logic for managing tournaments. */
import { Uuid, IsoTimestamp } from '@datasphere/core/types/common.types';

export type TournamentStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

export interface Tournament {
  readonly tournamentId: Uuid;
  readonly name: string;
  readonly status: TournamentStatus;
  readonly startDate: IsoTimestamp;
  readonly endDate: IsoTimestamp;
  readonly rewardPool: string; // e.g., '1000 USD', 'Exclusive Badges'
  readonly participants: Uuid[];
}

export class TournamentService {
  async createTournament(tournament: Omit<Tournament, 'tournamentId' | 'participants'>): Promise<Tournament> {
    console.log(`Creating tournament: ${tournament.name}`);
    // Placeholder
    return { tournamentId: 'tour-123' as Uuid, participants: [], ...tournament };
  }

  async joinTournament(tournamentId: Uuid, userId: Uuid): Promise<void> {
    console.log(`User ${userId} joining tournament ${tournamentId}`);
    // Placeholder
  }
}
