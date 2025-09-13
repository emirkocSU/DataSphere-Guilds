/** @fileoverview Types for database abstraction. */
import { Uuid } from '../../types/common.types';

export type DatabaseType = 'POSTGRESQL' | 'MYSQL' | 'MONGODB';

export interface DatabaseConfig {
  readonly dbId: Uuid;
  readonly type: DatabaseType;
  readonly connectionString: string;
  readonly poolSize: number;
  readonly isActive: boolean;
}

export interface QueryResult {
  readonly success: boolean;
  readonly rowsAffected?: number;
  readonly data?: any[];
  readonly error?: string;
}
