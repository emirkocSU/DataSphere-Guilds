/**
 * @fileoverview Database Abstraction Layer Types
 */

export type ConnectionId = string;
export type QueryId = string;
export type TransactionId = string;
export type MigrationId = string;
export type ISOTimestamp = string;

export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MONGODB = 'mongodb',
  REDIS = 'redis',
  ELASTICSEARCH = 'elasticsearch'
}

export enum QueryType {
  SELECT = 'select',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  AGGREGATE = 'aggregate'
}

export enum TransactionState {
  ACTIVE = 'active',
  COMMITTED = 'committed',
  ABORTED = 'aborted'
}

export interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  options: ConnectionOptions;
  pool: PoolConfig;
  replication: ReplicationConfig;
}

export interface ConnectionOptions {
  ssl: boolean;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  charset: string;
  timezone: string;
}

export interface PoolConfig {
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  idleTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  reapIntervalMillis: number;
}

export interface ReplicationConfig {
  enabled: boolean;
  master: DatabaseConfig;
  slaves: DatabaseConfig[];
  readPreference: 'primary' | 'secondary' | 'nearest';
  lagThreshold: number;
}

export interface DatabaseConnection {
  id: ConnectionId;
  type: DatabaseType;
  config: DatabaseConfig;
  state: 'connected' | 'disconnected' | 'connecting' | 'error';
  createdAt: ISOTimestamp;
  lastUsed: ISOTimestamp;
  metrics: ConnectionMetrics;
}

export interface ConnectionMetrics {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageResponseTime: number;
  connectionsUsed: number;
  connectionsAvailable: number;
}

export interface Query {
  id: QueryId;
  type: QueryType;
  raw: string;
  params: unknown[];
  table?: string;
  conditions: QueryCondition[];
  fields: string[];
  joins: QueryJoin[];
  orderBy: QueryOrderBy[];
  groupBy: string[];
  having: QueryCondition[];
  limit?: number;
  offset?: number;
}

export interface QueryCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'like' | 'regex';
  value: unknown;
  logical?: 'and' | 'or';
}

export interface QueryJoin {
  type: 'inner' | 'left' | 'right' | 'full';
  table: string;
  on: string;
  alias?: string;
}

export interface QueryOrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  fields: QueryField[];
  executionTime: number;
  queryId: QueryId;
}

export interface QueryField {
  name: string;
  type: string;
  nullable: boolean;
  key: boolean;
  default?: unknown;
}

export interface Transaction {
  id: TransactionId;
  connectionId: ConnectionId;
  state: TransactionState;
  queries: QueryId[];
  startTime: ISOTimestamp;
  endTime?: ISOTimestamp;
  isolation: 'read_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';
}

export interface Migration {
  id: MigrationId;
  version: string;
  name: string;
  description: string;
  up: string;
  down: string;
  executedAt?: ISOTimestamp;
  rollbackAt?: ISOTimestamp;
  checksum: string;
}

export interface MigrationState {
  currentVersion: string;
  pendingMigrations: Migration[];
  appliedMigrations: Migration[];
  lastMigration?: Migration;
}

export interface ShardConfig {
  enabled: boolean;
  strategy: 'hash' | 'range' | 'directory';
  shardKey: string;
  shards: ShardDefinition[];
  rebalancing: RebalancingConfig;
}

export interface ShardDefinition {
  id: string;
  name: string;
  range: ShardRange;
  connection: DatabaseConfig;
  weight: number;
  isActive: boolean;
}

export interface ShardRange {
  min: unknown;
  max: unknown;
  hash?: string;
}

export interface RebalancingConfig {
  enabled: boolean;
  threshold: number;
  strategy: 'automatic' | 'manual';
  schedule: string;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo';
  keyPrefix: string;
}

export interface QueryCache {
  key: string;
  result: QueryResult;
  ttl: number;
  createdAt: ISOTimestamp;
  hitCount: number;
  lastAccessed: ISOTimestamp;
}

export interface DatabaseMonitoring {
  metrics: DatabaseMetrics;
  alerts: DatabaseAlert[];
  logs: DatabaseLog[];
  performance: PerformanceMetrics;
}

export interface DatabaseMetrics {
  connections: {
    active: number;
    idle: number;
    total: number;
    waiting: number;
  };
  queries: {
    total: number;
    successful: number;
    failed: number;
    slow: number;
    averageTime: number;
  };
  transactions: {
    active: number;
    committed: number;
    aborted: number;
    deadlocks: number;
  };
  storage: {
    size: number;
    used: number;
    available: number;
    growth: number;
  };
}

export interface DatabaseAlert {
  id: string;
  type: 'connection' | 'performance' | 'storage' | 'replication' | 'backup';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  triggeredAt: ISOTimestamp;
  acknowledged: boolean;
}

export interface DatabaseLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  query?: string;
  duration?: number;
  timestamp: ISOTimestamp;
  metadata: Record<string, unknown>;
}

export interface PerformanceMetrics {
  slowQueries: SlowQuery[];
  indexUsage: IndexUsage[];
  lockContention: LockContention[];
  cacheHitRate: number;
  bufferPoolUsage: number;
}

export interface SlowQuery {
  query: string;
  executionTime: number;
  frequency: number;
  lastExecuted: ISOTimestamp;
  suggestion?: string;
}

export interface IndexUsage {
  table: string;
  index: string;
  usage: number;
  efficiency: number;
  suggestion?: string;
}

export interface LockContention {
  table: string;
  lockType: string;
  waitTime: number;
  frequency: number;
  lastOccurred: ISOTimestamp;
}

export interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
  destination: BackupDestination;
}

export interface BackupDestination {
  type: 'local' | 's3' | 'gcs' | 'azure';
  path: string;
  credentials: Record<string, string>;
}

export interface Backup {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  duration: number;
  startTime: ISOTimestamp;
  endTime: ISOTimestamp;
  status: 'running' | 'completed' | 'failed';
  location: string;
  checksum: string;
}

export interface ArchiveConfig {
  enabled: boolean;
  rules: ArchiveRule[];
  destination: ArchiveDestination;
  compression: boolean;
  encryption: boolean;
}

export interface ArchiveRule {
  table: string;
  condition: string;
  schedule: string;
  retention: number;
  enabled: boolean;
}

export interface ArchiveDestination {
  type: 'warehouse' | 'blob' | 'cold_storage';
  connection: DatabaseConfig;
  path: string;
}