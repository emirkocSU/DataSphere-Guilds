/** @fileoverview Advanced repository interfaces with comprehensive query capabilities. */

import { UUID } from '../types/api/common';
import { QueryOptions, FilterOptions, SortOptions, PaginationOptions } from '../types/query/query.types';
import { TransactionContext } from '../types/database/transaction.types';
import { RepositoryMetrics, RepositoryEvent } from '../types/repository/repository.types';

/**
 * Advanced repository interface with comprehensive querying, transactions, and observability
 */
export interface IRepository<T, TKey = UUID> {
  // Basic CRUD operations
  findById(id: TKey, options?: FindOptions): Promise<T | null>;
  findByIds(ids: TKey[], options?: FindOptions): Promise<T[]>;
  findAll(query?: QueryOptions<T>): Promise<T[]>;
  findOne(filter: FilterOptions<T>, options?: FindOptions): Promise<T | null>;
  
  // Advanced querying
  findWithPagination(
    filter?: FilterOptions<T>, 
    pagination?: PaginationOptions,
    sort?: SortOptions<T>
  ): Promise<PaginatedResult<T>>;
  
  count(filter?: FilterOptions<T>): Promise<number>;
  exists(filter: FilterOptions<T>): Promise<boolean>;
  
  // Bulk operations
  createMany(entities: T[], options?: BulkOptions): Promise<T[]>;
  updateMany(filter: FilterOptions<T>, update: Partial<T>, options?: BulkOptions): Promise<BulkUpdateResult>;
  deleteMany(filter: FilterOptions<T>, options?: BulkOptions): Promise<BulkDeleteResult>;
  
  // CRUD with validation
  create(entity: T, options?: CreateOptions): Promise<T>;
  update(id: TKey, entity: Partial<T>, options?: UpdateOptions): Promise<T | null>;
  upsert(entity: T, options?: UpsertOptions<T>): Promise<T>;
  delete(id: TKey, options?: DeleteOptions): Promise<boolean>;
  
  // Transaction support
  executeInTransaction<R>(operation: (ctx: TransactionContext) => Promise<R>): Promise<R>;
  
  // Analytics and monitoring
  getMetrics(): Promise<RepositoryMetrics>;
  
  // Event handling
  on(event: RepositoryEventType, handler: (event: RepositoryEvent<T>) => void): void;
  off(event: RepositoryEventType, handler: (event: RepositoryEvent<T>) => void): void;
}

/**
 * Advanced query repository for complex search operations
 */
export interface IQueryRepository<T> extends IRepository<T> {
  // Full-text search
  search(query: string, options?: SearchOptions): Promise<SearchResult<T>>;
  
  // Aggregation operations
  aggregate<R>(pipeline: AggregationPipeline): Promise<R[]>;
  
  // Geographic queries
  findNear(coordinates: GeoPoint, radius: number, options?: GeoQueryOptions): Promise<T[]>;
  
  // Time-based queries
  findByDateRange(field: keyof T, start: Date, end: Date, options?: QueryOptions<T>): Promise<T[]>;
  
  // Complex filtering
  findByComplexFilter(filter: ComplexFilter<T>, options?: QueryOptions<T>): Promise<T[]>;
}

/**
 * Caching repository interface
 */
export interface ICachedRepository<T, TKey = UUID> extends IRepository<T, TKey> {
  // Cache operations
  invalidateCache(pattern?: string): Promise<void>;
  warmCache(keys: TKey[]): Promise<void>;
  getCacheStats(): Promise<CacheStats>;
  
  // Cache-specific find operations
  findByIdCached(id: TKey, ttl?: number): Promise<T | null>;
  findAllCached(query?: QueryOptions<T>, ttl?: number): Promise<T[]>;
}

/**
 * Event sourcing repository interface
 */
export interface IEventSourcingRepository<T, TEvent> {
  // Event operations
  appendEvents(streamId: string, events: TEvent[], expectedVersion?: number): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<TEvent[]>;
  
  // Snapshot operations
  saveSnapshot(streamId: string, snapshot: T, version: number): Promise<void>;
  getSnapshot(streamId: string): Promise<EntitySnapshot<T> | null>;
  
  // Projection operations
  rebuildProjection(projectionName: string): Promise<void>;
  getProjectionStatus(projectionName: string): Promise<ProjectionStatus>;
}

// Supporting types
export interface FindOptions {
  include?: string[];
  exclude?: string[];
  useCache?: boolean;
  cacheTtl?: number;
}

export interface CreateOptions {
  validate?: boolean;
  skipHooks?: boolean;
  transaction?: TransactionContext;
}

export interface UpdateOptions extends CreateOptions {
  upsert?: boolean;
  returnOriginal?: boolean;
}

export interface DeleteOptions {
  soft?: boolean;
  skipHooks?: boolean;
  transaction?: TransactionContext;
}

export interface UpsertOptions<T = any> extends CreateOptions {
  conflictField?: keyof T;
}

export interface BulkOptions {
  batchSize?: number;
  continueOnError?: boolean;
  transaction?: TransactionContext;
}

export interface BulkUpdateResult {
  modifiedCount: number;
  matchedCount: number;
  upsertedCount: number;
  upsertedIds: any[];
}

export interface BulkDeleteResult {
  deletedCount: number;
  deletedIds: any[];
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchResult<T> extends PaginatedResult<T> {
  searchTime: number;
  relevanceScore?: number;
  highlights?: SearchHighlight[];
}

export interface SearchHighlight {
  field: string;
  value: string;
  score: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoQueryOptions extends QueryOptions<any> {
  unit?: 'meters' | 'kilometers' | 'miles';
  includeDistance?: boolean;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  evictionCount: number;
  size: number;
  maxSize: number;
}

export interface EntitySnapshot<T> {
  data: T;
  version: number;
  timestamp: Date;
}

export interface ProjectionStatus {
  name: string;
  position: number;
  status: 'running' | 'stopped' | 'faulted';
  lastProcessed: Date;
}

export type RepositoryEventType = 
  | 'entity.created'
  | 'entity.updated'
  | 'entity.deleted'
  | 'query.executed'
  | 'cache.hit'
  | 'cache.miss';

export type AggregationPipeline = Array<Record<string, any>>;
export type ComplexFilter<T> = Record<string, any>;
export type SearchOptions = QueryOptions<any> & {
  fuzzy?: boolean;
  boost?: Record<string, number>;
  highlight?: boolean;
};
