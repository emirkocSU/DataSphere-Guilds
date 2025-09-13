/**
 * @fileoverview Data Synchronization Engine Types
 */

export type SyncId = string;
export type DeviceId = string;
export type UserId = string;
export type ObjectId = string;
export type VersionId = string;
export type ISOTimestamp = string;

export interface SyncRecord {
  id: SyncId;
  objectId: ObjectId;
  objectType: string;
  deviceId: DeviceId;
  userId: UserId;
  version: VersionId;
  timestamp: ISOTimestamp;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Record<string, unknown>;
  metadata: SyncMetadata;
}

export interface SyncMetadata {
  sourceDevice: DeviceId;
  conflictResolution: ConflictResolution;
  priority: number;
  dependencies: ObjectId[];
  checksum: string;
  size: number;
}

export interface ConflictResolution {
  strategy: 'LAST_WRITE_WINS' | 'FIRST_WRITE_WINS' | 'MERGE' | 'MANUAL';
  resolvedBy?: DeviceId;
  resolvedAt?: ISOTimestamp;
  conflictData?: Record<string, unknown>;
}

export interface SyncQueue {
  id: string;
  deviceId: DeviceId;
  userId: UserId;
  records: SyncRecord[];
  status: 'PENDING' | 'SYNCING' | 'COMPLETED' | 'FAILED';
  priority: number;
  retryCount: number;
  lastSyncAt?: ISOTimestamp;
  nextSyncAt?: ISOTimestamp;
}

export interface SyncConfig {
  enabled: boolean;
  batchSize: number;
  syncInterval: number;
  maxRetries: number;
  conflictStrategy: ConflictResolution['strategy'];
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  bandwidthLimit: number;
  offlineMode: boolean;
}

export interface DeltaSync {
  objectId: ObjectId;
  fromVersion: VersionId;
  toVersion: VersionId;
  changes: Delta[];
  timestamp: ISOTimestamp;
  size: number;
}

export interface Delta {
  path: string;
  operation: 'ADD' | 'REMOVE' | 'REPLACE' | 'MOVE';
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}

export interface SyncState {
  deviceId: DeviceId;
  userId: UserId;
  lastSyncVersion: VersionId;
  pendingChanges: number;
  conflictCount: number;
  syncInProgress: boolean;
  lastSyncAt?: ISOTimestamp;
  nextSyncAt?: ISOTimestamp;
  bandwidth: {
    bytesUp: number;
    bytesDown: number;
    requestsPerSecond: number;
  };
}

export interface Conflict {
  id: string;
  objectId: ObjectId;
  objectType: string;
  localVersion: VersionId;
  remoteVersion: VersionId;
  localData: Record<string, unknown>;
  remoteData: Record<string, unknown>;
  conflictType: 'DATA' | 'SCHEMA' | 'DELETION' | 'CONCURRENT';
  detectedAt: ISOTimestamp;
  resolvedAt?: ISOTimestamp;
  resolution?: ConflictResolution;
  status: 'PENDING' | 'RESOLVED' | 'IGNORED';
}

export interface SyncMetrics {
  totalRecords: number;
  successfulSyncs: number;
  failedSyncs: number;
  conflictsResolved: number;
  averageSyncTime: number;
  bandwidthUsage: number;
  compressionRatio: number;
  errorRate: number;
  deviceSyncStatus: Record<DeviceId, SyncState>;
}

export interface ReplicationNode {
  id: string;
  deviceId: DeviceId;
  userId: UserId;
  isOnline: boolean;
  lastHeartbeat: ISOTimestamp;
  version: VersionId;
  priority: number;
  capabilities: ReplicationCapabilities;
}

export interface ReplicationCapabilities {
  canWrite: boolean;
  canRead: boolean;
  canResolveConflicts: boolean;
  supportedOperations: string[];
  maxBatchSize: number;
  compressionSupported: boolean;
  encryptionSupported: boolean;
}