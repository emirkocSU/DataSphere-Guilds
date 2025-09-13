/**
 * @fileoverview Partnership & Integration Hub Types
 */

export type WebhookId = string;
export type IntegrationId = string;
export type PartnerId = string;
export type PluginId = string;
export type AdapterId = string;
export type ISOTimestamp = string;

export enum WebhookEvent {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  ORDER_PLACED = 'order.placed',
  PAYMENT_PROCESSED = 'payment.processed',
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
  INTEGRATION_CONNECTED = 'integration.connected',
  INTEGRATION_DISCONNECTED = 'integration.disconnected',
  DATA_SYNC_COMPLETED = 'data.sync.completed',
  ERROR_OCCURRED = 'error.occurred'
}

export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ERROR = 'error',
  SUSPENDED = 'suspended'
}

export enum DataTransformationType {
  MAP = 'map',
  FILTER = 'filter',
  AGGREGATE = 'aggregate',
  VALIDATE = 'validate',
  ENRICH = 'enrich',
  NORMALIZE = 'normalize'
}

export interface Webhook {
  id: WebhookId;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  partnerId: PartnerId;
  retryConfig: RetryConfig;
  headers: Record<string, string>;
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
  lastTriggered?: ISOTimestamp;
}

export interface RetryConfig {
  maxAttempts: number;
  backoffMultiplier: number;
  maxDelay: number;
  retryOn: number[];
}

export interface WebhookDelivery {
  id: string;
  webhookId: WebhookId;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  nextRetry?: ISOTimestamp;
  response?: WebhookResponse;
  createdAt: ISOTimestamp;
  deliveredAt?: ISOTimestamp;
}

export interface WebhookResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  duration: number;
}

export interface Integration {
  id: IntegrationId;
  name: string;
  type: string;
  provider: string;
  status: IntegrationStatus;
  config: IntegrationConfig;
  credentials: IntegrationCredentials;
  endpoints: IntegrationEndpoint[];
  transformations: DataTransformation[];
  monitoring: IntegrationMonitoring;
  partnerId: PartnerId;
  createdAt: ISOTimestamp;
  lastSync?: ISOTimestamp;
}

export interface IntegrationConfig {
  apiVersion: string;
  baseUrl: string;
  timeout: number;
  rateLimit: RateLimit;
  retryPolicy: RetryPolicy;
  errorHandling: ErrorHandling;
}

export interface RateLimit {
  requests: number;
  window: number;
  burst?: number;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
}

export interface ErrorHandling {
  skipOnError: boolean;
  errorThreshold: number;
  alertOnError: boolean;
  fallbackStrategy: 'skip' | 'retry' | 'queue';
}

export interface IntegrationCredentials {
  type: 'oauth2' | 'api_key' | 'basic' | 'jwt' | 'custom';
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  secret?: string;
  expiresAt?: ISOTimestamp;
  scopes?: string[];
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: EndpointParameter[];
  responseSchema: Record<string, unknown>;
  rateLimit?: RateLimit;
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  defaultValue?: unknown;
  validation?: ParameterValidation;
}

export interface ParameterValidation {
  pattern?: string;
  min?: number;
  max?: number;
  enum?: string[];
}

export interface DataTransformation {
  id: string;
  name: string;
  type: DataTransformationType;
  sourceField: string;
  targetField: string;
  rules: TransformationRule[];
  isActive: boolean;
}

export interface TransformationRule {
  condition: string;
  action: string;
  value?: unknown;
  mapping?: Record<string, unknown>;
}

export interface IntegrationMonitoring {
  metrics: IntegrationMetrics;
  alerts: IntegrationAlert[];
  logs: IntegrationLog[];
}

export interface IntegrationMetrics {
  requestsTotal: number;
  requestsSuccess: number;
  requestsError: number;
  averageResponseTime: number;
  errorRate: number;
  dataVolume: number;
  lastSync: ISOTimestamp;
  uptime: number;
}

export interface IntegrationAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  threshold: number;
  currentValue: number;
  isTriggered: boolean;
  triggeredAt?: ISOTimestamp;
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'slack' | 'sms';
  target: string;
  enabled: boolean;
}

export interface IntegrationLog {
  id: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  data: Record<string, unknown>;
  timestamp: ISOTimestamp;
  correlationId: string;
}

export interface Partner {
  id: PartnerId;
  name: string;
  type: 'technology' | 'marketplace' | 'payment' | 'analytics' | 'crm' | 'other';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  contact: PartnerContact;
  agreement: PartnerAgreement;
  integrations: IntegrationId[];
  analytics: PartnerAnalytics;
  onboarding: OnboardingStatus;
  createdAt: ISOTimestamp;
}

export interface PartnerContact {
  name: string;
  email: string;
  phone?: string;
  company: string;
  role: string;
}

export interface PartnerAgreement {
  type: 'standard' | 'custom';
  version: string;
  signedAt: ISOTimestamp;
  expiresAt?: ISOTimestamp;
  terms: string[];
  sla: ServiceLevelAgreement;
}

export interface ServiceLevelAgreement {
  uptime: number;
  responseTime: number;
  supportLevel: 'basic' | 'standard' | 'premium';
  escalationPath: string[];
}

export interface PartnerAnalytics {
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  dataVolume: number;
  revenue: number;
  costSavings: number;
  satisfactionScore: number;
  integrationHealth: number;
}

export interface OnboardingStatus {
  stage: 'initiated' | 'documentation' | 'testing' | 'approval' | 'completed';
  completedSteps: string[];
  nextSteps: string[];
  assignedTo: string;
  completionDate?: ISOTimestamp;
  notes: string[];
}

export interface Plugin {
  id: PluginId;
  name: string;
  version: string;
  description: string;
  author: string;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'deprecated';
  permissions: string[];
  config: PluginConfig;
  hooks: PluginHook[];
  dependencies: PluginDependency[];
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface PluginConfig {
  settings: Record<string, unknown>;
  schema: Record<string, unknown>;
  validation: Record<string, unknown>;
  defaults: Record<string, unknown>;
}

export interface PluginHook {
  event: string;
  handler: string;
  priority: number;
  async: boolean;
}

export interface PluginDependency {
  name: string;
  version: string;
  required: boolean;
  type: 'plugin' | 'package' | 'service';
}

export interface APIAdapter {
  id: AdapterId;
  name: string;
  sourceApi: ApiSpec;
  targetApi: ApiSpec;
  mappings: FieldMapping[];
  transformations: DataTransformation[];
  validation: AdapterValidation;
  performance: AdapterPerformance;
  isActive: boolean;
}

export interface ApiSpec {
  name: string;
  version: string;
  baseUrl: string;
  authentication: AuthenticationSpec;
  endpoints: EndpointSpec[];
  schemas: Record<string, unknown>;
}

export interface AuthenticationSpec {
  type: 'oauth2' | 'api_key' | 'basic' | 'jwt';
  config: Record<string, unknown>;
}

export interface EndpointSpec {
  path: string;
  method: string;
  parameters: ParameterSpec[];
  response: ResponseSpec;
}

export interface ParameterSpec {
  name: string;
  type: string;
  location: 'query' | 'header' | 'path' | 'body';
  required: boolean;
}

export interface ResponseSpec {
  statusCode: number;
  schema: Record<string, unknown>;
  examples: Record<string, unknown>;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: unknown;
  required: boolean;
}

export interface AdapterValidation {
  rules: ValidationRule[];
  strictMode: boolean;
  errorHandling: 'throw' | 'log' | 'ignore';
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'type' | 'format' | 'range' | 'custom';
  value: unknown;
  message: string;
}

export interface AdapterPerformance {
  cacheEnabled: boolean;
  cacheTtl: number;
  batchSize: number;
  timeout: number;
  retryAttempts: number;
}

export interface MarketplaceIntegration {
  id: string;
  marketplace: string;
  type: 'product' | 'order' | 'inventory' | 'customer' | 'analytics';
  syncDirection: 'import' | 'export' | 'bidirectional';
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  mappings: MarketplaceMapping[];
  filters: MarketplaceFilter[];
  status: IntegrationStatus;
  lastSync: ISOTimestamp;
  metrics: MarketplaceMetrics;
}

export interface MarketplaceMapping {
  localField: string;
  remoteField: string;
  transformation?: string;
  bidirectional: boolean;
}

export interface MarketplaceFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
  value: unknown;
}

export interface MarketplaceMetrics {
  itemsSynced: number;
  syncSuccess: number;
  syncErrors: number;
  dataVolume: number;
  revenue: number;
  conversionRate: number;
}

export interface BillingIntegration {
  id: string;
  provider: string;
  type: 'subscription' | 'usage' | 'hybrid';
  config: BillingConfig;
  webhooks: WebhookId[];
  metrics: BillingMetrics;
  status: IntegrationStatus;
}

export interface BillingConfig {
  apiKey: string;
  webhookSecret: string;
  currency: string;
  taxHandling: 'inclusive' | 'exclusive' | 'automatic';
  invoiceGeneration: 'automatic' | 'manual';
  paymentMethods: string[];
}

export interface BillingMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  churnRate: number;
  averageOrderValue: number;
  paymentSuccess: number;
  paymentFailure: number;
  refunds: number;
}