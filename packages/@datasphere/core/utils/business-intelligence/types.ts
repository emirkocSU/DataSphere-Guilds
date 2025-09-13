/**
 * @fileoverview Business Intelligence Dashboard Types
 */

export type DashboardId = string;
export type ReportId = string;
export type KPIId = string;
export type WidgetId = string;
export type UserId = string;
export type ISOTimestamp = string;

export enum KPIType {
  REVENUE = 'revenue',
  USERS = 'users',
  CONVERSION = 'conversion',
  RETENTION = 'retention',
  ENGAGEMENT = 'engagement',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom'
}

export enum VisualizationType {
  LINE_CHART = 'line_chart',
  BAR_CHART = 'bar_chart',
  PIE_CHART = 'pie_chart',
  TABLE = 'table',
  METRIC = 'metric',
  HEATMAP = 'heatmap',
  FUNNEL = 'funnel',
  GAUGE = 'gauge'
}

export enum TimeRange {
  LAST_HOUR = 'last_hour',
  LAST_24H = 'last_24h',
  LAST_7D = 'last_7d',
  LAST_30D = 'last_30d',
  LAST_90D = 'last_90d',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom'
}

export interface Dashboard {
  id: DashboardId;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'analytical' | 'custom';
  widgets: Widget[];
  layout: DashboardLayout;
  permissions: DashboardPermissions;
  settings: DashboardSettings;
  createdBy: UserId;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  lastViewed?: ISOTimestamp;
}

export interface Widget {
  id: WidgetId;
  name: string;
  type: VisualizationType;
  config: WidgetConfig;
  dataSource: DataSource;
  position: WidgetPosition;
  size: WidgetSize;
  filters: Filter[];
  interactions: WidgetInteraction[];
  refreshInterval: number;
  isVisible: boolean;
}

export interface WidgetConfig {
  title: string;
  subtitle?: string;
  showLegend: boolean;
  colors: string[];
  axes: AxisConfig[];
  series: SeriesConfig[];
  formatting: FormattingConfig;
  thresholds: Threshold[];
}

export interface AxisConfig {
  name: string;
  type: 'category' | 'value' | 'time';
  position: 'left' | 'right' | 'top' | 'bottom';
  scale: 'linear' | 'log' | 'sqrt';
  min?: number;
  max?: number;
  format?: string;
}

export interface SeriesConfig {
  name: string;
  field: string;
  type: 'line' | 'bar' | 'area' | 'scatter';
  stack?: string;
  yAxisIndex?: number;
  smooth?: boolean;
}

export interface FormattingConfig {
  numberFormat: string;
  dateFormat: string;
  currency: string;
  precision: number;
  units: string;
}

export interface Threshold {
  value: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  color: string;
  label: string;
}

export interface WidgetPosition {
  x: number;
  y: number;
  z: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

export interface WidgetInteraction {
  type: 'drill_down' | 'filter' | 'navigate' | 'export';
  target: string;
  parameters: Record<string, unknown>;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'absolute';
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  responsive: boolean;
}

export interface DashboardPermissions {
  view: string[];
  edit: string[];
  admin: string[];
  share: boolean;
  export: boolean;
}

export interface DashboardSettings {
  theme: 'light' | 'dark' | 'auto';
  autoRefresh: boolean;
  refreshInterval: number;
  showFilters: boolean;
  showToolbar: boolean;
  fullscreen: boolean;
  timezone: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'sql' | 'api' | 'file' | 'real_time';
  connection: DataConnection;
  query: DataQuery;
  cache: CacheConfig;
  transform: DataTransform[];
}

export interface DataConnection {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  url?: string;
  headers?: Record<string, string>;
  parameters?: Record<string, unknown>;
}

export interface DataQuery {
  sql?: string;
  endpoint?: string;
  method?: string;
  body?: Record<string, unknown>;
  fields?: string[];
  aggregations?: Aggregation[];
  groupBy?: string[];
  orderBy?: OrderBy[];
  filters?: Filter[];
  limit?: number;
}

export interface Aggregation {
  field: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
  alias?: string;
}

export interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'like' | 'between';
  value: unknown;
  values?: unknown[];
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  key: string;
  invalidateOn: string[];
}

export interface DataTransform {
  type: 'map' | 'filter' | 'sort' | 'group' | 'aggregate' | 'join';
  config: Record<string, unknown>;
  order: number;
}

export interface KPI {
  id: KPIId;
  name: string;
  description: string;
  type: KPIType;
  category: string;
  calculation: KPICalculation;
  targets: KPITarget[];
  trends: KPITrend[];
  alerts: KPIAlert[];
  dimensions: string[];
  isActive: boolean;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface KPICalculation {
  formula: string;
  dataSource: DataSource;
  timeRange: TimeRange;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  filters: Filter[];
  segments: string[];
}

export interface KPITarget {
  name: string;
  value: number;
  type: 'absolute' | 'percentage' | 'growth';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  threshold: 'above' | 'below' | 'equal';
}

export interface KPITrend {
  period: string;
  value: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
}

export interface KPIAlert {
  id: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  isTriggered: boolean;
  lastTriggered?: ISOTimestamp;
}

export interface Report {
  id: ReportId;
  name: string;
  description: string;
  type: 'standard' | 'custom' | 'scheduled' | 'ad_hoc';
  template: ReportTemplate;
  schedule: ReportSchedule;
  recipients: ReportRecipient[];
  exports: ReportExport[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  createdBy: UserId;
  createdAt: ISOTimestamp;
  lastGenerated?: ISOTimestamp;
}

export interface ReportTemplate {
  sections: ReportSection[];
  styling: ReportStyling;
  parameters: ReportParameter[];
  variables: ReportVariable[];
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'title' | 'summary' | 'chart' | 'table' | 'text' | 'kpi';
  content: ReportContent;
  position: number;
  isVisible: boolean;
}

export interface ReportContent {
  title?: string;
  text?: string;
  widget?: Widget;
  kpis?: KPIId[];
  data?: Record<string, unknown>;
}

export interface ReportStyling {
  theme: string;
  fonts: FontConfig;
  colors: ColorConfig;
  layout: LayoutConfig;
  branding: BrandingConfig;
}

export interface FontConfig {
  primary: string;
  secondary: string;
  sizes: Record<string, number>;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface LayoutConfig {
  margins: number;
  padding: number;
  spacing: number;
  columns: number;
}

export interface BrandingConfig {
  logo: string;
  company: string;
  website: string;
  colors: string[];
}

export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  defaultValue: unknown;
  options?: string[];
  required: boolean;
}

export interface ReportVariable {
  name: string;
  value: unknown;
  type: 'static' | 'dynamic' | 'calculated';
  calculation?: string;
}

export interface ReportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  timezone: string;
  startDate: ISOTimestamp;
  endDate?: ISOTimestamp;
  weekdays?: number[];
  dayOfMonth?: number;
  isActive: boolean;
}

export interface ReportRecipient {
  id: string;
  name: string;
  email: string;
  type: 'to' | 'cc' | 'bcc';
  conditions: string[];
}

export interface ReportExport {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  filename: string;
  options: ExportOptions;
  generated: boolean;
  url?: string;
  size?: number;
  generatedAt?: ISOTimestamp;
}

export interface ExportOptions {
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  compression?: boolean;
  password?: string;
  includeCharts?: boolean;
  includeData?: boolean;
}

export interface BusinessMetrics {
  revenue: RevenueMetrics;
  users: UserMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  operations: OperationalMetrics;
}

export interface RevenueMetrics {
  total: number;
  recurring: number;
  oneTime: number;
  growth: number;
  forecast: number;
  breakdown: Record<string, number>;
}

export interface UserMetrics {
  total: number;
  active: number;
  new: number;
  retained: number;
  churned: number;
  segments: Record<string, number>;
}

export interface EngagementMetrics {
  sessions: number;
  pageViews: number;
  duration: number;
  bounceRate: number;
  conversion: number;
  features: Record<string, number>;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  availability: number;
  resources: Record<string, number>;
}

export interface OperationalMetrics {
  costs: number;
  efficiency: number;
  productivity: number;
  quality: number;
  satisfaction: number;
  incidents: number;
}