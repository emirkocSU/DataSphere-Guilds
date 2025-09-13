/**
 * @fileoverview Advanced controller interfaces for unicorn-scale API operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../types/common.types';
import { PaginationOptions, FilterOptions, SortOptions } from '../types/query/query.types';
import { ValidationResult } from '../types/validation/validation.types';

export interface IController<TRequest, TResponse, TKey = UUID> {
  // Enhanced CRUD operations
  get(id: TKey, options?: ControllerOptions): Promise<ControllerResult<TResponse>>;
  getMany(ids: TKey[], options?: ControllerOptions): Promise<ControllerResult<TResponse[]>>;
  list(query?: ControllerQuery<TResponse>, options?: ControllerOptions): Promise<ControllerResult<TResponse[]>>;
  
  // Paginated queries
  listWithPagination(
    query?: ControllerQuery<TResponse>,
    pagination?: PaginationOptions,
    options?: ControllerOptions
  ): Promise<ControllerResult<PaginatedControllerResult<TResponse>>>;
  
  // CRUD with validation
  create(request: TRequest, options?: ControllerOptions): Promise<ControllerResult<TResponse>>;
  createMany(requests: TRequest[], options?: ControllerOptions): Promise<ControllerResult<TResponse[]>>;
  
  update(id: TKey, request: Partial<TRequest>, options?: ControllerOptions): Promise<ControllerResult<TResponse>>;
  updateMany(
    filter: FilterOptions<TResponse>, 
    request: Partial<TRequest>, 
    options?: ControllerOptions
  ): Promise<ControllerResult<BulkUpdateResult>>;
  
  delete(id: TKey, options?: ControllerOptions): Promise<ControllerResult<void>>;
  deleteMany(filter: FilterOptions<TResponse>, options?: ControllerOptions): Promise<ControllerResult<BulkDeleteResult>>;
  
  // Search and filtering
  search(query: string, options?: SearchControllerOptions): Promise<ControllerResult<TResponse[]>>;
  count(filter?: FilterOptions<TResponse>): Promise<ControllerResult<number>>;
  exists(filter: FilterOptions<TResponse>): Promise<ControllerResult<boolean>>;
  
  // Validation
  validate(request: TRequest, options?: ControllerOptions): Promise<ValidationResult>;
  
  // Health and metrics
  health(): Promise<ControllerHealthResult>;
  metrics(): Promise<ControllerMetrics>;
}

export interface IRestController<TRequest, TResponse, TKey = UUID> extends IController<TRequest, TResponse, TKey> {
  // HTTP-specific operations
  head(id: TKey): Promise<ControllerResult<void>>;
  options(): Promise<ControllerResult<ControllerOptions>>;
  patch(id: TKey, patches: JsonPatch[]): Promise<ControllerResult<TResponse>>;
}

export interface IGraphQLController<TRequest, TResponse> {
  // GraphQL-specific operations
  resolve(parent: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo): Promise<TResponse>;
  subscribe(parent: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo): AsyncIterator<TResponse>;
}

export interface IRealTimeController<TRequest, TResponse> {
  // WebSocket/SSE operations
  onConnect(connectionId: string, context: ConnectionContext): Promise<void>;
  onDisconnect(connectionId: string): Promise<void>;
  onMessage(connectionId: string, message: TRequest): Promise<void>;
  broadcast(message: TResponse, filter?: ConnectionFilter): Promise<void>;
}

// Supporting types
export interface ControllerOptions {
  userId?: UUID;
  requestId?: string;
  clientInfo?: ClientInfo;
  headers?: Record<string, string>;
  skipValidation?: boolean;
  skipAuth?: boolean;
  useCache?: boolean;
  cacheTtl?: number;
}

export interface ControllerQuery<T> {
  filter?: FilterOptions<T>;
  sort?: SortOptions<T>;
  include?: string[];
  exclude?: string[];
}

export interface ControllerResult<T> {
  success: boolean;
  data?: T;
  error?: ControllerError;
  warnings?: ControllerWarning[];
  metadata?: ControllerResultMetadata;
}

export interface ControllerError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
  httpStatus?: number;
}

export interface ControllerWarning {
  code: string;
  message: string;
  field?: string;
}

export interface ControllerResultMetadata {
  executionTime?: number;
  requestId?: string;
  version?: string;
  etag?: string;
  lastModified?: Date;
  cacheHit?: boolean;
}

export interface PaginatedControllerResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  links?: PaginationLinks;
}

export interface PaginationLinks {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
}

export interface SearchControllerOptions extends ControllerOptions {
  fuzzy?: boolean;
  highlight?: boolean;
  facets?: string[];
  boost?: Record<string, number>;
}

export interface BulkUpdateResult {
  modifiedCount: number;
  matchedCount: number;
  errors?: ControllerError[];
}

export interface BulkDeleteResult {
  deletedCount: number;
  errors?: ControllerError[];
}

export interface ControllerHealthResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  dependencies?: DependencyHealth[];
}

export interface DependencyHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastCheck: Date;
}

export interface ControllerMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate?: number;
  activeConnections?: number;
}

export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  location?: GeoLocation;
  device?: DeviceInfo;
}

export interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet' | 'bot';
  os?: string;
  browser?: string;
}

export interface JsonPatch {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: any;
  from?: string;
}

export interface GraphQLContext {
  userId?: UUID;
  headers?: Record<string, string>;
  dataSources?: Record<string, any>;
}

export interface GraphQLResolveInfo {
  fieldName: string;
  fieldNodes: any[];
  returnType: any;
  parentType: any;
  path: any;
  schema: any;
  fragments: Record<string, any>;
  rootValue: any;
  operation: any;
  variableValues: Record<string, any>;
}

export interface ConnectionContext {
  userId?: UUID;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  remoteAddress?: string;
}

export interface ConnectionFilter {
  userIds?: UUID[];
  rooms?: string[];
  exclude?: string[];
  condition?: (connectionId: string, context: ConnectionContext) => boolean;
}
