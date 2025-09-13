/**
 * @file Defines the comprehensive, enterprise-grade data structures for the "Instant Setup" feature.
 * @module @datasphere/core/types/business/instant-setup
 * @description This architectural blueprint provides all type definitions for a sophisticated, template-driven
 * project provisioning system. It covers the entire lifecycle, from template creation and dynamic UI rendering
 * to granular resource provisioning, detailed auditing, and robust error handling. This file is designed to be
 * the single source of truth for the Instant Setup domain, ensuring scalability and maintainability for a
 * unicorn-level platform.
 * @version 2.0.0
 * @author DataSphere Engineering Team (Architected for Opus-level standards)
 * @see {@link https://datasphereguilds.com/docs/architecture/instant-setup-v2} for detailed architecture.
 */

import { UUID, CurrencyCode, CountryCode } from '../api/common';

// Define missing types locally to avoid import errors
export type TUserID = UUID;
export type TProjectID = UUID;
export type TOrganizationID = UUID;
export type TCurrencyCode = CurrencyCode;
export type TCountryCode = CountryCode;

// Quality Control types
export type TQualityControlPipelineID = string;
export interface IQualityControlPipelineConfiguration {
  id: string;
  name: string;
  rules: any[];
}

// Task types
export interface ITaskDefinition {
  id: string;
  name: string;
  description: string;
  type: string;
}
export type TTaskID = string;

// Sensor types
export interface ISensorDeviceRequirements {
  gps: boolean;
  camera: boolean;
  microphone: boolean;
}

// Worker types
export interface IWorkerSegment {
  id: string;
  name: string;
  qualifications: string[];
}
export type TWorkerProfileID = UUID;

// Payment types
export type TPaymentStrategy = 'fixed' | 'dynamic' | 'performance';
export interface ITransactionDetails {
  id: string;
  amount: number;
  currency: TCurrencyCode;
}

// --- ENUMERATIONS & CONTROLLED VOCABULARIES ---

/** Unique identifier for an Instant Setup Template. */
export type TTemplateID = string & { readonly __brand: 'TemplateID' };

/** Unique identifier for a specific instance of a setup process. */
export type TSetupInstanceID = string & { readonly __brand: 'SetupInstanceID' };

/**
 * Defines the lifecycle status of an Instant Setup Template.
 */
export enum EInstantSetupTemplateLifecycleStatus {
  /** The template is under development and not visible to users. */
  DRAFT = 'DRAFT',
  /** The template has been reviewed, approved, and is available for use. */
  PUBLISHED = 'PUBLISHED',
  /** The template is a featured template, highlighted in the UI. */
  FEATURED = 'FEATURED',
  /** The template has been replaced by a newer version but is still available for legacy projects. */
  DEPRECATED = 'DEPRECATED',
  /** The template is no longer in use and is hidden from all users. */
  ARCHIVED = 'ARCHIVED',
}

/**
 * Enumerates the categories for Instant Setup templates to facilitate browsing and organization.
 */
export enum EInstantSetupTemplateCategory {
  GEOSPATIAL_MAPPING = 'GEOSPATIAL_MAPPING',
  IMAGE_AND_VIDEO_ANALYSIS = 'IMAGE_AND_VIDEO_ANALYSIS',
  AUDIO_PROCESSING = 'AUDIO_PROCESSING',
  TEXT_AND_NLP = 'TEXT_AND_NLP',
  ADVANCED_SENSORS = 'ADVANCED_SENSORS',
  DATA_VERIFICATION = 'DATA_VERIFICATION',
  AUTONOMOUS_VEHICLE_DATA = 'AUTONOMOUS_VEHICLE_DATA',
  RETAIL_AND_ECOMMERCE = 'RETAIL_AND_ECOMMERCE',
  ORGANIZATION_CUSTOM = 'ORGANIZATION_CUSTOM',
}

/**
 * Defines the status of an ongoing Instant Setup provisioning process.
 */
export enum EInstantSetupStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  PROVISIONING = 'PROVISIONING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Identifies the specific microservice or resource being provisioned.
 */
export enum EProvisioningResource {
  PROJECT = 'PROJECT',
  TASK_DEFINITIONS = 'TASK_DEFINITIONS',
  QC_PIPELINE = 'QC_PIPELINE',
  WORKER_SEGMENT = 'WORKER_SEGMENT',
  BUDGET_AND_PAYMENT = 'BUDGET_AND_PAYMENT',
  DATA_STORAGE = 'DATA_STORAGE',
  INTEGRATIONS = 'INTEGRATIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  SECURITY_POLICIES = 'SECURITY_POLICIES',
}

/**
 * Defines the UI component type to be used for rendering a parameter.
 */
export enum EParameterUIType {
  TEXT_INPUT = 'TEXT_INPUT',
  TEXT_AREA = 'TEXT_AREA',
  NUMBER_INPUT = 'NUMBER_INPUT',
  SLIDER = 'SLIDER',
  SWITCH = 'SWITCH',
  DATE_PICKER = 'DATE_PICKER',
  LOCATION_PICKER = 'LOCATION_PICKER',
  DROPDOWN_SELECT = 'DROPDOWN_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  JSON_EDITOR = 'JSON_EDITOR',
}

// --- PARAMETER & UI CONFIGURATION ---

/**
 * Defines a validation rule for a parameter.
 */
export interface IValidationRule {
  type: 'regex' | 'minLength' | 'maxLength' | 'minValue' | 'maxValue' | 'fileTypes' | 'maxFileSizeMB';
  value: string | number | string[];
  errorMessage: string;
}

/**
 * Provides hints to the frontend on how to render a specific parameter.
 */
export interface IParameterUIRendering {
  /** The type of UI component to use. */
  component: EParameterUIType;
  /** Options for select/dropdown components. */
  options?: { label: string; value: string | number }[];
  /** Configuration for sliders, e.g., min, max, step. */
  sliderConfig?: { min: number; max: number; step: number; unit: string };
  /** Configuration for file uploads, e.g., accepted types. */
  fileConfig?: { acceptedTypes: string[]; maxFiles: number };
}

/**
 * Defines a dependency on another parameter's value.
 */
export interface IParameterDependency {
  /** The ID of the parameter this one depends on. */
  parameterId: string;
  /** The condition to check. E.g., 'EQUALS', 'NOT_EQUALS', 'INCLUDES'. */
  condition: 'EQUALS' | 'NOT_EQUALS' | 'INCLUDES';
  /** The value to check against. */
  value: any;
}

/**
 * Represents a single, user-configurable parameter within a template.
 */
export interface IInstantSetupParameter {
  id: string;
  label: string;
  description: string;
  isRequired: boolean;
  /** Provides hints to the UI for rendering. */
  ui: IParameterUIRendering;
  /** A default value for the parameter. */
  defaultValue?: any;
  /** An array of validation rules. */
  validationRules?: IValidationRule[];
  /** An array of dependencies that must be met for this parameter to be active/visible. */
  dependencies?: IParameterDependency[];
}

// --- GRANULAR CONFIGURATION MODULES ---

export interface IProjectConfiguration {
  name: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
}

export interface ITaskConfiguration {
  definitions: Partial<ITaskDefinition>[];
}

export interface IQualityControlConfiguration {
  pipelineId?: TQualityControlPipelineID;
  pipelineConfiguration: Partial<IQualityControlPipelineConfiguration>;
}

export interface IWorkerTargetingConfiguration {
  segment: Partial<IWorkerSegment>;
  requiredQualifications: string[];
  restrictedCountries: TCountryCode[];
}

export interface IPaymentAndBudgetConfiguration {
  strategy: TPaymentStrategy;
  currency: TCurrencyCode;
  totalBudget: number;
  costPerTask: number;
  bonusStrategy?: { type: 'PERFORMANCE' | 'SPEED'; amount: number };
}

export interface IDataHandlingConfiguration {
  storageRegion: string; // e.g., 'aws:us-east-1'
  dataSchemaUrl?: string; // URL to a JSON schema for validation
  retentionPolicyDays: number;
  encryptionEnabled: boolean;
}

export interface IIntegrationConfiguration {
  webhooks: {
    onTaskCompleted?: string;
    onProjectCompleted?: string;
    onQCFailure?: string;
  };
  apiAccess: {
    enabled: boolean;
    permissions: ('read' | 'write')[];
  };
}

export interface INotificationConfiguration {
  notifyOnCompletion: TUserID[];
  notifyOnFailure: TUserID[];
  sendWeeklySummary: boolean;
}

export interface ILegalAndComplianceConfiguration {
  requiresNDA: boolean;
  ndaTemplateUrl?: string;
  dataProcessingConsent: {
    required: boolean;
    consentText: string;
  };
}

// --- CORE TEMPLATE & INSTANCE DEFINITIONS ---

/**
 * Information about the maintainer of the template.
 */
export interface IMaintainerInfo {
  teamName: string;
  contactEmail: string;
}

/**
 * Represents a single entry in the template's version history.
 */
export interface IVersionHistoryEntry {
  version: number;
  updatedAt: Date;
  updatedBy: TUserID;
  changeLog: string;
}

/**
 * The master interface for an Instant Setup Template.
 * This is the architectural blueprint for creating any new project.
 */
export interface IInstantSetupTemplate {
  id: TTemplateID;
  name: string;
  description: string;
  category: EInstantSetupTemplateCategory;
  status: EInstantSetupTemplateLifecycleStatus;
  version: number;
  maintainer: IMaintainerInfo;
  versionHistory: IVersionHistoryEntry[];
  createdAt: Date;
  createdBy: TUserID | 'SYSTEM';
  icon?: string;
  color?: string;

  /** The user-facing parameters to configure the project. */
  parameters: IInstantSetupParameter[];

  /** The underlying, granular configuration that will be provisioned. */
  configuration: {
    project: IProjectConfiguration;
    tasks: ITaskConfiguration;
    qualityControl: IQualityControlConfiguration;
    workerTargeting: IWorkerTargetingConfiguration;
    paymentAndBudget: IPaymentAndBudgetConfiguration;
    dataHandling: IDataHandlingConfiguration;
    integrations: IIntegrationConfiguration;
    notifications: INotificationConfiguration;
    legalAndCompliance: ILegalAndComplianceConfiguration;
  };
}

/**
 * A lightweight summary of a template for list/gallery views.
 */
export type TInstantSetupTemplateSummary = Pick<
  IInstantSetupTemplate,
  'id' | 'name' | 'description' | 'category' | 'icon' | 'color' | 'status'
>;

/**
 * The payload sent by the client to initiate a new project setup.
 */
export interface IInstantSetupRequestPayload {
  templateId: TTemplateID;
  userInputs: Record<string, any>; // Key is IInstantSetupParameter.id
  requestMetadata: {
    idempotencyKey: string;
    source: 'WEB_APP' | 'MOBILE_APP' | 'API';
  };
  advancedOverrides?: Partial<IInstantSetupTemplate['configuration']>;
  organizationId: TOrganizationID;
}

// --- PROVISIONING & RESULT TYPES ---

/**
 * A structured log entry for auditing the provisioning process.
 */
export interface IProvisioningLogEntry {
  timestamp: Date;
  resource: EProvisioningResource;
  status: 'STARTED' | 'SUCCESS' | 'FAILURE';
  message: string;
  resourceId?: string;
  durationMs?: number;
}

/**
 * A structured error object for clear, actionable feedback.
 */
export interface IInstantSetupError {
  errorCode: string; // e.g., 'INSUFFICIENT_FUNDS'
  userMessage: string; // Safe to display to the end-user
  developerMessage: string; // Technical details for debugging
  resource?: EProvisioningResource;
  stackTrace?: string;
}

/**
 * Represents a single, stateful instance of a project being set up.
 * This object tracks the process from initiation to completion or failure.
 */
export interface IInstantSetupInstance {
  id: TSetupInstanceID;
  templateId: TTemplateID;
  projectId?: TProjectID;
  status: EInstantSetupStatus;
  statusMessage: string;
  errors: IInstantSetupError[];
  provisioningLog: IProvisioningLogEntry[];
  requestedBy: TUserID;
  organizationId: TOrganizationID;
  startedAt: Date;
  completedAt?: Date;
}