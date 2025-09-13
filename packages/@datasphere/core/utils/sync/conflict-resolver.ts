/**
 * @fileoverview Conflict Resolution Engine
 */

import { EventEmitter } from 'events';
import { Conflict, ConflictResolution, SyncRecord, Delta } from './types';

export class ConflictResolver extends EventEmitter {
  private static instance: ConflictResolver;
  private resolvers = new Map<string, Function>();
  private conflicts = new Map<string, Conflict>();

  private constructor() {
    super();
    this.registerDefaultResolvers();
  }

  static getInstance(): ConflictResolver {
    if (!ConflictResolver.instance) {
      ConflictResolver.instance = new ConflictResolver();
    }
    return ConflictResolver.instance;
  }

  async resolveConflict(conflict: Conflict): Promise<ConflictResolution> {
    const resolver = this.resolvers.get(conflict.objectType) || this.resolvers.get('default');
    
    if (!resolver) {
      throw new Error(`No resolver found for object type: ${conflict.objectType}`);
    }

    try {
      const resolution = await resolver(conflict);
      
      conflict.resolution = resolution;
      conflict.resolvedAt = new Date().toISOString();
      conflict.status = 'RESOLVED';
      
      this.conflicts.set(conflict.id, conflict);
      this.emit('conflict-resolved', conflict);
      
      return resolution;
    } catch (error) {
      this.emit('conflict-resolution-failed', { conflict, error });
      throw error;
    }
  }

  registerResolver(objectType: string, resolver: Function): void {
    this.resolvers.set(objectType, resolver);
  }

  detectConflicts(localRecord: SyncRecord, remoteRecord: SyncRecord): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Version conflict
    if (localRecord.version !== remoteRecord.version) {
      conflicts.push(this.createConflict(localRecord, remoteRecord, 'DATA'));
    }

    // Concurrent modification
    if (this.areConcurrentModifications(localRecord, remoteRecord)) {
      conflicts.push(this.createConflict(localRecord, remoteRecord, 'CONCURRENT'));
    }

    // Schema conflict
    if (this.hasSchemaConflict(localRecord.data, remoteRecord.data)) {
      conflicts.push(this.createConflict(localRecord, remoteRecord, 'SCHEMA'));
    }

    // Deletion conflict
    if (this.hasDeletionConflict(localRecord, remoteRecord)) {
      conflicts.push(this.createConflict(localRecord, remoteRecord, 'DELETION'));
    }

    return conflicts;
  }

  private registerDefaultResolvers(): void {
    // Last Write Wins
    this.resolvers.set('default', (conflict: Conflict) => {
      const localTime = new Date(conflict.localData.timestamp as string || 0);
      const remoteTime = new Date(conflict.remoteData.timestamp as string || 0);
      
      return {
        strategy: 'LAST_WRITE_WINS',
        resolvedBy: 'system',
        resolvedAt: new Date().toISOString(),
        conflictData: localTime > remoteTime ? conflict.localData : conflict.remoteData
      };
    });

    // Merge strategy
    this.resolvers.set('merge', (conflict: Conflict) => {
      const merged = this.mergeObjects(conflict.localData, conflict.remoteData);
      
      return {
        strategy: 'MERGE',
        resolvedBy: 'system',
        resolvedAt: new Date().toISOString(),
        conflictData: merged
      };
    });

    // First Write Wins
    this.resolvers.set('first_write', (conflict: Conflict) => {
      const localTime = new Date(conflict.localData.timestamp as string || 0);
      const remoteTime = new Date(conflict.remoteData.timestamp as string || 0);
      
      return {
        strategy: 'FIRST_WRITE_WINS',
        resolvedBy: 'system',
        resolvedAt: new Date().toISOString(),
        conflictData: localTime < remoteTime ? conflict.localData : conflict.remoteData
      };
    });
  }

  private createConflict(
    localRecord: SyncRecord,
    remoteRecord: SyncRecord,
    type: Conflict['conflictType']
  ): Conflict {
    return {
      id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      objectId: localRecord.objectId,
      objectType: localRecord.objectType,
      localVersion: localRecord.version,
      remoteVersion: remoteRecord.version,
      localData: localRecord.data,
      remoteData: remoteRecord.data,
      conflictType: type,
      detectedAt: new Date().toISOString(),
      status: 'PENDING'
    };
  }

  private areConcurrentModifications(local: SyncRecord, remote: SyncRecord): boolean {
    const localTime = new Date(local.timestamp);
    const remoteTime = new Date(remote.timestamp);
    const timeDiff = Math.abs(localTime.getTime() - remoteTime.getTime());
    
    return timeDiff < 1000; // Within 1 second
  }

  private hasSchemaConflict(localData: Record<string, unknown>, remoteData: Record<string, unknown>): boolean {
    const localKeys = Object.keys(localData);
    const remoteKeys = Object.keys(remoteData);
    
    const localSet = new Set(localKeys);
    const remoteSet = new Set(remoteKeys);
    
    return localSet.size !== remoteSet.size || 
           !localKeys.every(key => remoteSet.has(key));
  }

  private hasDeletionConflict(local: SyncRecord, remote: SyncRecord): boolean {
    return (local.operation === 'DELETE' && remote.operation === 'UPDATE') ||
           (local.operation === 'UPDATE' && remote.operation === 'DELETE');
  }

  private mergeObjects(local: Record<string, unknown>, remote: Record<string, unknown>): Record<string, unknown> {
    const merged = { ...local };
    
    for (const [key, value] of Object.entries(remote)) {
      if (!(key in merged)) {
        merged[key] = value;
      } else if (typeof value === 'object' && typeof merged[key] === 'object') {
        merged[key] = this.mergeObjects(
          merged[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        // Use remote value for conflicts
        merged[key] = value;
      }
    }
    
    return merged;
  }

  getConflicts(objectId?: string): Conflict[] {
    const conflicts = Array.from(this.conflicts.values());
    return objectId ? conflicts.filter(c => c.objectId === objectId) : conflicts;
  }

  getPendingConflicts(): Conflict[] {
    return Array.from(this.conflicts.values()).filter(c => c.status === 'PENDING');
  }

  generateDelta(oldData: Record<string, unknown>, newData: Record<string, unknown>): Delta[] {
    const deltas: Delta[] = [];
    
    // Find changes
    for (const [key, newValue] of Object.entries(newData)) {
      if (!(key in oldData)) {
        deltas.push({
          path: key,
          operation: 'ADD',
          newValue
        });
      } else if (oldData[key] !== newValue) {
        deltas.push({
          path: key,
          operation: 'REPLACE',
          oldValue: oldData[key],
          newValue
        });
      }
    }
    
    // Find removals
    for (const key of Object.keys(oldData)) {
      if (!(key in newData)) {
        deltas.push({
          path: key,
          operation: 'REMOVE',
          oldValue: oldData[key]
        });
      }
    }
    
    return deltas;
  }

  applyDelta(data: Record<string, unknown>, deltas: Delta[]): Record<string, unknown> {
    const result = { ...data };
    
    for (const delta of deltas) {
      switch (delta.operation) {
        case 'ADD':
        case 'REPLACE':
          result[delta.path] = delta.newValue;
          break;
        case 'REMOVE':
          delete result[delta.path];
          break;
      }
    }
    
    return result;
  }
}

export const createConflictResolver = (): ConflictResolver => {
  return ConflictResolver.getInstance();
};