/** @fileoverview Types for multi-device data synchronization. */
import type { UUID, ISOTimestamp } from '@datasphere/core/types/common.types';

export type SyncConflictResolutionStrategy = 'LAST_WRITE_WINS' | 'FIRST_WRITE_WINS' | 'MERGE' | 'MANUAL';

export interface SyncSession {
  readonly sessionId: UUID;
  readonly userId: UUID;
  readonly deviceId: UUID;
  readonly startedAt: ISOTimestamp;
  readonly endedAt?: ISOTimestamp;
  readonly status: 'ACTIVE' | 'COMPLETED' | 'FAILED';
}

export interface SyncConflict {
  readonly conflictId: UUID;
  readonly sessionId: UUID;
  readonly entityType: string;
  readonly entityId: UUID;
  readonly localVersion: any;
  readonly remoteVersion: any;
  readonly resolutionStrategy: SyncConflictResolutionStrategy;
}
