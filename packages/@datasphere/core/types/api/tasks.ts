/**
 * =====================================================================================
 * @datasphere/core - Task Management API Types
 * =====================================================================================
 * 
 * Enterprise-grade task management type definitions for DataSphere Guilds
 * Supporting complex workflows, quality control, and distributed processing
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @license MIT
 * 
 * Task Features:
 * - Complex task lifecycle management
 * - Multi-stage quality control pipeline
 * - Distributed task processing
 * - Real-time task monitoring
 * - Task dependencies and workflows
 * - Performance optimization
 * - Resource allocation and scaling
 * - Task analytics and insights
 * - Automated task routing
 * - SLA monitoring and compliance
 * =====================================================================================
 */

import {
  UUID,
  ISOTimestamp,
  Percentage,
  PositiveInt,
  BaseRequest,
  BaseResponse,
  PaginationParams,
  FilterParams,
  SortOrder,
  Priority,
  Status
} from './common';

// ============================= TASK ENUMS =============================

/**
 * Task status enumeration
 */
export enum TaskStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  QUALITY_CHECK = 'quality_check',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUESTED = 'revision_requested',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  FAILED = 'failed',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

/**
 * Task complexity levels
 */
export enum TaskComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  EXPERT = 'expert',
  SPECIALIST = 'specialist'
}

/**
 * Task category enumeration
 */
export enum TaskCategory {
  DATA_COLLECTION = 'data_collection',
  DATA_ANNOTATION = 'data_annotation',
  DATA_VALIDATION = 'data_validation',
  IMAGE_LABELING = 'image_labeling',
  TEXT_ANALYSIS = 'text_analysis',
  AUDIO_TRANSCRIPTION = 'audio_transcription',
  VIDEO_ANALYSIS = 'video_analysis',
  QUALITY_CONTROL = 'quality_control',
  RESEARCH = 'research',
  TRANSLATION = 'translation',
  CONTENT_MODERATION = 'content_moderation',
  SURVEY = 'survey',
  VERIFICATION = 'verification',
  CUSTOM = 'custom'
}

/**
 * Task type enumeration
 */
export enum TaskType {
  SINGLE = 'single',
  BATCH = 'batch',
  RECURRING = 'recurring',
  TEMPLATE = 'template',
  WORKFLOW = 'workflow',
  MICRO = 'micro',
  MACRO = 'macro',
  COLLABORATIVE = 'collaborative',
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel'
}

/**
 * Task assignment type
 */
export enum AssignmentType {
  MANUAL = 'manual',
  AUTO = 'auto',
  FIRST_COME_FIRST_SERVE = 'fcfs',
  SKILL_BASED = 'skill_based',
  PERFORMANCE_BASED = 'performance_based',
  LOAD_BALANCED = 'load_balanced',
  GEOGRAPHIC = 'geographic',
  SPECIALIZED = 'specialized'
}

/**
 * Quality control stage
 */
export enum QualityStage {
  PEER_REVIEW = 'peer_review',
  EXPERT_REVIEW = 'expert_review',
  AUTOMATED = 'automated',
  STATISTICAL = 'statistical',
  AI_ASSISTED = 'ai_assisted',
  CROWD_VALIDATION = 'crowd_validation',
  SUPERVISOR_REVIEW = 'supervisor_review',
  FINAL_CHECK = 'final_check'
}

// ============================= CORE TASK TYPES =============================

/**
 * Core task interface
 */
export interface Task {
  id: UUID;
  title: string;
  description: string;
  category: TaskCategory;
  type: TaskType;
  priority: Priority;
  complexity: TaskComplexity;
  status: TaskStatus;
  
  // Ownership & Assignment
  createdBy: UUID;
  assignedTo?: UUID[];
  reviewedBy?: UUID[];
  approvedBy?: UUID;
  
  // Timing
  estimatedDuration: number;
  actualDuration?: number;
  deadline?: ISOTimestamp;
  startedAt?: ISOTimestamp;
  completedAt?: ISOTimestamp;
  
  // Configuration
  requirements: TaskRequirements;
  deliverables: TaskDeliverable[];
  budget: TaskBudget;
  workflow: TaskWorkflow;
  qualityControl: QualityControlConfig;
  
  // Metrics & Analytics
  metrics: TaskMetrics;
  analytics: TaskAnalytics;
  
  // Metadata
  tags: string[];
  labels: Record<string, string>;
  customFields: Record<string, any>;
  
  // System fields
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  version: number;
  archived: boolean;
}

/**
 * Task requirements specification
 */
export interface TaskRequirements {
  skills: SkillRequirement[];
  certifications: CertificationRequirement[];
  experience: ExperienceRequirement;
  equipment: EquipmentRequirement[];
  location: LocationRequirement;
  availability: AvailabilityRequirement;
  language: LanguageRequirement[];
  security: SecurityRequirement;
  performance: PerformanceRequirement;
  legal: LegalRequirement;
}

/**
 * Skill requirement specification
 */
export interface SkillRequirement {
  skillId: UUID;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  required: boolean;
  weight: number;
  certificationRequired?: boolean;
  yearsOfExperience?: number;
  assessment?: boolean;
  alternatives?: UUID[];
}

/**
 * Certification requirement
 */
export interface CertificationRequirement {
  certificationId: UUID;
  name: string;
  issuer: string;
  required: boolean;
  level?: string;
  validUntil?: ISOTimestamp;
  renewalRequired?: boolean;
  alternatives?: UUID[];
}

/**
 * Experience requirement
 */
export interface ExperienceRequirement {
  minimumYears: number;
  preferredYears: number;
  domainExperience: string[];
  previousTasksCompleted: number;
  successRate: Percentage;
  averageRating: number;
  portfolioRequired: boolean;
  referencesRequired: boolean;
}

/**
 * Equipment requirement
 */
export interface EquipmentRequirement {
  type: 'hardware' | 'software' | 'tool' | 'sensor' | 'device' | 'platform';
  name: string;
  specification: string;
  version?: string;
  required: boolean;
  provided: boolean;
  cost?: number;
  alternatives?: string[];
}

/**
 * Location requirement
 */
export interface LocationRequirement {
  type: 'remote' | 'onsite' | 'hybrid' | 'specific' | 'restricted';
  allowedCountries: string[];
  allowedRegions: string[];
  allowedCities: string[];
  blockedCountries: string[];
  blockedRegions: string[];
  timezones: string[];
  coordinates?: GeographicCoordinate;
  radius?: number;
  travelRequired?: boolean;
}

/**
 * Geographic coordinate
 */
export interface GeographicCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Availability requirement
 */
export interface AvailabilityRequirement {
  hoursPerDay: number;
  daysPerWeek: number;
  timeZone: string;
  workingHours: WorkingHours;
  immediateStart: boolean;
  flexibleSchedule: boolean;
  overlap: TimeOverlap[];
  blackoutDates: DateRange[];
}

/**
 * Working hours specification
 */
export interface WorkingHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

/**
 * Time slot
 */
export interface TimeSlot {
  startTime: string;
  endTime: string;
  timezone: string;
  breaks?: TimeSlot[];
}

/**
 * Time overlap requirement
 */
export interface TimeOverlap {
  timezone: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  minimumHours: number;
}

/**
 * Date range
 */
export interface DateRange {
  startDate: ISOTimestamp;
  endDate: ISOTimestamp;
  reason?: string;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

/**
 * Language requirement
 */
export interface LanguageRequirement {
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  required: boolean;
  weight: number;
  dialect?: string;
  reading: boolean;
  writing: boolean;
  speaking: boolean;
  listening: boolean;
}

/**
 * Security requirement
 */
export interface SecurityRequirement {
  clearanceLevel: 'public' | 'internal' | 'confidential' | 'secret' | 'top_secret';
  backgroundCheck: boolean;
  ndaRequired: boolean;
  complianceRequired: string[];
  dataClassification: string;
  geographicRestrictions: string[];
  accessControls: string[];
  auditingRequired: boolean;
}

/**
 * Performance requirement
 */
export interface PerformanceRequirement {
  accuracy: Percentage;
  speed: number;
  throughput: number;
  qualityScore: Percentage;
  errorRate: Percentage;
  responseTime: number;
  availability: Percentage;
  sla: SLARequirement;
}

/**
 * SLA requirement
 */
export interface SLARequirement {
  responseTime: number;
  completionTime: number;
  qualityThreshold: Percentage;
  availabilityTarget: Percentage;
  penaltyClause: boolean;
  escalationProcedure: boolean;
  reportingFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

/**
 * Legal requirement
 */
export interface LegalRequirement {
  jurisdiction: string[];
  compliance: string[];
  licenses: string[];
  insurance: string[];
  liability: string;
  dataProtection: string[];
  intellectualProperty: string;
  contractTerms: string[];
}

// ============================= TASK DELIVERABLES =============================

/**
 * Task deliverable definition
 */
export interface TaskDeliverable {
  id: UUID;
  name: string;
  description: string;
  type: DeliverableType;
  format: string[];
  size: FileSizeLimit;
  quantity: QuantityRequirement;
  quality: QualityRequirement;
  validation: ValidationRule[];
  processing: ProcessingRule[];
  storage: StorageRequirement;
  versioning: VersioningConfig;
  deadline?: ISOTimestamp;
  priority: Priority;
  dependencies: UUID[];
  metadata: Record<string, any>;
}

/**
 * Deliverable type enumeration
 */
export enum DeliverableType {
  FILE = 'file',
  DATA = 'data',
  DOCUMENT = 'document',
  REPORT = 'report',
  ANNOTATION = 'annotation',
  TRANSCRIPT = 'transcript',
  TRANSLATION = 'translation',
  ANALYSIS = 'analysis',
  MEDIA = 'media',
  CODE = 'code',
  MODEL = 'model',
  DATASET = 'dataset',
  CUSTOM = 'custom'
}

/**
 * File size limit configuration
 */
export interface FileSizeLimit {
  min: number;
  max: number;
  unit: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB';
  compression: boolean;
  allowedFormats: string[];
  blockedFormats: string[];
}

/**
 * Quantity requirement specification
 */
export interface QuantityRequirement {
  min: number;
  max: number;
  target: number;
  unit: string;
  flexible: boolean;
  bonus?: BonusRule;
  penalty?: PenaltyRule;
}

/**
 * Quality requirement specification
 */
export interface QualityRequirement {
  accuracy: Percentage;
  completeness: Percentage;
  consistency: Percentage;
  relevance: Percentage;
  timeliness: Percentage;
  format: string;
  standards: string[];
  validation: boolean;
  benchmarks: QualityBenchmark[];
}

/**
 * Quality benchmark
 */
export interface QualityBenchmark {
  metric: string;
  threshold: number;
  weight: number;
  required: boolean;
  measurement: 'automatic' | 'manual' | 'hybrid';
}

/**
 * Validation rule definition
 */
export interface ValidationRule {
  id: UUID;
  name: string;
  type: 'format' | 'content' | 'structure' | 'semantic' | 'custom';
  condition: string;
  parameters: Record<string, any>;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  enabled: boolean;
  weight: number;
}

/**
 * Processing rule definition
 */
export interface ProcessingRule {
  id: UUID;
  type: 'validation' | 'transformation' | 'enrichment' | 'analysis' | 'custom';
  processor: string;
  parameters: Record<string, any>;
  order: number;
  enabled: boolean;
  retryPolicy: RetryPolicy;
  timeout: number;
}

/**
 * Storage requirement specification
 */
export interface StorageRequirement {
  location: 'local' | 'cloud' | 'hybrid' | 'distributed';
  provider: string;
  region: string[];
  redundancy: number;
  backup: boolean;
  retention: number;
  encryption: boolean;
  compression: boolean;
  access: 'public' | 'private' | 'restricted';
}

/**
 * Versioning configuration
 */
export interface VersioningConfig {
  enabled: boolean;
  strategy: 'semantic' | 'timestamp' | 'incremental' | 'hash' | 'custom';
  retention: number;
  branching: boolean;
  merging: boolean;
  conflicts: 'reject' | 'manual' | 'auto';
  approval: boolean;
}

// ============================= TASK BUDGET & PAYMENTS =============================

/**
 * Task budget configuration
 */
export interface TaskBudget {
  totalAmount: number;
  currency: string;
  paymentStructure: PaymentStructure;
  milestones: MilestonePayment[];
  bonuses: BonusRule[];
  penalties: PenaltyRule[];
  escrow: EscrowConfig;
  taxation: TaxationConfig;
  invoicing: InvoicingConfig;
}

/**
 * Payment structure options
 */
export interface PaymentStructure {
  type: 'fixed' | 'hourly' | 'per_unit' | 'milestone' | 'performance' | 'hybrid';
  baseRate: number;
  minimumPayment: number;
  maximumPayment: number;
  performanceMultiplier?: number;
  qualityThreshold?: Percentage;
  volumeDiscounts: VolumeDiscount[];
  paymentSchedule: PaymentSchedule;
}

/**
 * Volume discount configuration
 */
export interface VolumeDiscount {
  threshold: number;
  discount: Percentage;
  type: 'percentage' | 'fixed' | 'tier';
  cumulative: boolean;
}

/**
 * Payment schedule
 */
export interface PaymentSchedule {
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'milestone' | 'completion';
  terms: number;
  advancePayment: Percentage;
  holdbackPercentage: Percentage;
  holdbackPeriod: number;
}

/**
 * Milestone payment configuration
 */
export interface MilestonePayment {
  id: UUID;
  name: string;
  description: string;
  amount: number;
  percentage: Percentage;
  criteria: string[];
  dueDate?: ISOTimestamp;
  dependencies: UUID[];
  approvalRequired: boolean;
  completed: boolean;
  completedAt?: ISOTimestamp;
  approvedAt?: ISOTimestamp;
}

/**
 * Bonus rule configuration
 */
export interface BonusRule {
  id: UUID;
  name: string;
  type: 'quality' | 'speed' | 'accuracy' | 'volume' | 'innovation' | 'early_completion';
  threshold: number;
  amount: number;
  percentage?: Percentage;
  description: string;
  conditions: BonusCondition[];
  cumulative: boolean;
  maximum?: number;
}

/**
 * Bonus condition
 */
export interface BonusCondition {
  field: string;
  operator: 'equals' | 'greater' | 'less' | 'between' | 'in' | 'custom';
  value: any;
  weight: number;
  required: boolean;
}

/**
 * Penalty rule configuration
 */
export interface PenaltyRule {
  id: UUID;
  name: string;
  type: 'late' | 'quality' | 'incomplete' | 'violation' | 'no_show' | 'revision';
  threshold: number;
  amount: number;
  percentage?: Percentage;
  description: string;
  conditions: PenaltyCondition[];
  grace: number;
  maximum?: number;
  escalation: boolean;
}

/**
 * Penalty condition
 */
export interface PenaltyCondition {
  field: string;
  operator: 'equals' | 'greater' | 'less' | 'between' | 'in' | 'custom';
  value: any;
  weight: number;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
}

/**
 * Escrow configuration
 */
export interface EscrowConfig {
  enabled: boolean;
  provider: string;
  releaseConditions: string[];
  disputeResolution: string;
  fees: EscrowFees;
  insurance: boolean;
  currency: string;
  minimumAmount: number;
}

/**
 * Escrow fees
 */
export interface EscrowFees {
  setup: number;
  transaction: Percentage;
  dispute: number;
  currency: string;
  paidBy: 'client' | 'worker' | 'shared';
}

/**
 * Taxation configuration
 */
export interface TaxationConfig {
  applicable: boolean;
  jurisdiction: string;
  rate: Percentage;
  type: 'income' | 'sales' | 'service' | 'withholding';
  exemptions: string[];
  reporting: boolean;
  forms: string[];
}

/**
 * Invoicing configuration
 */
export interface InvoicingConfig {
  automatic: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly' | 'milestone';
  template: string;
  currency: string;
  language: string;
  terms: number;
  lateFees: boolean;
  discounts: boolean;
}

// ============================= TASK WORKFLOW =============================

/**
 * Task workflow configuration
 */
export interface TaskWorkflow {
  id: UUID;
  name: string;
  version: string;
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
  rules: WorkflowRule[];
  automation: WorkflowAutomation;
  notifications: WorkflowNotification[];
  sla: WorkflowSLA;
  rollback: RollbackConfig;
  monitoring: WorkflowMonitoring;
}

/**
 * Workflow stage definition
 */
export interface WorkflowStage {
  id: UUID;
  name: string;
  description: string;
  type: 'start' | 'task' | 'review' | 'approval' | 'quality' | 'payment' | 'end';
  assignee: AssigneeConfig;
  estimatedDuration: number;
  requirements: StageRequirement[];
  deliverables: UUID[];
  actions: WorkflowAction[];
  parallel: boolean;
  optional: boolean;
  retryable: boolean;
  timeout: number;
  escalation: EscalationConfig;
}

/**
 * Assignee configuration
 */
export interface AssigneeConfig {
  type: 'user' | 'role' | 'group' | 'pool' | 'auto' | 'external';
  id?: UUID;
  criteria: AssignmentCriteria;
  backup?: UUID[];
  rotation: boolean;
  loadBalance: boolean;
}

/**
 * Assignment criteria
 */
export interface AssignmentCriteria {
  skills: string[];
  experience: number;
  rating: number;
  availability: number;
  workload: number;
  location: string[];
  timezone: string[];
  language: string[];
  certification: string[];
  custom: Record<string, any>;
}

/**
 * Stage requirement
 */
export interface StageRequirement {
  type: 'approval' | 'validation' | 'review' | 'payment' | 'notification' | 'custom';
  condition: string;
  parameters: Record<string, any>;
  required: boolean;
  weight: number;
}

/**
 * Workflow action
 */
export interface WorkflowAction {
  id: UUID;
  type: 'approve' | 'reject' | 'request_changes' | 'escalate' | 'reassign' | 'notify' | 'custom';
  label: string;
  description: string;
  icon?: string;
  color?: string;
  requiresComment: boolean;
  requiresReason: boolean;
  permissions: string[];
  conditions: ActionCondition[];
  automation: boolean;
  webhook?: string;
}

/**
 * Action condition
 */
export interface ActionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less' | 'in' | 'custom';
  value: any;
  logicalOperator?: 'and' | 'or';
  weight: number;
}

/**
 * Workflow transition definition
 */
export interface WorkflowTransition {
  id: UUID;
  from: UUID;
  to: UUID;
  condition: string;
  action?: string;
  automatic: boolean;
  requiresApproval: boolean;
  approver?: UUID;
  timeout?: number;
  probability?: Percentage;
  weight: number;
}

/**
 * Workflow rule definition
 */
export interface WorkflowRule {
  id: UUID;
  name: string;
  description: string;
  type: 'business' | 'validation' | 'automation' | 'notification' | 'escalation';
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  schedule?: string;
  metadata: Record<string, any>;
}

/**
 * Workflow automation configuration
 */
export interface WorkflowAutomation {
  enabled: boolean;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  schedule: AutomationSchedule;
  monitoring: boolean;
  rollback: boolean;
}

/**
 * Automation trigger definition
 */
export interface AutomationTrigger {
  id: UUID;
  type: 'time' | 'event' | 'condition' | 'webhook' | 'manual' | 'scheduled';
  condition: string;
  parameters: Record<string, any>;
  enabled: boolean;
  priority: number;
  throttle?: number;
  retry?: RetryPolicy;
}

/**
 * Automation action definition
 */
export interface AutomationAction {
  id: UUID;
  type: 'assign' | 'notify' | 'escalate' | 'approve' | 'reject' | 'move' | 'custom';
  target: string;
  parameters: Record<string, any>;
  enabled: boolean;
  async: boolean;
  retry?: RetryPolicy;
  rollback?: RollbackConfig;
}

/**
 * Automation condition
 */
export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less' | 'in' | 'custom';
  value: any;
  logicalOperator?: 'and' | 'or';
  weight: number;
  timeout?: number;
}

/**
 * Automation schedule
 */
export interface AutomationSchedule {
  enabled: boolean;
  frequency: 'continuous' | 'interval' | 'cron' | 'event' | 'manual';
  interval?: number;
  cron?: string;
  timezone: string;
  start?: ISOTimestamp;
  end?: ISOTimestamp;
  maxRuns?: number;
}

/**
 * Workflow notification configuration
 */
export interface WorkflowNotification {
  id: UUID;
  name: string;
  trigger: string;
  recipients: NotificationRecipient[];
  template: string;
  channels: NotificationChannel[];
  delay?: number;
  enabled: boolean;
  conditions: NotificationCondition[];
  personalization: boolean;
  tracking: boolean;
}

/**
 * Notification recipient
 */
export interface NotificationRecipient {
  type: 'user' | 'role' | 'group' | 'external' | 'webhook';
  id: string;
  fallback?: string;
  preferences?: Record<string, any>;
}

/**
 * Notification channel
 */
export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'teams' | 'custom';
  config: Record<string, any>;
  priority: number;
  enabled: boolean;
  fallback?: string;
}

/**
 * Notification condition
 */
export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less' | 'in' | 'custom';
  value: any;
  logicalOperator?: 'and' | 'or';
  weight: number;
}

/**
 * Workflow SLA configuration
 */
export interface WorkflowSLA {
  enabled: boolean;
  totalDuration: number;
  stageDeadlines: Record<string, number>;
  escalationRules: EscalationRule[];
  penaltyRules: PenaltyRule[];
  alerts: SLAAlert[];
  monitoring: boolean;
  reporting: boolean;
}

/**
 * Escalation rule definition
 */
export interface EscalationRule {
  id: UUID;
  name: string;
  condition: string;
  delay: number;
  escalateTo: UUID;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  enabled: boolean;
  repeat: boolean;
  maxRepeat?: number;
}

/**
 * Escalation configuration
 */
export interface EscalationConfig {
  enabled: boolean;
  threshold: number;
  delay: number;
  escalateTo: UUID;
  actions: string[];
  notifications: boolean;
  automatic: boolean;
}

/**
 * SLA alert configuration
 */
export interface SLAAlert {
  id: UUID;
  name: string;
  threshold: number;
  recipients: string[];
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
  repeat: boolean;
  cooldown: number;
}

/**
 * Rollback configuration
 */
export interface RollbackConfig {
  enabled: boolean;
  strategy: 'manual' | 'automatic' | 'conditional';
  conditions: string[];
  preserve: string[];
  notifications: boolean;
  approval: boolean;
  timeout: number;
}

/**
 * Workflow monitoring
 */
export interface WorkflowMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: boolean;
  logging: boolean;
  analytics: boolean;
  realtime: boolean;
  retention: number;
}

/**
 * Retry policy
 */
export interface RetryPolicy {
  enabled: boolean;
  maxRetries: number;
  delay: number;
  backoff: 'linear' | 'exponential' | 'fixed';
  multiplier: number;
  maxDelay: number;
  jitter: boolean;
}

// ============================= QUALITY CONTROL =============================

/**
 * Quality control configuration
 */
export interface QualityControlConfig {
  enabled: boolean;
  stages: QualityControlStage[];
  criteria: QualityCriteria[];
  reviewers: QualityReviewer[];
  automation: QualityAutomation;
  metrics: QualityMetrics;
  feedback: QualityFeedback;
  appeals: QualityAppeals;
  certification: QualityCertification;
}

/**
 * Quality control stage definition
 */
export interface QualityControlStage {
  id: UUID;
  name: string;
  type: QualityStage;
  required: boolean;
  order: number;
  criteria: UUID[];
  threshold: Percentage;
  reviewers: number;
  consensus: Percentage;
  timeout: number;
  automated: boolean;
  fallback: string;
  escalation: EscalationConfig;
}

/**
 * Quality criteria definition
 */
export interface QualityCriteria {
  id: UUID;
  name: string;
  description: string;
  type: 'accuracy' | 'completeness' | 'consistency' | 'relevance' | 'timeliness' | 'format' | 'custom';
  weight: number;
  threshold: Percentage;
  measurement: 'binary' | 'scale' | 'percentage' | 'custom';
  validation: ValidationRule[];
  benchmarks: string[];
  references: string[];
}

/**
 * Quality reviewer configuration
 */
export interface QualityReviewer {
  id: UUID;
  userId: UUID;
  role: 'peer' | 'expert' | 'supervisor' | 'ai' | 'external';
  specialization: string[];
  weight: number;
  capacity: number;
  availability: AvailabilityRequirement;
  performance: ReviewerPerformance;
  certification: string[];
  trustLevel: number;
}

/**
 * Reviewer performance metrics
 */
export interface ReviewerPerformance {
  accuracy: Percentage;
  speed: number;
  consistency: Percentage;
  reliability: Percentage;
  totalReviews: number;
  averageTime: number;
  agreementRate: Percentage;
  escalationRate: Percentage;
  rating: number;
}

/**
 * Quality automation configuration
 */
export interface QualityAutomation {
  enabled: boolean;
  aiAssisted: boolean;
  preScreening: boolean;
  postProcessing: boolean;
  anomalyDetection: boolean;
  qualityPrediction: boolean;
  autoApproval: boolean;
  thresholds: Record<string, number>;
  models: string[];
  fallback: string;
}

/**
 * Quality metrics tracking
 */
export interface QualityMetrics {
  overallScore: Percentage;
  criteriaScores: Record<string, number>;
  reviewerScores: Record<string, number>;
  timeToReview: number;
  revisionCount: number;
  passRate: Percentage;
  defectRate: Percentage;
  customerSatisfaction: Percentage;
  trends: QualityTrend[];
}

/**
 * Quality trend
 */
export interface QualityTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: Percentage;
}

/**
 * Quality feedback system
 */
export interface QualityFeedback {
  enabled: boolean;
  realTime: boolean;
  aggregated: boolean;
  anonymous: boolean;
  categories: FeedbackCategory[];
  templates: string[];
  routing: FeedbackRouting;
  analytics: boolean;
  actionable: boolean;
}

/**
 * Feedback category
 */
export interface FeedbackCategory {
  id: UUID;
  name: string;
  description: string;
  type: 'rating' | 'comment' | 'suggestion' | 'issue' | 'compliment';
  weight: number;
  required: boolean;
  options: FeedbackOption[];
  validation: ValidationRule[];
}

/**
 * Feedback option
 */
export interface FeedbackOption {
  id: UUID;
  label: string;
  value: any;
  description: string;
  icon?: string;
  color?: string;
  weight: number;
}

/**
 * Feedback routing
 */
export interface FeedbackRouting {
  immediate: boolean;
  batched: boolean;
  threshold: number;
  escalation: boolean;
  distribution: FeedbackDistribution[];
  retention: number;
  anonymization: boolean;
}

/**
 * Feedback distribution
 */
export interface FeedbackDistribution {
  recipient: string;
  type: 'worker' | 'reviewer' | 'manager' | 'client' | 'system';
  condition: string;
  delay?: number;
  format: 'summary' | 'detailed' | 'raw';
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
}

/**
 * Quality appeals system
 */
export interface QualityAppeals {
  enabled: boolean;
  timeLimit: number;
  reviewers: UUID[];
  process: AppealProcess;
  escalation: EscalationConfig;
  tracking: boolean;
  reporting: boolean;
}

/**
 * Appeal process
 */
export interface AppealProcess {
  stages: AppealStage[];
  evidence: boolean;
  hearing: boolean;
  decision: 'binding' | 'advisory' | 'recommended';
  timeline: number;
  costs: boolean;
}

/**
 * Appeal stage
 */
export interface AppealStage {
  id: UUID;
  name: string;
  type: 'review' | 'hearing' | 'decision' | 'implementation';
  duration: number;
  participants: string[];
  requirements: string[];
  outputs: string[];
}

/**
 * Quality certification
 */
export interface QualityCertification {
  enabled: boolean;
  standards: string[];
  audits: boolean;
  compliance: boolean;
  accreditation: string[];
  reporting: boolean;
  improvement: boolean;
}

// ============================= ANALYTICS & METRICS =============================

/**
 * Task metrics
 */
export interface TaskMetrics {
  performance: PerformanceMetrics;
  quality: QualityMetrics;
  efficiency: EfficiencyMetrics;
  cost: CostMetrics;
  timeline: TimelineMetrics;
  resources: ResourceMetrics;
  satisfaction: SatisfactionMetrics;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  completionRate: Percentage;
  successRate: Percentage;
  errorRate: Percentage;
  throughput: number;
  capacity: number;
  utilization: Percentage;
  bottlenecks: string[];
  optimization: OptimizationMetrics;
}

/**
 * Optimization metrics
 */
export interface OptimizationMetrics {
  potential: Percentage;
  implemented: Percentage;
  impact: number;
  cost: number;
  roi: number;
  timeline: number;
  recommendations: string[];
}

/**
 * Efficiency metrics
 */
export interface EfficiencyMetrics {
  productivity: number;
  resourceUtilization: Percentage;
  automation: Percentage;
  waste: number;
  optimization: Percentage;
  benchmarks: EfficiencyBenchmark[];
}

/**
 * Efficiency benchmark
 */
export interface EfficiencyBenchmark {
  metric: string;
  value: number;
  benchmark: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
  target: number;
}

/**
 * Cost metrics
 */
export interface CostMetrics {
  budgetUtilization: Percentage;
  costPerUnit: number;
  totalCost: number;
  overruns: number;
  savings: number;
  roi: number;
  breakdown: CostBreakdown[];
}

/**
 * Cost breakdown
 */
export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: Percentage;
  variance: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Timeline metrics
 */
export interface TimelineMetrics {
  plannedDuration: number;
  actualDuration: number;
  variance: number;
  onTimeDelivery: Percentage;
  delays: DelayMetrics[];
  acceleration: AccelerationMetrics[];
}

/**
 * Delay metrics
 */
export interface DelayMetrics {
  stage: string;
  delay: number;
  reason: string;
  impact: number;
  mitigation: string;
  frequency: number;
}

/**
 * Acceleration metrics
 */
export interface AccelerationMetrics {
  stage: string;
  acceleration: number;
  reason: string;
  impact: number;
  sustainability: boolean;
  replication: boolean;
}

/**
 * Resource metrics
 */
export interface ResourceMetrics {
  allocation: ResourceAllocation[];
  utilization: Percentage;
  availability: Percentage;
  conflicts: number;
  optimization: Percentage;
  forecasting: ResourceForecast[];
}

/**
 * Resource allocation
 */
export interface ResourceAllocation {
  resource: string;
  allocated: number;
  used: number;
  available: number;
  efficiency: Percentage;
  cost: number;
}

/**
 * Resource forecast
 */
export interface ResourceForecast {
  resource: string;
  period: string;
  demand: number;
  supply: number;
  gap: number;
  confidence: Percentage;
  recommendations: string[];
}

/**
 * Satisfaction metrics
 */
export interface SatisfactionMetrics {
  client: Percentage;
  worker: Percentage;
  reviewer: Percentage;
  overall: Percentage;
  nps: number;
  retention: Percentage;
  feedback: FeedbackMetrics;
}

/**
 * Feedback metrics
 */
export interface FeedbackMetrics {
  volume: number;
  sentiment: number;
  categories: Record<string, number>;
  actionable: Percentage;
  resolved: Percentage;
  responsiveness: number;
}

/**
 * Task analytics
 */
export interface TaskAnalytics {
  enabled: boolean;
  realTime: boolean;
  historical: boolean;
  predictive: boolean;
  prescriptive: boolean;
  dashboards: string[];
  reports: string[];
  alerts: AnalyticsAlert[];
  insights: AnalyticsInsight[];
}

/**
 * Analytics alert
 */
export interface AnalyticsAlert {
  id: UUID;
  name: string;
  condition: string;
  threshold: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
  recipients: string[];
  channels: string[];
  enabled: boolean;
  frequency: string;
}

/**
 * Analytics insight
 */
export interface AnalyticsInsight {
  id: UUID;
  type: 'pattern' | 'anomaly' | 'trend' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: Percentage;
  impact: number;
  priority: Priority;
  actionable: boolean;
  actions: string[];
  timeline: string;
  createdAt: ISOTimestamp;
}

// ============================= EXPORTS =============================

export * from './task-requests';
export * from './task-responses';
export * from './task-events';
export * from './task-utils';
export * from './task-constants'; 