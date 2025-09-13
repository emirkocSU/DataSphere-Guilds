/**
 * @fileoverview Main entry point for all core types.
 * This file uses explicit re-exports to prevent name collisions.
 */

// Common Primitives
export type { UUID, ISOTimestamp, Percentage, Money, Coordinates } from './common.types';

// AI & ML
export type { AIModel, ModelType, InferenceRequest, InferenceResponse, TrainingJob, AIProviderConfig } from './ai';

// Analytics
export type { Metric, MetricType, Dashboard, ReportRequest, ReportStatus } from './analytics';

// API Contracts
export type { PaymentRequest as ApiPaymentRequest, PaymentResponse as ApiPaymentResponse } from './api';

// Appeals Workflow - UPDATED FOR V3 NAMESPACES
export type { Appeal, Evidence, Decision, AuditLog, CreateAppealRequest, AddEvidenceRequest, MakeDecisionRequest, UpdateAppealRequest } from './appeals/core.types';
export type { AppealWorkflow, StateMachine, WorkflowStats, StateTransition, DecisionMatrix } from './appeals/workflow.types';
export type { EvidenceStore, EvidenceStream, BatchEvidence, EvidenceHeader, EvidenceContent } from './appeals/evidence.types';
export type { Decision as DecisionRecord, DecisionEngine, ReasoningMatrix, ImpactVector, DecisionContext } from './appeals/decision.types';

// Audit & Logging
export type { AuditEvent, UserActivity, ComplianceReport as AuditComplianceReport, DataLineageNode } from './audit';

// Authentication & Authorization
export type { OAuthToken, MfaChallenge, BiometricAuth, UserSession, TokenRotationPolicy, DeviceTrustRecord } from './auth';

// Business Logic
export type { UserProfile, UserRole, WorkerStats, Task, TaskStatus, Payment, QCResult, ReputationScore, MarketplaceListing } from './business';

// Cache
export type { CacheMetrics, CacheStrategy } from './cache';

// Domain-Specific Models
export * from './domain';

// Gamification
export type { Achievement, Challenge } from './gamification';

// Gateway
export type { Route as GatewayRoute, Upstream, Target as GatewayTarget } from './gateway';

// Geographic Distribution
export type { CurrencyConversionResult, DataResidencyPolicy } from './geo';

// Health Monitoring
export type { HealthCheckResult, SystemMetrics as SystemMetric, AlertRule, DiagnosticTest } from './health';

// Internationalization (i18n)
export type { LocaleConfig, TranslationResource as Translation, NumberFormatOptions as CurrencyLocalization } from './i18n';

// Infrastructure
export type { AbstractDatabaseConfig as DatabaseConfig, QueueConfig, StorageConfig, MonitoringAlertConfig as MonitoringConfig } from './infrastructure';

// Background Jobs
export type { JobProcessor } from './jobs';

// Ledger & Earnings
export type { GeneralLedgerEntry as LedgerEntry, AccountBalance, TransactionRecord, PayoutRequest } from './ledger';

// Migration
export type { SchemaMigration, DataMigrationJob as DataMigration, MigrationHistory as VersionRecord, RollbackStrategy as RollbackPlan } from './migration';

// Machine Learning (extended)
export type { MLPipeline, ModelTrainingConfig, ModelDeploymentConfig, ModelMonitoringConfig } from './ml';

// Notifications
export type { NotificationTemplate, EmailRequest, SmsRequest, InAppNotification } from './notifications';

// Platform Support
export type { MobileCapabilities, WebCapabilities, DesktopCapabilities, PlatformType } from './platform';

// QC Pipeline
export type { OnDeviceCheckType, AiValidatorConfig, PeerReview, GoldStandardTask, HoneypotTask } from './qc-pipeline';

// Rate Limiting
export type { ThrottlingConfig, QuotaPolicy, AbusePattern } from './rate-limiting';

// Real-time & WebSocket
export type { WebSocketMessage, RealtimeEvent, EventSubscription, SyncStatus } from './realtime';

// Search & Indexing
export type { SearchQuery, SearchResult } from './search';

// Security
export type { EncryptionKey, DataPrivacyPolicy as SecurityComplianceReport } from './security';

// File Upload & Storage - UPDATED
export type { UploadSession, ChunkUpload, UploadStatus } from './storage/upload.types';
export type { CdnManager, CdnStorage, EdgeNode } from './storage/cdn.types';
export type { StorageProvider, StorageProviderConfig } from './storage/storage-providers.types';

// Data Synchronization
export type { SyncSession, SyncConflict, SyncConflictResolutionStrategy } from './sync';

// Webhooks - UPDATED
export type { WebhookEndpoint, WebhookEvent, DeliveryAttempt, DeliveryStatus } from './webhooks/webhook.types';
export type { EventSubscription as WebhookSubscription } from './webhooks/event-subscription.types'; 