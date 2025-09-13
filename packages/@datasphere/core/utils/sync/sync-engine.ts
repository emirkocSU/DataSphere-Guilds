/**
 * @fileoverview Data Synchronization Engine
 */

import { EventEmitter } from 'events';
import { SyncRecord, SyncQueue, SyncConfig, DeltaSync, SyncState, DeviceId, UserId, SyncMetrics } from './types';
import { ConflictResolver, createConflictResolver } from './conflict-resolver';

export class SyncEngine extends EventEmitter {
  private static instance: SyncEngine;
  private config: SyncConfig;
  private conflictResolver: ConflictResolver;
  private syncQueues = new Map<string, SyncQueue>();
  private deviceStates = new Map<DeviceId, SyncState>();
  private storage = new Map<string, SyncRecord>();
  private metrics: SyncMetrics;
  private syncTimer?: NodeJS.Timeout;

  private constructor(config: SyncConfig) {
    super();
    this.config = config;
    this.conflictResolver = createConflictResolver();
    this.metrics = {
      totalRecords: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      conflictsResolved: 0,
      averageSyncTime: 0,
      bandwidthUsage: 0,
      compressionRatio: 0,
      errorRate: 0,
      deviceSyncStatus: {}
    };
    
    this.startSyncScheduler();
  }

  static getInstance(config?: SyncConfig): SyncEngine {
    if (!SyncEngine.instance) {
      if (!config) throw new Error('SyncEngine requires configuration');
      SyncEngine.instance = new SyncEngine(config);
    }
    return SyncEngine.instance;
  }

  async createRecord(
    objectId: string,
    objectType: string,
    data: Record<string, unknown>,
    deviceId: DeviceId,
    userId: UserId
  ): Promise<SyncRecord> {
    const record: SyncRecord = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      objectId,
      objectType,
      deviceId,
      userId,
      version: this.generateVersion(),
      timestamp: new Date().toISOString(),
      operation: 'CREATE',
      data,
      metadata: {
        sourceDevice: deviceId,
        conflictResolution: { strategy: this.config.conflictStrategy },
        priority: 1,
        dependencies: [],
        checksum: this.calculateChecksum(data),
        size: JSON.stringify(data).length
      }
    };

    await this.addToQueue(record);
    this.storage.set(record.id, record);
    this.metrics.totalRecords++;
    
    this.emit('record-created', record);
    return record;
  }

  async updateRecord(
    objectId: string,
    data: Record<string, unknown>,
    deviceId: DeviceId,
    userId: UserId
  ): Promise<SyncRecord> {
    const existing = this.findRecord(objectId);
    
    const record: SyncRecord = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      objectId,
      objectType: existing?.objectType || 'unknown',
      deviceId,
      userId,
      version: this.generateVersion(),
      timestamp: new Date().toISOString(),
      operation: 'UPDATE',
      data,
      metadata: {
        sourceDevice: deviceId,
        conflictResolution: { strategy: this.config.conflictStrategy },
        priority: 2,
        dependencies: existing ? [existing.id] : [],
        checksum: this.calculateChecksum(data),
        size: JSON.stringify(data).length
      }
    };

    await this.addToQueue(record);
    this.storage.set(record.id, record);
    
    this.emit('record-updated', record);
    return record;
  }

  async deleteRecord(
    objectId: string,
    deviceId: DeviceId,
    userId: UserId
  ): Promise<SyncRecord> {
    const existing = this.findRecord(objectId);
    
    const record: SyncRecord = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      objectId,
      objectType: existing?.objectType || 'unknown',
      deviceId,
      userId,
      version: this.generateVersion(),
      timestamp: new Date().toISOString(),
      operation: 'DELETE',
      data: {},
      metadata: {
        sourceDevice: deviceId,
        conflictResolution: { strategy: this.config.conflictStrategy },
        priority: 3,
        dependencies: existing ? [existing.id] : [],
        checksum: '',
        size: 0
      }
    };

    await this.addToQueue(record);
    this.storage.set(record.id, record);
    
    this.emit('record-deleted', record);
    return record;
  }

  async sync(deviceId: DeviceId, userId: UserId): Promise<void> {
    const startTime = Date.now();
    
    try {
      const queueKey = `${deviceId}:${userId}`;
      const queue = this.syncQueues.get(queueKey);
      
      if (!queue || queue.records.length === 0) {
        return;
      }

      queue.status = 'SYNCING';
      this.updateDeviceState(deviceId, userId, { syncInProgress: true });

      const batch = queue.records.splice(0, this.config.batchSize);
      const processed = await this.processBatch(batch, deviceId, userId);
      
      this.metrics.successfulSyncs += processed.successful;
      this.metrics.failedSyncs += processed.failed;
      this.metrics.conflictsResolved += processed.conflicts;
      
      const duration = Date.now() - startTime;
      this.metrics.averageSyncTime = (this.metrics.averageSyncTime + duration) / 2;
      
      queue.status = queue.records.length > 0 ? 'PENDING' : 'COMPLETED';
      queue.lastSyncAt = new Date().toISOString();
      
      this.updateDeviceState(deviceId, userId, { 
        syncInProgress: false,
        lastSyncAt: queue.lastSyncAt,
        pendingChanges: queue.records.length
      });

      this.emit('sync-completed', { deviceId, userId, duration, processed });
      
    } catch (error) {
      this.metrics.failedSyncs++;
      this.updateDeviceState(deviceId, userId, { syncInProgress: false });
      this.emit('sync-failed', { deviceId, userId, error });
      throw error;
    }
  }

  createDeltaSync(
    objectId: string,
    fromVersion: string,
    toVersion: string,
    changes: any[]
  ): DeltaSync {
    return {
      objectId,
      fromVersion,
      toVersion,
      changes,
      timestamp: new Date().toISOString(),
      size: JSON.stringify(changes).length
    };
  }

  async applyDeltaSync(delta: DeltaSync): Promise<void> {
    const existing = this.findRecord(delta.objectId);
    
    if (!existing) {
      throw new Error(`Object ${delta.objectId} not found`);
    }

    const updatedData = this.conflictResolver.applyDelta(existing.data, delta.changes);
    
    await this.updateRecord(
      delta.objectId,
      updatedData,
      existing.deviceId,
      existing.userId
    );
  }

  getDeviceState(deviceId: DeviceId): SyncState | null {
    return this.deviceStates.get(deviceId) || null;
  }

  getMetrics(): SyncMetrics {
    return { ...this.metrics };
  }

  private async addToQueue(record: SyncRecord): Promise<void> {
    const queueKey = `${record.deviceId}:${record.userId}`;
    
    if (!this.syncQueues.has(queueKey)) {
      this.syncQueues.set(queueKey, {
        id: queueKey,
        deviceId: record.deviceId,
        userId: record.userId,
        records: [],
        status: 'PENDING',
        priority: 1,
        retryCount: 0
      });
    }

    const queue = this.syncQueues.get(queueKey)!;
    queue.records.push(record);
    
    this.updateDeviceState(record.deviceId, record.userId, {
      pendingChanges: queue.records.length
    });
  }

  private async processBatch(
    records: SyncRecord[],
    deviceId: DeviceId,
    userId: UserId
  ): Promise<{ successful: number; failed: number; conflicts: number }> {
    let successful = 0;
    let failed = 0;
    let conflicts = 0;

    for (const record of records) {
      try {
        // Check for conflicts
        const existingRecords = this.findConflictingRecords(record);
        
        if (existingRecords.length > 0) {
          for (const existing of existingRecords) {
            const detectedConflicts = this.conflictResolver.detectConflicts(record, existing);
            
            for (const conflict of detectedConflicts) {
              await this.conflictResolver.resolveConflict(conflict);
              conflicts++;
            }
          }
        }

        await this.processRecord(record);
        successful++;
        
      } catch (error) {
        failed++;
        this.emit('record-process-failed', { record, error });
      }
    }

    return { successful, failed, conflicts };
  }

  private async processRecord(record: SyncRecord): Promise<void> {
    // Apply compression if enabled
    if (this.config.compressionEnabled) {
      record.data = await this.compressData(record.data);
    }

    // Apply encryption if enabled
    if (this.config.encryptionEnabled) {
      record.data = await this.encryptData(record.data);
    }

    // Update bandwidth metrics
    this.metrics.bandwidthUsage += record.metadata.size;
    
    this.emit('record-processed', record);
  }

  private findRecord(objectId: string): SyncRecord | null {
    for (const record of this.storage.values()) {
      if (record.objectId === objectId) {
        return record;
      }
    }
    return null;
  }

  private findConflictingRecords(record: SyncRecord): SyncRecord[] {
    const conflicts: SyncRecord[] = [];
    
    for (const existing of this.storage.values()) {
      if (existing.objectId === record.objectId && 
          existing.deviceId !== record.deviceId &&
          existing.version !== record.version) {
        conflicts.push(existing);
      }
    }
    
    return conflicts;
  }

  private updateDeviceState(deviceId: DeviceId, userId: UserId, updates: Partial<SyncState>): void {
    const existing = this.deviceStates.get(deviceId) || {
      deviceId,
      userId,
      lastSyncVersion: '0',
      pendingChanges: 0,
      conflictCount: 0,
      syncInProgress: false,
      bandwidth: { bytesUp: 0, bytesDown: 0, requestsPerSecond: 0 }
    };

    this.deviceStates.set(deviceId, { ...existing, ...updates });
    this.metrics.deviceSyncStatus[deviceId] = this.deviceStates.get(deviceId)!;
  }

  private startSyncScheduler(): void {
    if (this.syncTimer) return;
    
    this.syncTimer = setInterval(async () => {
      for (const [queueKey, queue] of this.syncQueues) {
        if (queue.status === 'PENDING' && queue.records.length > 0) {
          await this.sync(queue.deviceId, queue.userId);
        }
      }
    }, this.config.syncInterval);
  }

  private generateVersion(): string {
    return `v${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateChecksum(data: Record<string, unknown>): string {
    return btoa(JSON.stringify(data)).slice(0, 8);
  }

  private async compressData(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Mock compression
    return data;
  }

  private async encryptData(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    // Mock encryption
    return data;
  }
}

export const createSyncEngine = (config: SyncConfig): SyncEngine => {
  return SyncEngine.getInstance(config);
};