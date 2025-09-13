/** @fileoverview Main entry point for all interfaces. */

// Repository interfaces
export * from './repository.interface';

// Service interfaces (with explicit re-exports to avoid conflicts)
export {
  IService,
  IBusinessService,
  IDomainService,
  ICachedService,
  IEventSourcedService,
  ServiceOptions,
  ServiceResult,
  ServiceError,
  ServiceWarning,
  ServiceResultMetadata,
  PaginatedServiceResult,
  SearchOptions,
  CreateInput,
  UpdateInput,
  InputMetadata,
  BulkUpdateResult as ServiceBulkUpdateResult,
  BulkDeleteResult as ServiceBulkDeleteResult,
  ValidationContext,
  WorkflowInput,
  WorkflowResult,
  WorkflowStep,
  StateChangeContext,
  StateHistoryEntry,
  BusinessRuleContext,
  ApprovalRequest,
  ApprovalDecision,
  ApprovalResult,
  AuditEntry,
  ComplianceFilter,
  ComplianceReport,
  ComplianceSummary,
  ComplianceDetail,
  DateRange,
  ServiceHealthStatus,
  DependencyStatus,
  CacheServiceStats,
  EntitySnapshot,
  ProjectionStatus,
  DomainEvent,
  SagaInput,
  SagaExecution,
  SagaStepResult,
  ServiceEventType
} from './service.interface';

// Controller interfaces (with explicit re-exports to avoid conflicts)
export {
  IController,
  IRestController,
  IGraphQLController,
  IRealTimeController,
  ControllerOptions,
  ControllerQuery,
  ControllerResult,
  ControllerError,
  ControllerWarning,
  ControllerResultMetadata,
  PaginatedControllerResult,
  PaginationLinks,
  SearchControllerOptions,
  BulkUpdateResult as ControllerBulkUpdateResult,
  BulkDeleteResult as ControllerBulkDeleteResult,
  ControllerHealthResult,
  DependencyHealth,
  ControllerMetrics,
  ClientInfo,
  GeoLocation,
  DeviceInfo,
  JsonPatch,
  GraphQLContext,
  GraphQLResolveInfo,
  ConnectionContext,
  ConnectionFilter
} from './controller.interface';

// Analytics interfaces (with explicit re-exports to avoid conflicts)
export {
  IAnalyticsService,
  AnalyticsEvent,
  EventContext,
  MetricsQuery,
  MetricsResult,
  MetricDataPoint,
  MetricSummary,
  KPIResult,
  RealtimeMetrics,
  FunnelConfig,
  FunnelStep,
  FunnelResult,
  FunnelStepResult,
  CohortConfig,
  CohortResult,
  CohortData,
  ExperimentConfig,
  ExperimentVariant,
  Experiment,
  ExperimentResult,
  VariantResult,
  ConfidenceInterval,
  TimePeriod as AnalyticsTimePeriod,
  MetricFilter,
  QueryMetadata,
  DropoffAnalysis,
  MetricsCallback
} from './analytics.interface';

// Security interfaces
export * from './security.interface';

// Integration interfaces
export * from './integration.interface';

// Notification interfaces (with explicit re-exports to avoid conflicts)
export {
  INotificationService,
  NotificationRequest,
  NotificationResult,
  BatchNotificationResult,
  TemplateData,
  NotificationPreferences,
  ChannelPreference,
  QuietHours,
  DeliveryStats,
  ChannelStats,
  TimePeriod as NotificationTimePeriod,
  NotificationType,
  NotificationChannel
} from './notification.interface';
