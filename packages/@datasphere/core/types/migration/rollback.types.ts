/** @fileoverview Types for migration rollback strategies. */

export interface RollbackStrategy {
  readonly toVersion: string | 'PREVIOUS';
  readonly dryRun: boolean;
  readonly atomic: boolean; // All or nothing
}

export interface RollbackResult {
  readonly success: boolean;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly message?: string;
}
