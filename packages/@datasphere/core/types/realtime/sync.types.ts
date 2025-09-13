/** @fileoverview Types for data synchronization and conflict resolution. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type SyncStatus = 'IN_SYNC' | 'OUT_OF_SYNC' | 'CONFLICT';

export interface DataSyncRecord {
  readonly recordId: Uuid;
  readonly entityType: string;
  readonly entityId: Uuid;
  readonly lastSyncedAt: IsoTimestamp;
  readonly status: SyncStatus;
  readonly conflictDetails?: Record<string, any>;
}
