/** @fileoverview Enterprise service interfaces with comprehensive business logic capabilities. */

import { UUID } from '../types/common.types';
import { PaginationOptions, FilterOptions, SortOptions } from '../types/query/query.types';
import { TransactionContext } from '../types/database/transaction.types';
import { ServiceMetrics, ServiceEvent } from '../types/service/service.types';
import { ValidationResult } from '../types/validation/validation.types';

/**
 * Advanced service interface with comprehensive business logic support
 */
export interface IService<T, TKey = UUID> {
  // Basic CRUD operations with enhanced capabilities
  getById(id: TKey, options?: ServiceOptions): Promise<ServiceResult<T>>;
  getByIds(ids: TKey[], options?: ServiceOptions): Promise<ServiceResult<T[]>>;
  getAll(filter?: FilterOptions<T>, options?: ServiceOptions): Promise<ServiceResult<T[]>>;
  
  // Advanced querying
  findWithPagination(
    filter?: FilterOptions<T>,
    pagination?: PaginationOptions,
    sort?: SortOptions<T>,
    options?: ServiceOptions
  ): Promise<ServiceResult<PaginatedServiceResult<T>>>;
  
  search(query: string, options?: SearchOptions): Promise<ServiceResult<T[]>>;
  count(filter?: FilterOptions<T>): Promise<ServiceResult<number>>;
  exists(filter: FilterOptions<T>): Promise<ServiceResult<boolean>>;
  
  // CRUD with business validation
  create(data: CreateInput<T>, options?: ServiceOptions): Promise<ServiceResult<T>>;
  createMany(data: CreateInput<T>[], options?: ServiceOptions): Promise<ServiceResult<T[]>>;
  
  update(id: TKey, data: UpdateInput<T>, options?: ServiceOptions): Promise<ServiceResult<T>>;
  updateMany(filter: FilterOptions<T>, data: UpdateInput<T>, options?: ServiceOptions): Promise<ServiceResult<BulkUpdateResult>>;
  
  remove(id: TKey, options?: ServiceOptions): Promise<ServiceResult<boolean>>;
  removeMany(filter: FilterOptions<T>, options?: ServiceOptions): Promise<ServiceResult<BulkDeleteResult>>;
  
  // Soft delete operations
  softDelete(id: TKey, options?: ServiceOptions): Promise<ServiceResult<boolean>>;
  restore(id: TKey, options?: ServiceOptions): Promise<ServiceResult<boolean>>;
  
  // Transaction support
  executeInTransaction<R>(operation: (ctx: TransactionContext) => Promise<R>): Promise<ServiceResult<R>>;
  
  // Business rule validation
  validate(data: Partial<T>, context?: ValidationContext): Promise<ValidationResult>;
  
  // Event handling
  on(event: ServiceEventType, handler: (event: ServiceEvent<T>) => void): void;
  off(event: ServiceEventType, handler: (event: ServiceEvent<T>) => void): void;
  
  // Analytics and monitoring
  getMetrics(): Promise<ServiceMetrics>;
  getHealth(): Promise<ServiceHealthStatus>;
}

/**
 * Advanced business service interface for complex domain operations
 */
export interface IBusinessService<T, TKey = UUID> extends IService<T, TKey> {
  // Business workflow operations
  executeWorkflow(workflowId: string, input: WorkflowInput<T>): Promise<ServiceResult<WorkflowResult<T>>>;
  
  // State management
  changeState(id: TKey, newState: string, context?: StateChangeContext): Promise<ServiceResult<T>>;
  getStateHistory(id: TKey): Promise<ServiceResult<StateHistoryEntry[]>>;
  
  // Business rules engine
  applyBusinessRules(data: T, ruleContext?: BusinessRuleContext): Promise<ServiceResult<T>>;
  validateBusinessRules(data: T, ruleContext?: BusinessRuleContext): Promise<ValidationResult>;
  
  // Approval workflows
  submitForApproval(id: TKey, approvalType: string): Promise<ServiceResult<ApprovalRequest>>;
  approve(approvalId: UUID, decision: ApprovalDecision): Promise<ServiceResult<ApprovalResult>>;
  
  // Audit and compliance
  getAuditTrail(id: TKey): Promise<ServiceResult<AuditEntry[]>>;
  generateComplianceReport(filter?: ComplianceFilter): Promise<ServiceResult<ComplianceReport>>;
}

/**
 * Domain service interface for aggregate operations
 */
export interface IDomainService<TAggregate, TKey = UUID> {
  // Aggregate operations
  loadAggregate(id: TKey): Promise<ServiceResult<TAggregate>>;
  saveAggregate(aggregate: TAggregate): Promise<ServiceResult<TAggregate>>;
  
  // Domain event handling
  publishDomainEvent(event: DomainEvent): Promise<void>;
  handleDomainEvent(event: DomainEvent): Promise<void>;
  
  // Saga orchestration
  startSaga(sagaType: string, input: SagaInput): Promise<ServiceResult<SagaExecution>>;
  continueSaga(sagaId: UUID, stepResult: SagaStepResult): Promise<ServiceResult<SagaExecution>>;
}

/**
 * Cache-aware service interface
 */
export interface ICachedService<T, TKey = UUID> extends IService<T, TKey> {
  // Cache operations
  invalidateCache(pattern?: string): Promise<void>;
  warmCache(keys: TKey[]): Promise<void>;
  getCacheStats(): Promise<CacheServiceStats>;
  
  // Cache-specific operations
  getFromCache(id: TKey): Promise<ServiceResult<T>>;
  preloadCache(filter?: FilterOptions<T>): Promise<void>;
}

/**
 * Event-sourced service interface
 */
export interface IEventSourcedService<T, TEvent> {
  // Event sourcing operations
  appendEvents(streamId: string, events: TEvent[]): Promise<ServiceResult<void>>;
  getEvents(streamId: string, fromVersion?: number): Promise<ServiceResult<TEvent[]>>;
  
  // Snapshot operations
  saveSnapshot(streamId: string, snapshot: T): Promise<ServiceResult<void>>;
  getSnapshot(streamId: string): Promise<ServiceResult<EntitySnapshot<T>>>;
  
  // Projection management
  rebuildProjection(projectionName: string): Promise<ServiceResult<void>>;
  getProjectionStatus(projectionName: string): Promise<ServiceResult<ProjectionStatus>>;
}

// Supporting types and interfaces
export interface ServiceOptions {
  includeDeleted?: boolean;
  useCache?: boolean;
  cacheTtl?: number;
  validateInput?: boolean;
  skipBusinessRules?: boolean;
  transaction?: TransactionContext;
  userId?: UUID;
  context?: Record<string, any>;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  warnings?: ServiceWarning[];
  metadata?: ServiceResultMetadata;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  innerError?: Error;
}

export interface ServiceWarning {
  code: string;
  message: string;
  field?: string;
}

export interface ServiceResultMetadata {
  executionTime?: number;
  cacheHit?: boolean;
  version?: number;
  etag?: string;
}

export interface PaginatedServiceResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchOptions extends ServiceOptions {
  fuzzy?: boolean;
  boost?: Record<string, number>;
  highlight?: boolean;
  facets?: string[];
}

export interface CreateInput<T> extends Partial<T> {
  __metadata?: InputMetadata;
}

export interface UpdateInput<T> extends Partial<T> {
  __metadata?: InputMetadata;
  __version?: number;
}

export interface InputMetadata {
  source?: string;
  userId?: UUID;
  timestamp?: Date;
  correlation?: string;
}

export interface BulkUpdateResult {
  modifiedCount: number;
  matchedCount: number;
  errors?: ServiceError[];
}

export interface BulkDeleteResult {
  deletedCount: number;
  errors?: ServiceError[];
}

export interface ValidationContext {
  userId?: UUID;
  source?: string;
  businessContext?: Record<string, any>;
}

export interface WorkflowInput<T> {
  data: T;
  parameters?: Record<string, any>;
  context?: Record<string, any>;
}

export interface WorkflowResult<T> {
  success: boolean;
  data?: T;
  state: string;
  nextSteps?: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  required: boolean;
  parameters?: Record<string, any>;
}

export interface StateChangeContext {
  userId?: UUID;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface StateHistoryEntry {
  fromState: string;
  toState: string;
  timestamp: Date;
  userId?: UUID;
  reason?: string;
}

export interface BusinessRuleContext {
  userId?: UUID;
  businessUnit?: string;
  effectiveDate?: Date;
  metadata?: Record<string, any>;
}

export interface ApprovalRequest {
  id: UUID;
  type: string;
  status: string;
  requesterId: UUID;
  createdAt: Date;
  dueDate?: Date;
}

export interface ApprovalDecision {
  approved: boolean;
  comments?: string;
  conditions?: string[];
}

export interface ApprovalResult {
  approved: boolean;
  finalDecision: boolean;
  nextApprovers?: UUID[];
  completedAt: Date;
}

export interface AuditEntry {
  id: UUID;
  entityId: UUID;
  action: string;
  userId?: UUID;
  timestamp: Date;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ComplianceFilter {
  startDate?: Date;
  endDate?: Date;
  entityType?: string;
  userId?: UUID;
  action?: string;
}

export interface ComplianceReport {
  summary: ComplianceSummary;
  details: ComplianceDetail[];
  generatedAt: Date;
  periodCovered: DateRange;
}

export interface ComplianceSummary {
  totalActions: number;
  compliantActions: number;
  nonCompliantActions: number;
  riskScore: number;
}

export interface ComplianceDetail {
  entityId: UUID;
  action: string;
  compliant: boolean;
  riskLevel: string;
  issues?: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ServiceHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  dependencies: DependencyStatus[];
  lastHealthCheck: Date;
}

export interface DependencyStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastCheck: Date;
}

export interface CacheServiceStats {
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
  errors?: string[];
}

export interface DomainEvent {
  id: UUID;
  aggregateId: UUID;
  aggregateType: string;
  eventType: string;
  eventData: Record<string, any>;
  version: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SagaInput {
  data: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface SagaExecution {
  id: UUID;
  sagaType: string;
  status: string;
  currentStep: string;
  completedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface SagaStepResult {
  stepId: string;
  success: boolean;
  output?: Record<string, any>;
  error?: string;
}

export type ServiceEventType = 
  | 'entity.created'
  | 'entity.updated'
  | 'entity.deleted'
  | 'workflow.started'
  | 'workflow.completed'
  | 'approval.requested'
  | 'approval.decided'
  | 'state.changed'
  | 'validation.failed';
