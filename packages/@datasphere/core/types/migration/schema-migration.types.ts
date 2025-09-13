/** @fileoverview Types for database schema migrations. */
import { Uuid, IsoTimestamp } from '../common.types';

export interface SchemaMigration {
  readonly version: string; // e.g., '20250718123000'
  readonly name: string;
  readonly description: string;
  readonly executedAt?: IsoTimestamp;
  readonly status: 'PENDING' | 'EXECUTED' | 'FAILED';
  up(queryRunner: any): Promise<void>; // The actual migration logic
  down(queryRunner: any): Promise<void>; // The rollback logic
}
