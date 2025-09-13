/** @fileoverview Types for migrating and transforming data. */
import { Uuid } from '../common.types';

export interface DataMigrationJob {
  readonly jobId: Uuid;
  readonly sourceVersion: string;
  readonly targetVersion: string;
  readonly entity: string; // e.g., 'UserProfile', 'Task'
  readonly status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  readonly progress: { processed: number; total: number; };
}

export interface DataTransformer<T, U> {
  transform(sourceData: T): U;
}
