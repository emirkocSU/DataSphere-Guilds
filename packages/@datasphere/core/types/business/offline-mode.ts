/**
 * @fileoverview Offline Mode Types - Work without internet
 * @version 2.0.0
 * SUPER HIGH-PERFORMANCE | SUPER PROFESSIONAL | SUPER LEAN 
 */

import { UUID, Timestamp } from '../api/common';

// Core Offline Types
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';
export type OfflineCapability = 'full' | 'partial' | 'read_only' | 'none';
export type ConflictResolution = 'server_wins' | 'client_wins' | 'merge' | 'manual' | 'latest_timestamp';
export type StorageType = 'cache' | 'local_storage' | 'indexed_db' | 'memory' | 'persistent';

// Offline Mode System
export interface OfflineMode {
  id: UUID;
  user_id: UUID;
  mode_status: 'enabled' | 'disabled' | 'auto' | 'forced';
  capabilities: OfflineCapabilities;
  storage_config: StorageConfiguration;
  sync_config: SyncConfiguration;
  data_management: DataManagement;
  conflict_resolution: ConflictResolutionConfig;
  performance_metrics: OfflinePerformanceMetrics;
  created_at: Timestamp;
  last_sync: Timestamp;
}

export interface OfflineCapabilities {
  task_management: TaskOfflineCapability;
  content_access: ContentOfflineCapability;
  data_entry: DataEntryCapability;
  media_handling: MediaOfflineCapability;
  communication: CommunicationCapability;
  analytics: AnalyticsCapability;
}

export interface TaskOfflineCapability {
  view_tasks: OfflineCapability;
  claim_tasks: OfflineCapability;
  complete_tasks: OfflineCapability;
  submit_work: OfflineCapability;
  track_progress: OfflineCapability;
  offline_cache_duration: number; // hours
  max_cached_tasks: number;
}

export interface ContentOfflineCapability {
  instructions: OfflineCapability;
  resources: OfflineCapability;
  examples: OfflineCapability;
  guidelines: OfflineCapability;
  help_content: OfflineCapability;
  content_expiry: number; // hours
  auto_download: boolean;
}

export interface DataEntryCapability {
  form_completion: OfflineCapability;
  file_uploads: OfflineCapability;
  data_validation: OfflineCapability;
  auto_save: OfflineCapability;
  draft_management: OfflineCapability;
  validation_cache: boolean;
}

export interface MediaOfflineCapability {
  image_capture: OfflineCapability;
  video_recording: OfflineCapability;
  audio_recording: OfflineCapability;
  media_compression: OfflineCapability;
  thumbnail_generation: OfflineCapability;
  media_storage_limit: number; // mb
}

export interface CommunicationCapability {
  messaging: OfflineCapability;
  notifications: OfflineCapability;
  status_updates: OfflineCapability;
  feedback_submission: OfflineCapability;
  support_requests: OfflineCapability;
  message_queue_size: number;
}

export interface AnalyticsCapability {
  usage_tracking: OfflineCapability;
  performance_metrics: OfflineCapability;
  error_logging: OfflineCapability;
  user_behavior: OfflineCapability;
  data_points_cache: number;
}

// Storage Configuration
export interface StorageConfiguration {
  primary_storage: StorageType;
  fallback_storage: StorageType[];
  storage_limits: StorageLimits;
  data_prioritization: DataPrioritization;
  cleanup_policies: CleanupPolicy[];
  encryption_config: EncryptionConfig;
}

export interface StorageLimits {
  total_limit: number; // mb
  task_data_limit: number; // mb
  media_limit: number; // mb
  cache_limit: number; // mb
  user_data_limit: number; // mb
  analytics_limit: number; // mb
  warning_threshold: number; // percentage
  critical_threshold: number; // percentage
}

export interface DataPrioritization {
  high_priority: DataCategory[];
  medium_priority: DataCategory[];
  low_priority: DataCategory[];
  eviction_strategy: 'lru' | 'fifo' | 'priority_based' | 'usage_based';
  preserve_user_data: boolean;
}

export interface DataCategory {
  category: 'active_tasks' | 'user_profile' | 'completed_work' | 'cached_content' | 'media_files' | 'analytics';
  retention_period: number; // hours
  sync_priority: number;
  compression_enabled: boolean;
}

export interface CleanupPolicy {
  trigger: 'storage_full' | 'time_based' | 'manual' | 'app_background' | 'low_memory';
  action: 'delete_old' | 'compress' | 'move_to_cloud' | 'prompt_user';
  target_categories: string[];
  cleanup_percentage: number;
  preserve_critical: boolean;
}

export interface EncryptionConfig {
  encrypt_sensitive_data: boolean;
  encryption_algorithm: 'aes256' | 'chacha20' | 'xchacha20';
  key_derivation: 'pbkdf2' | 'scrypt' | 'argon2';
  encrypted_categories: string[];
  key_rotation_period: number; // days
}

// Sync Configuration
export interface SyncConfiguration {
  sync_strategy: SyncStrategy;
  sync_triggers: SyncTrigger[];
  sync_priorities: SyncPriority[];
  bandwidth_management: BandwidthManagement;
  conflict_detection: ConflictDetection;
  retry_policies: SyncRetryPolicy[];
}

export interface SyncStrategy {
  strategy_type: 'immediate' | 'batched' | 'scheduled' | 'intelligent' | 'user_triggered';
  batch_size: number;
  batch_interval: number; // minutes
  intelligent_triggers: IntelligentTrigger[];
  user_preferences: UserSyncPreferences;
}

export interface IntelligentTrigger {
  trigger_type: 'wifi_available' | 'battery_sufficient' | 'idle_time' | 'data_age' | 'storage_pressure';
  condition: TriggerCondition;
  priority: number;
  enabled: boolean;
}

export interface TriggerCondition {
  condition_type: string;
  threshold: any;
  duration?: number; // minutes
  evaluation_frequency: number; // minutes
}

export interface UserSyncPreferences {
  auto_sync_wifi: boolean;
  auto_sync_cellular: boolean;
  sync_frequency: 'real_time' | 'hourly' | 'daily' | 'manual';
  data_usage_limit: number; // mb per day
  background_sync: boolean;
  priority_data_only: boolean;
}

export interface SyncTrigger {
  trigger_name: string;
  trigger_event: 'connectivity_restored' | 'app_foreground' | 'user_action' | 'timer' | 'data_threshold';
  enabled: boolean;
  conditions: TriggerCondition[];
  delay: number; // seconds
  max_frequency: number; // per hour
}

export interface SyncPriority {
  data_type: string;
  priority_level: number; // 1-10
  sync_order: number;
  required_bandwidth: number; // kbps
  can_defer: boolean;
  max_defer_time: number; // hours
}

export interface BandwidthManagement {
  connection_type_limits: ConnectionLimit[];
  adaptive_quality: AdaptiveQuality;
  data_compression: CompressionConfig;
  progressive_sync: ProgressiveSync;
}

export interface ConnectionLimit {
  connection_type: 'wifi' | 'cellular' | 'ethernet' | 'satellite';
  max_bandwidth_usage: number; // kbps
  concurrent_transfers: number;
  priority_bandwidth_reserve: number; // percentage
  suspend_on_low_signal: boolean;
}

export interface AdaptiveQuality {
  enabled: boolean;
  quality_levels: QualityLevel[];
  auto_adjustment: boolean;
  user_override_allowed: boolean;
  fallback_strategy: 'reduce_quality' | 'skip_non_essential' | 'queue_for_later';
}

export interface QualityLevel {
  level_name: string;
  bandwidth_threshold: number; // kbps
  compression_ratio: number;
  max_file_size: number; // mb
  skip_media: boolean;
}

export interface CompressionConfig {
  text_compression: boolean;
  image_compression: boolean;
  video_compression: boolean;
  compression_algorithm: 'gzip' | 'brotli' | 'lz4' | 'zstd';
  compression_level: number; // 1-9
}

export interface ProgressiveSync {
  enabled: boolean;
  chunk_size: number; // kb
  chunk_priority: ChunkPriority[];
  resume_capability: boolean;
  checksum_validation: boolean;
}

export interface ChunkPriority {
  chunk_type: 'metadata' | 'content' | 'media' | 'attachments';
  priority: number;
  compression_enabled: boolean;
}

// Data Management
export interface DataManagement {
  offline_data_storage: OfflineDataStorage;
  sync_queue: SyncQueue;
  cache_management: CacheManagement;
  version_control: VersionControl;
  data_integrity: DataIntegrity;
}

export interface OfflineDataStorage {
  stored_entities: StoredEntity[];
  storage_metadata: StorageMetadata;
  access_patterns: AccessPattern[];
  performance_optimization: StorageOptimization;
}

export interface StoredEntity {
  entity_id: UUID;
  entity_type: 'task' | 'user_data' | 'media' | 'cache' | 'analytics';
  data_size: number; // bytes
  created_offline: Timestamp;
  last_modified: Timestamp;
  sync_status: SyncStatus;
  expiry_date?: Timestamp;
  access_count: number;
  priority: number;
}

export interface StorageMetadata {
  total_entities: number;
  total_size: number; // bytes
  storage_utilization: number; // percentage
  fragmentation_level: number; // percentage
  last_cleanup: Timestamp;
  corruption_detected: boolean;
}

export interface AccessPattern {
  entity_type: string;
  access_frequency: number;
  access_recency: Timestamp;
  access_duration: number; // seconds
  user_interaction_level: 'high' | 'medium' | 'low';
}

export interface StorageOptimization {
  compression_enabled: boolean;
  deduplication_enabled: boolean;
  lazy_loading: boolean;
  prefetch_strategy: PrefetchStrategy;
  garbage_collection: GarbageCollection;
}

export interface PrefetchStrategy {
  enabled: boolean;
  prediction_algorithm: 'usage_based' | 'time_based' | 'ml_model' | 'user_pattern';
  prefetch_threshold: number;
  max_prefetch_size: number; // mb
  prefetch_timing: 'idle' | 'background' | 'user_triggered';
}

export interface GarbageCollection {
  auto_gc_enabled: boolean;
  gc_frequency: number; // hours
  gc_triggers: GCTrigger[];
  memory_threshold: number; // percentage
  performance_impact_limit: number; // percentage
}

export interface GCTrigger {
  trigger_type: 'memory_pressure' | 'storage_pressure' | 'time_based' | 'user_inactive';
  threshold: any;
  priority: number;
}

export interface SyncQueue {
  pending_operations: SyncOperation[];
  queue_metadata: QueueMetadata;
  operation_batching: OperationBatching;
  failure_handling: FailureHandling;
}

export interface SyncOperation {
  operation_id: UUID;
  operation_type: 'create' | 'update' | 'delete' | 'upload' | 'download';
  entity_id: UUID;
  entity_type: string;
  data_payload: any;
  operation_size: number; // bytes
  priority: number;
  created_at: Timestamp;
  attempts: number;
  last_attempt?: Timestamp;
  status: SyncStatus;
  error_details?: ErrorDetails;
}

export interface ErrorDetails {
  error_code: string;
  error_message: string;
  error_category: 'network' | 'server' | 'data' | 'permission' | 'storage';
  retry_recommended: boolean;
  retry_delay: number; // seconds
}

export interface QueueMetadata {
  total_operations: number;
  pending_operations: number;
  failed_operations: number;
  queue_size: number; // bytes
  estimated_sync_time: number; // minutes
  oldest_operation_age: number; // hours
}

export interface OperationBatching {
  batch_by_type: boolean;
  batch_by_priority: boolean;
  max_batch_size: number;
  max_batch_operations: number;
  batch_timeout: number; // seconds
  smart_batching: SmartBatching;
}

export interface SmartBatching {
  enabled: boolean;
  dependency_analysis: boolean;
  operation_ordering: boolean;
  conflict_prevention: boolean;
  bandwidth_optimization: boolean;
}

export interface FailureHandling {
  max_retry_attempts: number;
  retry_backoff_strategy: 'linear' | 'exponential' | 'custom';
  retry_intervals: number[]; // seconds
  dead_letter_queue: boolean;
  failure_notification: boolean;
  auto_recovery: AutoRecovery;
}

export interface AutoRecovery {
  enabled: boolean;
  recovery_strategies: RecoveryStrategy[];
  recovery_conditions: RecoveryCondition[];
  max_recovery_attempts: number;
}

export interface RecoveryStrategy {
  strategy_type: 'retry_operation' | 'skip_operation' | 'split_operation' | 'reduce_quality' | 'manual_intervention';
  applicable_errors: string[];
  success_probability: number;
  recovery_cost: number;
}

export interface RecoveryCondition {
  condition_type: 'connectivity_restored' | 'storage_available' | 'user_action' | 'time_elapsed';
  condition_data: any;
  auto_trigger: boolean;
}

export interface CacheManagement {
  cache_policies: CachePolicy[];
  cache_invalidation: CacheInvalidation;
  cache_warming: CacheWarming;
  cache_analytics: CacheAnalytics;
}

export interface CachePolicy {
  cache_name: string;
  cache_type: 'memory' | 'disk' | 'hybrid';
  max_size: number; // mb
  max_age: number; // hours
  eviction_strategy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  compression_enabled: boolean;
  cache_keys: CacheKey[];
}

export interface CacheKey {
  key_pattern: string;
  priority: number;
  access_frequency: number;
  cache_duration: number; // hours
  invalidation_triggers: string[];
}

export interface CacheInvalidation {
  invalidation_strategies: InvalidationStrategy[];
  cascade_invalidation: boolean;
  partial_invalidation: boolean;
  background_refresh: boolean;
}

export interface InvalidationStrategy {
  strategy_type: 'time_based' | 'version_based' | 'dependency_based' | 'user_action';
  trigger_conditions: any[];
  immediate_invalidation: boolean;
  grace_period: number; // minutes
}

export interface CacheWarming {
  enabled: boolean;
  warming_strategies: WarmingStrategy[];
  warming_schedule: WarmingSchedule[];
  predictive_warming: PredictiveWarming;
}

export interface WarmingStrategy {
  strategy_name: string;
  target_content: string[];
  warming_triggers: string[];
  priority: number;
  bandwidth_limit: number; // kbps
}

export interface WarmingSchedule {
  schedule_name: string;
  cron_expression: string;
  content_types: string[];
  max_duration: number; // minutes
  user_activity_based: boolean;
}

export interface PredictiveWarming {
  ml_model_enabled: boolean;
  prediction_accuracy: number;
  prediction_horizon: number; // hours
  confidence_threshold: number;
  user_pattern_analysis: boolean;
}

export interface CacheAnalytics {
  hit_rate: number;
  miss_rate: number;
  eviction_rate: number;
  cache_efficiency: number;
  bandwidth_saved: number; // mb
  response_time_improvement: number; // ms
}

// Version Control & Conflict Resolution
export interface VersionControl {
  versioning_strategy: 'timestamp' | 'vector_clock' | 'sequence_number' | 'hash_based';
  version_metadata: VersionMetadata[];
  merge_strategies: MergeStrategy[];
  conflict_tracking: ConflictTracking;
}

export interface VersionMetadata {
  entity_id: UUID;
  version_id: string;
  created_at: Timestamp;
  created_by: UUID;
  device_id: string;
  change_type: 'create' | 'update' | 'delete';
  field_changes: FieldChange[];
  parent_version?: string;
}

export interface FieldChange {
  field_name: string;
  old_value: any;
  new_value: any;
  change_type: 'add' | 'modify' | 'remove';
  timestamp: Timestamp;
}

export interface MergeStrategy {
  strategy_name: string;
  applicable_entity_types: string[];
  field_level_merge: boolean;
  automatic_resolution: boolean;
  user_intervention_required: boolean;
  merge_rules: MergeRule[];
}

export interface MergeRule {
  field_pattern: string;
  resolution_strategy: ConflictResolution;
  priority: number;
  conditions: MergeCondition[];
}

export interface MergeCondition {
  condition_type: 'field_type' | 'value_comparison' | 'timestamp' | 'user_role' | 'device_type';
  condition_data: any;
  weight: number;
}

export interface ConflictTracking {
  active_conflicts: DataConflict[];
  resolved_conflicts: ResolvedConflict[];
  conflict_statistics: ConflictStatistics;
}

export interface DataConflict {
  conflict_id: UUID;
  entity_id: UUID;
  entity_type: string;
  conflict_type: 'content' | 'version' | 'permission' | 'schema';
  local_version: any;
  server_version: any;
  conflict_fields: string[];
  created_at: Timestamp;
  resolution_options: ResolutionOption[];
  auto_resolvable: boolean;
}

export interface ResolutionOption {
  option_id: string;
  option_type: ConflictResolution;
  description: string;
  impact_assessment: ImpactAssessment;
  recommended: boolean;
}

export interface ImpactAssessment {
  data_loss_risk: 'none' | 'low' | 'medium' | 'high';
  affected_entities: number;
  rollback_complexity: 'easy' | 'moderate' | 'difficult';
  user_experience_impact: string;
}

export interface ResolvedConflict {
  conflict_id: UUID;
  resolution_method: ConflictResolution;
  resolved_at: Timestamp;
  resolved_by: UUID;
  resolution_data: any;
  user_satisfaction?: number;
}

export interface ConflictStatistics {
  total_conflicts: number;
  auto_resolved: number;
  manual_resolved: number;
  resolution_time_avg: number; // minutes
  resolution_accuracy: number;
  user_intervention_rate: number;
}

export interface ConflictResolutionConfig {
  default_strategy: ConflictResolution;
  field_specific_strategies: FieldStrategy[];
  user_preference_weight: number;
  automatic_resolution_threshold: number;
  escalation_rules: EscalationRule[];
}

export interface FieldStrategy {
  field_pattern: string;
  strategy: ConflictResolution;
  confidence_threshold: number;
  user_confirmation_required: boolean;
}

export interface EscalationRule {
  escalation_trigger: 'timeout' | 'complexity' | 'user_request' | 'critical_data';
  escalation_action: 'notify_user' | 'admin_review' | 'expert_consultation' | 'rollback';
  escalation_delay: number; // hours
}

export interface DataIntegrity {
  integrity_checks: IntegrityCheck[];
  corruption_detection: CorruptionDetection;
  repair_mechanisms: RepairMechanism[];
  backup_recovery: BackupRecovery;
}

export interface IntegrityCheck {
  check_type: 'checksum' | 'schema_validation' | 'relationship_consistency' | 'business_rules';
  frequency: 'on_access' | 'periodic' | 'on_sync' | 'user_triggered';
  check_scope: 'full' | 'incremental' | 'critical_only';
  performance_impact: 'low' | 'medium' | 'high';
}

export interface CorruptionDetection {
  detection_methods: DetectionMethod[];
  early_warning_system: boolean;
  automated_reporting: boolean;
  quarantine_corrupted_data: boolean;
}

export interface DetectionMethod {
  method_type: 'hash_validation' | 'format_checking' | 'dependency_validation' | 'anomaly_detection';
  sensitivity: number;
  false_positive_rate: number;
  detection_accuracy: number;
}

export interface RepairMechanism {
  repair_type: 'auto_repair' | 'guided_repair' | 'manual_repair' | 'data_reconstruction';
  applicable_corruption_types: string[];
  success_rate: number;
  data_recovery_percentage: number;
  repair_time_estimate: number; // minutes
}

export interface BackupRecovery {
  backup_frequency: number; // hours
  backup_retention: number; // days
  incremental_backup: boolean;
  point_in_time_recovery: boolean;
  recovery_testing: boolean;
  recovery_metrics: RecoveryMetrics;
}

export interface RecoveryMetrics {
  recovery_time_objective: number; // hours
  recovery_point_objective: number; // hours
  data_loss_tolerance: number; // percentage
  availability_target: number; // percentage
}

// Performance Metrics
export interface OfflinePerformanceMetrics {
  storage_metrics: StoragePerformanceMetrics;
  sync_metrics: SyncPerformanceMetrics;
  user_experience_metrics: UXMetrics;
  reliability_metrics: ReliabilityMetrics;
  efficiency_metrics: EfficiencyMetrics;
}

export interface StoragePerformanceMetrics {
  read_latency: number; // ms
  write_latency: number; // ms
  storage_efficiency: number; // percentage
  compression_ratio: number;
  cache_hit_rate: number; // percentage
  storage_fragmentation: number; // percentage
}

export interface SyncPerformanceMetrics {
  sync_success_rate: number; // percentage
  average_sync_time: number; // seconds
  sync_throughput: number; // mb/s
  conflict_rate: number; // percentage
  data_consistency_score: number;
  bandwidth_utilization: number; // percentage
}

export interface UXMetrics {
  offline_mode_availability: number; // percentage
  data_access_speed: number; // ms
  user_satisfaction_score: number;
  feature_completion_rate: number; // percentage
  error_recovery_success: number; // percentage
}

export interface ReliabilityMetrics {
  data_durability: number; // percentage
  corruption_rate: number; // per million operations
  recovery_success_rate: number; // percentage
  uptime_percentage: number;
  mean_time_between_failures: number; // hours
}

export interface EfficiencyMetrics {
  battery_usage_impact: number; // percentage
  memory_footprint: number; // mb
  cpu_usage_percentage: number;
  network_data_savings: number; // mb
  storage_space_savings: number; // mb
}

// Request/Response Types
export interface EnableOfflineModeRequest {
  user_id: UUID;
  capabilities: Partial<OfflineCapabilities>;
  storage_preferences: Partial<StorageConfiguration>;
  sync_preferences: Partial<SyncConfiguration>;
}

export interface SyncDataRequest {
  data_types?: string[];
  priority_only?: boolean;
  force_sync?: boolean;
  conflict_resolution_preference?: ConflictResolution;
}

export interface ResolveConflictRequest {
  conflict_id: UUID;
  resolution_method: ConflictResolution;
  custom_resolution_data?: any;
  apply_to_similar?: boolean;
}

export interface OfflineStorageRequest {
  entity_type: string;
  entity_ids?: UUID[];
  storage_duration?: number; // hours
  priority?: number;
  encryption_required?: boolean;
}

// Filter Parameters
export interface OfflineDataFilterParams {
  entity_type?: string;
  sync_status?: SyncStatus;
  created_after?: Timestamp;
  created_before?: Timestamp;
  size_min?: number; // bytes
  size_max?: number; // bytes
  priority_min?: number;
  access_frequency_min?: number;
  offline_capable?: boolean;
  has_conflicts?: boolean;
  sort_by?: 'created_at' | 'last_modified' | 'size' | 'priority' | 'access_count';
  sort_order?: 'asc' | 'desc';
}