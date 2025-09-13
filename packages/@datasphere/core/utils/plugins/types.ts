/**
 * @fileoverview Plugin Architecture Types
 */

export type PluginId = string;
export type PluginVersion = string;
export type HookId = string;
export type ISOTimestamp = string;

export enum PluginStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ERROR = 'error'
}

export enum PluginType {
  CORE = 'core',
  EXTENSION = 'extension',
  THEME = 'theme',
  INTEGRATION = 'integration'
}

export interface Plugin {
  id: PluginId;
  name: string;
  version: PluginVersion;
  type: PluginType;
  status: PluginStatus;
  description: string;
  author: string;
  main: string;
  dependencies: PluginDependency[];
  permissions: string[];
  hooks: PluginHook[];
  config: PluginConfig;
  manifest: PluginManifest;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface PluginDependency {
  name: string;
  version: string;
  type: 'plugin' | 'package';
  required: boolean;
}

export interface PluginHook {
  id: HookId;
  event: string;
  handler: string;
  priority: number;
  async: boolean;
  conditions: HookCondition[];
}

export interface HookCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt';
  value: unknown;
}

export interface PluginConfig {
  schema: ConfigSchema;
  defaults: Record<string, unknown>;
  current: Record<string, unknown>;
  validation: ValidationRule[];
}

export interface ConfigSchema {
  type: 'object';
  properties: Record<string, SchemaProperty>;
  required: string[];
}

export interface SchemaProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  default?: unknown;
  enum?: unknown[];
  min?: number;
  max?: number;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface PluginManifest {
  name: string;
  version: PluginVersion;
  description: string;
  author: string;
  license: string;
  homepage: string;
  repository: string;
  keywords: string[];
  engines: Record<string, string>;
  files: string[];
  scripts: Record<string, string>;
}

export interface PluginRegistry {
  plugins: Map<PluginId, Plugin>;
  hooks: Map<string, PluginHook[]>;
  dependencies: Map<PluginId, PluginId[]>;
  loadOrder: PluginId[];
}

export interface PluginLoader {
  load(pluginPath: string): Promise<Plugin>;
  unload(pluginId: PluginId): Promise<void>;
  reload(pluginId: PluginId): Promise<void>;
  validate(plugin: Plugin): Promise<ValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface PluginSandbox {
  pluginId: PluginId;
  context: SandboxContext;
  permissions: Permission[];
  limits: ResourceLimits;
}

export interface SandboxContext {
  globals: Record<string, unknown>;
  modules: Record<string, unknown>;
  apis: Record<string, unknown>;
}

export interface Permission {
  name: string;
  description: string;
  granted: boolean;
  scope: string[];
}

export interface ResourceLimits {
  memory: number;
  cpu: number;
  storage: number;
  network: number;
  timeout: number;
}

export interface PluginMarketplace {
  plugins: MarketplacePlugin[];
  categories: PluginCategory[];
  featured: PluginId[];
  popular: PluginId[];
}

export interface MarketplacePlugin {
  id: PluginId;
  name: string;
  version: PluginVersion;
  description: string;
  author: string;
  price: number;
  rating: number;
  downloads: number;
  tags: string[];
  screenshots: string[];
  changelog: ChangelogEntry[];
  publishedAt: ISOTimestamp;
}

export interface PluginCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ChangelogEntry {
  version: PluginVersion;
  date: ISOTimestamp;
  changes: string[];
  breaking: boolean;
}

export interface PluginLifecycle {
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onUpdate?: (oldVersion: PluginVersion, newVersion: PluginVersion) => Promise<void>;
}

export interface PluginAPI {
  version: string;
  hooks: HookAPI;
  config: ConfigAPI;
  storage: StorageAPI;
  events: EventAPI;
  logger: LoggerAPI;
}

export interface HookAPI {
  register(event: string, handler: Function, priority?: number): void;
  unregister(event: string, handler: Function): void;
  trigger(event: string, ...args: unknown[]): Promise<unknown[]>;
}

export interface ConfigAPI {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  has(key: string): boolean;
  delete(key: string): void;
}

export interface StorageAPI {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface EventAPI {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, ...args: unknown[]): void;
}

export interface LoggerAPI {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface PluginMetrics {
  loadTime: number;
  memoryUsage: number;
  cpuUsage: number;
  apiCalls: number;
  errors: number;
  uptime: number;
}

export interface PluginTest {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'performance';
  setup?: () => Promise<void>;
  test: () => Promise<void>;
  teardown?: () => Promise<void>;
  timeout: number;
}

export interface TestResult {
  testId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
  output?: string;
}

export interface TestSuite {
  pluginId: PluginId;
  tests: PluginTest[];
  results: TestResult[];
  summary: TestSummary;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage: number;
}