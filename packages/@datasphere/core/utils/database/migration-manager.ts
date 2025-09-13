/**
 * @fileoverview Database Migration Manager
 */

import { EventEmitter } from 'events';
import { Migration, MigrationState, MigrationId } from './types';

export class MigrationManager extends EventEmitter {
  private migrations = new Map<MigrationId, Migration>();
  private state: MigrationState = {
    currentVersion: '0.0.0',
    pendingMigrations: [],
    appliedMigrations: []
  };

  constructor() {
    super();
  }

  addMigration(migration: Migration): void {
    this.migrations.set(migration.id, migration);
    this.updateState();
  }

  async migrate(): Promise<void> {
    const pending = this.state.pendingMigrations.sort((a, b) => 
      a.version.localeCompare(b.version)
    );

    for (const migration of pending) {
      await this.executeMigration(migration);
    }
  }

  async rollback(targetVersion?: string): Promise<void> {
    const applied = this.state.appliedMigrations
      .filter(m => !targetVersion || m.version > targetVersion)
      .sort((a, b) => b.version.localeCompare(a.version));

    for (const migration of applied) {
      await this.rollbackMigration(migration);
    }
  }

  getState(): MigrationState {
    return { ...this.state };
  }

  private async executeMigration(migration: Migration): Promise<void> {
    try {
      // Mock migration execution
      await new Promise(resolve => setTimeout(resolve, 100));
      
      migration.executedAt = new Date().toISOString();
      this.state.appliedMigrations.push(migration);
      this.state.currentVersion = migration.version;
      this.updateState();
      
      this.emit('migration-applied', migration);
    } catch (error) {
      this.emit('migration-error', { migration, error });
      throw error;
    }
  }

  private async rollbackMigration(migration: Migration): Promise<void> {
    try {
      // Mock rollback execution
      await new Promise(resolve => setTimeout(resolve, 100));
      
      migration.rollbackAt = new Date().toISOString();
      const index = this.state.appliedMigrations.indexOf(migration);
      if (index > -1) {
        this.state.appliedMigrations.splice(index, 1);
      }
      
      this.updateState();
      this.emit('migration-rollback', migration);
    } catch (error) {
      this.emit('rollback-error', { migration, error });
      throw error;
    }
  }

  private updateState(): void {
    this.state.pendingMigrations = Array.from(this.migrations.values())
      .filter(m => !m.executedAt);
    
    this.state.lastMigration = this.state.appliedMigrations
      .sort((a, b) => b.version.localeCompare(a.version))[0];
  }
}

export const createMigrationManager = (): MigrationManager => {
  return new MigrationManager();
};