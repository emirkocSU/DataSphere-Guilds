/**
 * @fileoverview Real-Time Analytics Engine Types
 */

export type EventId = string;
export type StreamId = string;
export type MetricId = string;
export type AlertId = string;
export type DashboardId = string;
export type ISOTimestamp = string;

export interface StreamEvent {
  id: EventId;
  type: string;
  timestamp: ISOTimestamp;
  userId?: string;
  sessionId?: string;
  data: Record<string, unknown>;
  metadata: {
    source: string;
    version: string;
    correlationId?: string;
  };
}

export interface MetricDefinition {
  id: MetricId;
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'timer';
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'percentile';
  dimensions: string[];
  timeWindow: number;
  retentionPeriod: number;
}

export interface KPIDefinition {
  id: string;
  name: string;
  formula: string;
  target: number;
  threshold: {
    warning: number;
    critical: number;
  };
  dependencies: MetricId[];
}

export interface AnomalyConfig {
  algorithm: 'statistical' | 'ml' | 'threshold';
  sensitivity: number;
  baselineWindow: number;
  alertThreshold: number;
}

export interface AlertRule {
  id: AlertId;
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  throttle: number;
  enabled: boolean;
}

export interface DashboardConfig {
  id: DashboardId;
  name: string;
  widgets: Widget[];
  refreshInterval: number;
  filters: Filter[];
}

export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'gauge';
  title: string;
  query: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: unknown;
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  tags: Record<string, string>;
}

export interface AnalyticsMetrics {
  eventsProcessed: number;
  eventsPerSecond: number;
  processingLatency: number;
  errorRate: number;
  activeStreams: number;
  memoryUsage: number;
}