/** @fileoverview Types for migration version control. */

export interface MigrationHistory {
  readonly version: string;
  readonly appliedOn: Date;
  readonly description: string;
}

export interface VersionCompatibility {
  readonly appVersion: string;
  readonly requiredSchemaVersion: string;
  readonly isCompatible: boolean;
}
