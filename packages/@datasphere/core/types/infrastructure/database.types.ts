/** @fileoverview Types for database connections and operations. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type DatabaseType = 'POSTGRESQL' | 'MYSQL' | 'MONGODB' | 'REDIS';

export interface DatabaseConnectionConfig {
  readonly type: DatabaseType;
  readonly host: string;
  readonly port: number;
  readonly username?: string;
  readonly password?: string;
  readonly database: string;
  readonly sslEnabled: boolean;
}

export interface QueryResult {
  readonly success: boolean;
  readonly rowsAffected?: number;
  readonly data?: any[];
  readonly error?: string;
}

export interface MigrationRecord {
  readonly version: string;
  readonly name: string;
  readonly executedAt: IsoTimestamp;
}
