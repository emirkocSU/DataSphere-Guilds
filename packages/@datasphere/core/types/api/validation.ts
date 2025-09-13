/**
 * @fileoverview LEAN Validation API Types - Enterprise DataSphere Guilds
 * @version 2.0.0
 * PRODUCTION READY | ULTRA PERFORMANCE | MINIMAL BUNDLE
 */

import { UUID, Timestamp, KeyValuePair } from './common';
import { TaskDomain } from './tasks';

// Core Validation Types
export type ValidationType = 'required' | 'email' | 'phone' | 'url' | 'regex' | 'length' | 'range' | 'custom';
export type ValidationSeverity = 'error' | 'warning' | 'info';
export type DataType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'file';

// Schema Definition
export interface ValidationSchema {
  id: UUID;
  name: string;
  version: string;
  domain: TaskDomain;
  fields: FieldValidation[];
  rules: CrossFieldRule[];
  isActive: boolean;
  createdBy: UUID;
  createdAt: Timestamp;
}

export interface FieldValidation {
  path: string;
  type: DataType;
  required: boolean;
  rules: ValidationRule[];
  dependencies?: string[];
  conditional?: { field: string; value: any; operator: '==' | '!=' | '>' | '<' | 'in' | 'contains' };
}

export interface ValidationRule {
  type: ValidationType;
  severity: ValidationSeverity;
  params: KeyValuePair;
  message: string;
  code: string;
}

export interface CrossFieldRule {
  name: string;
  fields: string[];
  condition: string;
  message: string;
  severity: ValidationSeverity;
}

// Validation Results
export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  metadata: {
    schemaId: UUID;
    schemaVersion: string;
    validatedAt: Timestamp;
    duration: number;
  };
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  severity: ValidationSeverity;
  value?: any;
  expected?: any;
  path: string;
}

// Data Quality Assessment
export interface QualityAssessment {
  dataId: UUID;
  schemaId: UUID;
  overallScore: number;
  dimensions: QualityDimension[];
  issues: QualityIssue[];
  recommendations: string[];
  assessedAt: Timestamp;
}

export interface QualityDimension {
  name: 'completeness' | 'accuracy' | 'consistency' | 'validity' | 'uniqueness' | 'timeliness';
  score: number;
  weight: number;
  details: KeyValuePair;
}

export interface QualityIssue {
  type: 'missing_required' | 'invalid_format' | 'out_of_range' | 'duplicate' | 'inconsistent' | 'outdated';
  severity: ValidationSeverity;
  field: string;
  description: string;
  suggestions: string[];
  impact: number;
}

// Real-time Validation
export interface ValidationConfig {
  id: UUID;
  name: string;
  schemaId: UUID;
  realTime: boolean;
  async: boolean;
  timeout: number;
  retryPolicy: { maxAttempts: number; backoffMs: number };
  notifications: { onError: boolean; onWarning: boolean; recipients: UUID[] };
}

export interface ValidationJob {
  id: UUID;
  configId: UUID;
  dataId: UUID;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: ValidationResult;
  error?: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}

// Custom Validators
export interface CustomValidator {
  id: UUID;
  name: string;
  description: string;
  code: string;
  language: 'javascript' | 'python' | 'sql';
  parameters: Array<{ name: string; type: DataType; required: boolean }>;
  testCases: Array<{ input: KeyValuePair; expected: boolean; description: string }>;
  isActive: boolean;
  createdBy: UUID;
}

export interface ValidatorExecution {
  validatorId: UUID;
  input: KeyValuePair;
  output: { isValid: boolean; message?: string; data?: KeyValuePair };
  duration: number;
  timestamp: Timestamp;
}

// Batch Validation
export interface BatchValidationRequest {
  schemaId: UUID;
  data: KeyValuePair[];
  options: {
    stopOnFirstError: boolean;
    skipWarnings: boolean;
    parallel: boolean;
    maxConcurrency?: number;
  };
}

export interface BatchValidationResult {
  jobId: UUID;
  total: number;
  valid: number;
  invalid: number;
  warnings: number;
  results: Array<{ index: number; result: ValidationResult }>;
  summary: {
    commonErrors: Array<{ code: string; count: number }>;
    qualityScore: number;
    duration: number;
  };
}

// Request/Response Types
export interface CreateSchemaRequest {
  name: string;
  domain: TaskDomain;
  fields: Omit<FieldValidation, 'path'>[];
  rules?: Omit<CrossFieldRule, 'name'>[];
}

export interface UpdateSchemaRequest {
  name?: string;
  fields?: Omit<FieldValidation, 'path'>[];
  rules?: Omit<CrossFieldRule, 'name'>[];
  isActive?: boolean;
}

export interface ValidateDataRequest {
  schemaId: UUID;
  data: KeyValuePair;
  options?: {
    skipWarnings?: boolean;
    includeMetadata?: boolean;
    async?: boolean;
  };
}

export interface CreateValidatorRequest {
  name: string;
  description: string;
  code: string;
  language: CustomValidator['language'];
  parameters: CustomValidator['parameters'];
  testCases: CustomValidator['testCases'];
}

// Filter Parameters
export interface SchemaFilterParams {
  domain?: TaskDomain;
  isActive?: boolean;
  createdBy?: UUID;
  version?: string;
  sortBy?: 'name' | 'createdAt' | 'version';
  sortOrder?: 'asc' | 'desc';
}

export interface ValidationJobFilterParams {
  configId?: UUID;
  status?: ValidationJob['status'];
  startDate?: Timestamp;
  endDate?: Timestamp;
  sortBy?: 'startedAt' | 'completedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Analytics
export interface ValidationMetrics {
  schemaId: UUID;
  period: { start: Timestamp; end: Timestamp };
  stats: {
    totalValidations: number;
    successRate: number;
    avgDuration: number;
    topErrors: Array<{ code: string; count: number; percentage: number }>;
  };
  trends: Array<{ date: string; validations: number; errors: number }>;
  qualityTrend: Array<{ date: string; score: number }>;
}

export interface ValidationInsights {
  dataQualityScore: number;
  improvements: Array<{ field: string; impact: number; suggestion: string }>;
  patterns: Array<{ pattern: string; frequency: number; severity: ValidationSeverity }>;
  predictions: { qualityTrend: 'improving' | 'stable' | 'declining'; confidence: number };
}

// Compliance & Standards
export interface ComplianceRule {
  id: UUID;
  name: string;
  standard: 'gdpr' | 'hipaa' | 'pci_dss' | 'sox' | 'custom';
  description: string;
  validator: string;
  severity: ValidationSeverity;
  isActive: boolean;
}

export interface ComplianceReport {
  schemaId: UUID;
  standard: ComplianceRule['standard'];
  compliance: number;
  violations: Array<{ rule: string; count: number; severity: ValidationSeverity }>;
  recommendations: string[];
  generatedAt: Timestamp;
}

// Missing type definitions
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'custom' | 'local';

export interface SensorDataValidation {
  gps: { accuracy: number; bounds: [number, number, number, number] };
  image: { minResolution: [number, number]; maxSizeMB: number };
  audio: { sampleRate: number; duration: [number, number] };
  environmental: { temperatureRange: [number, number]; humidityRange: [number, number] };
}

export interface TaskSubmissionValidation {
  completeness: { requiredFields: string[]; minCompletionRate: number };
  quality: { minScore: number; reviewRequired: boolean };
  format: { allowedTypes: string[]; maxSize: number };
}

export interface QCDataValidation {
  reviewerCount: { min: number; max: number };
  consensusThreshold: number;
  qualityGates: { field: string; threshold: number }[];
}

export interface WorkerPerformanceValidation {
  accuracy: { minimum: number; target: number };
  throughput: { minimum: number; target: number };
  consistency: { varianceThreshold: number };
}

export interface TriggerCondition {
  field: string;
  operator: '>' | '<' | '==' | '!=' | 'contains';
  value: any;
  action: 'alert' | 'stop' | 'escalate';
}

export interface AlertThreshold {
  metric: string;
  threshold: number;
  severity: ValidationSeverity;
  recipients: UUID[];
}

export interface AIValidationConfig {
  enabled: boolean;
  providers: AIProvider[];
  fallbackToRules: boolean;
  confidenceThreshold: number;
  costOptimization: boolean;
}

export interface DataSphereValidationExtensions {
  sensorData: SensorDataValidation;
  taskSubmissions: TaskSubmissionValidation;
  qualityControlData: QCDataValidation;
  workerPerformance: WorkerPerformanceValidation;
}

export interface StreamingValidationConfig {
  bufferSize: number;
  windowDuration: number;
  triggerConditions: TriggerCondition[];
  alertThresholds: AlertThreshold[];
}