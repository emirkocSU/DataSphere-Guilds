/**
 * @fileoverview Advanced analytics interfaces for unicorn-scale data insights
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../types/common.types';

export interface IAnalyticsService {
  // Event tracking
  track(event: AnalyticsEvent): Promise<void>;
  trackBatch(events: AnalyticsEvent[]): Promise<void>;
  
  // Metrics and KPIs
  getMetrics(query: MetricsQuery): Promise<MetricsResult>;
  getKPIs(period: TimePeriod): Promise<KPIResult[]>;
  
  // Real-time analytics
  getRealtimeMetrics(metricNames: string[]): Promise<RealtimeMetrics>;
  subscribeToMetrics(metricNames: string[], callback: MetricsCallback): Promise<string>;
  unsubscribe(subscriptionId: string): Promise<void>;
  
  // Funnel analysis
  analyzeFunnel(funnelConfig: FunnelConfig): Promise<FunnelResult>;
  
  // Cohort analysis
  analyzeCohort(cohortConfig: CohortConfig): Promise<CohortResult>;
  
  // A/B testing
  createExperiment(experiment: ExperimentConfig): Promise<Experiment>;
  getExperimentResults(experimentId: UUID): Promise<ExperimentResult>;
}

export interface AnalyticsEvent {
  id?: UUID;
  userId?: UUID;
  sessionId?: string;
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  context?: EventContext;
}

export interface EventContext {
  page?: string;
  campaign?: string;
  source?: string;
  medium?: string;
  device?: DeviceInfo;
  location?: GeoLocation;
}

export interface MetricsQuery {
  metrics: string[];
  dimensions?: string[];
  filters?: MetricFilter[];
  dateRange: DateRange;
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface MetricsResult {
  data: MetricDataPoint[];
  summary: MetricSummary;
  metadata: QueryMetadata;
}

export interface MetricDataPoint {
  timestamp: Date;
  dimensions: Record<string, string>;
  values: Record<string, number>;
}

export interface MetricSummary {
  totalEvents: number;
  uniqueUsers: number;
  averageValue: number;
  trend: 'up' | 'down' | 'stable';
}

export interface KPIResult {
  name: string;
  value: number;
  target?: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  status: 'good' | 'warning' | 'critical';
}

export interface RealtimeMetrics {
  timestamp: Date;
  metrics: Record<string, number>;
  activeUsers: number;
  events: AnalyticsEvent[];
}

export interface FunnelConfig {
  name: string;
  steps: FunnelStep[];
  dateRange: DateRange;
  filters?: MetricFilter[];
}

export interface FunnelStep {
  name: string;
  eventName: string;
  conditions?: Record<string, any>;
}

export interface FunnelResult {
  name: string;
  steps: FunnelStepResult[];
  conversionRate: number;
  dropoffPoints: DropoffAnalysis[];
}

export interface FunnelStepResult {
  name: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

export interface CohortConfig {
  name: string;
  cohortBy: 'day' | 'week' | 'month';
  returnEvent: string;
  dateRange: DateRange;
  filters?: MetricFilter[];
}

export interface CohortResult {
  name: string;
  cohorts: CohortData[];
  retentionRates: number[][];
  averageRetention: number;
}

export interface CohortData {
  period: string;
  size: number;
  retentionRates: number[];
}

export interface ExperimentConfig {
  name: string;
  description?: string;
  variants: ExperimentVariant[];
  trafficAllocation: number;
  successMetrics: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface ExperimentVariant {
  name: string;
  trafficPercentage: number;
  configuration: Record<string, any>;
}

export interface Experiment {
  id: UUID;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ExperimentVariant[];
  startDate?: Date;
  endDate?: Date;
  participantCount: number;
}

export interface ExperimentResult {
  experimentId: UUID;
  status: string;
  participantCount: number;
  variants: VariantResult[];
  statisticalSignificance: number;
  winner?: string;
  confidence: number;
}

export interface VariantResult {
  name: string;
  participantCount: number;
  conversionRate: number;
  averageValue: number;
  confidence: ConfidenceInterval;
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  level: number;
}

// Supporting types
export interface TimePeriod {
  start: Date;
  end: Date;
}

export interface DateRange extends TimePeriod {}

export interface MetricFilter {
  dimension: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface QueryMetadata {
  executionTime: number;
  dataPoints: number;
  fromCache: boolean;
  freshness: Date;
}

export interface DropoffAnalysis {
  fromStep: string;
  toStep: string;
  dropoffRate: number;
  reasons?: string[];
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
}

export type MetricsCallback = (metrics: RealtimeMetrics) => void;