/**
 * @fileoverview QC Pipeline Real-Time Monitoring & Analytics - Enterprise Intelligence System
 * Ultra-lean monitoring system for 5-layer quality control performance optimization
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer } from './enums';

export type PipelineHealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'MAINTENANCE';
export type MetricType = keyof RealTimeMetrics;

export interface QCPipelineMonitoring {
  readonly pipelineId: UUID;
  readonly sessionId: UUID;
  readonly healthStatus: PipelineHealthStatus;
  readonly realTimeMetrics: RealTimeMetrics;
  readonly performanceIndicators: KPIIndicators;
  readonly alertConditions: AlertCondition[];
  readonly dashboards: DashboardConfig[];
  readonly predictiveAnalytics: PredictiveAnalytics;
  readonly observability: ObservabilityConfig;
}

export interface RealTimeMetrics {
  readonly throughput: ThroughputMetrics;
  readonly latency: LatencyMetrics;
  readonly accuracy: AccuracyMetrics;
  readonly cost: CostMetrics;
  readonly resourceUtilization: ResourceMetrics;
  readonly errorRates: ErrorRateMetrics;
  readonly qualityScore: QualityMetrics;
  readonly businessMetrics: BusinessMetrics;
}

export interface ThroughputMetrics {
  readonly submissionsPerHour: number;
  readonly submissionsPerMinute: number;
  readonly completionRate: number;
  readonly processingRate: number;
  readonly queueDepth: Record<QCLayer, number>;
}

export interface LatencyMetrics {
  readonly p50: number;
  readonly p95: number;
  readonly p99: number;
  readonly average: number;
  readonly byLayer: Record<QCLayer, LatencyBreakdown>;
}

export interface LatencyBreakdown {
  readonly queueTime: number;
  readonly processingTime: number;
  readonly transferTime: number;
  readonly waitTime: number;
}

export interface AccuracyMetrics {
  readonly overallAccuracy: number;
  readonly layerAccuracy: Record<QCLayer, number>;
  readonly confidenceDistribution: ConfidenceDistribution;
  readonly agreementRate: number;
}

export interface ConfidenceDistribution {
  readonly low: number;
  readonly medium: number;
  readonly high: number;
  readonly veryHigh: number;
}

export interface CostMetrics {
  readonly totalCost: number;
  readonly costPerSubmission: number;
  readonly costByLayer: Record<QCLayer, number>;
  readonly resourceCosts: Record<string, number>;
  readonly optimization: CostOptimization;
}

export interface CostOptimization {
  readonly potential: number;
  readonly achieved: number;
  readonly efficiency: number;
  readonly recommendations: string[];
}

export interface ResourceMetrics {
  readonly cpuUtilization: number;
  readonly memoryUtilization: number;
  readonly networkUtilization: number;
  readonly storageUtilization: number;
  readonly concurrentUsers: number;
}

export interface ErrorRateMetrics {
  readonly totalErrorRate: number;
  readonly layerErrorRates: Record<QCLayer, number>;
  readonly errorBreakdown: ErrorBreakdown;
  readonly recovery: RecoveryMetrics;
}

export interface ErrorBreakdown {
  readonly technical: number;
  readonly business: number;
  readonly timeout: number;
  readonly validation: number;
  readonly capacity: number;
}

export interface RecoveryMetrics {
  readonly mttr: number;
  readonly mtbf: number;
  readonly availability: number;
  readonly reliability: number;
}

export interface QualityMetrics {
  readonly overallScore: number;
  readonly consistency: number;
  readonly completeness: number;
  readonly validity: number;
  readonly layerQuality: Record<QCLayer, number>;
}

export interface BusinessMetrics {
  readonly slaCompliance: number;
  readonly customerSatisfaction: number;
  readonly businessValue: number;
  readonly roi: number;
}

export interface KPIIndicators {
  readonly slaCompliance: number;
  readonly qualityScore: number;
  readonly operationalEfficiency: number;
  readonly costEffectiveness: number;
  readonly customerSatisfaction: number;
}

export interface AlertCondition {
  readonly alertId: UUID;
  readonly name: string;
  readonly metric: keyof RealTimeMetrics;
  readonly threshold: number;
  readonly operator: 'GT' | 'LT' | 'EQ';
  readonly severity: 'INFO' | 'WARNING' | 'CRITICAL';
  readonly enabled: boolean;
  readonly description: string;
  readonly duration: number;
  readonly frequency: number;
  readonly suppressionRules: SuppressionRule[];
  readonly alertActions: AlertAction[];
}

export interface SuppressionRule {
  readonly ruleId: UUID;
  readonly condition: string;
  readonly duration: number;
  readonly enabled: boolean;
}

export interface AlertAction {
  readonly type: 'NOTIFICATION' | 'ESCALATION' | 'AUTOMATION' | 'REMEDIATION';
  readonly target: string;
  readonly delay: number;
  readonly parameters: Record<string, unknown>;
}

export interface DashboardConfig {
  readonly dashboardId: UUID;
  readonly name: string;
  readonly description: string;
  readonly widgets: Widget[];
  readonly layout: LayoutConfig;
  readonly refresh: RefreshConfig;
  readonly access: AccessConfig;
  readonly customization: CustomizationConfig;
}

export interface Widget {
  readonly widgetId: UUID;
  readonly type: 'CHART' | 'TABLE' | 'METRIC' | 'GAUGE' | 'HEATMAP' | 'TIMELINE';
  readonly title: string;
  readonly query: QueryConfig;
  readonly visualization: VisualizationConfig;
  readonly position: Position;
  readonly interactivity: InteractivityConfig;
}

export interface QueryConfig {
  readonly metrics: string[];
  readonly filters: Record<string, string>;
  readonly groupBy: string[];
  readonly aggregation: string;
  readonly timeRange: TimeRange;
}

export interface TimeRange {
  readonly start: string;
  readonly end: string;
  readonly relative: boolean;
  readonly preset: 'LAST_HOUR' | 'LAST_DAY' | 'LAST_WEEK' | 'CUSTOM';
}

export interface VisualizationConfig {
  readonly chartType: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER';
  readonly colors: string[];
  readonly axes: AxisConfig[];
  readonly legend: LegendConfig;
  readonly annotations: AnnotationConfig[];
}

export interface AxisConfig {
  readonly axis: 'x' | 'y';
  readonly label: string;
  readonly scale: 'linear' | 'log' | 'time';
  readonly min?: number;
  readonly max?: number;
}

export interface LegendConfig {
  readonly show: boolean;
  readonly position: 'top' | 'bottom' | 'left' | 'right';
  readonly align: 'start' | 'center' | 'end';
}

export interface AnnotationConfig {
  readonly type: 'LINE' | 'BAND' | 'POINT';
  readonly value: number | [number, number];
  readonly label: string;
  readonly color: string;
}

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface InteractivityConfig {
  readonly clickable: boolean;
  readonly hoverable: boolean;
  readonly drilldown: DrilldownConfig[];
  readonly filters: FilterConfig[];
}

export interface DrilldownConfig {
  readonly target: string;
  readonly parameters: Record<string, string>;
}

export interface FilterConfig {
  readonly field: string;
  readonly operator: string;
  readonly defaultValue?: unknown;
}

export interface LayoutConfig {
  readonly columns: number;
  readonly rows: number;
  readonly spacing: number;
  readonly responsive: boolean;
}

export interface RefreshConfig {
  readonly auto: boolean;
  readonly interval: number;
  readonly realTime: boolean;
  readonly pauseOnInactivity: boolean;
}

export interface AccessConfig {
  readonly public: boolean;
  readonly users: string[];
  readonly roles: string[];
  readonly permissions: string[];
}

export interface CustomizationConfig {
  readonly userCustomizable: boolean;
  readonly exportable: boolean;
  readonly shareable: boolean;
  readonly themes: string[];
}

export interface PredictiveAnalytics {
  readonly enabled: boolean;
  readonly forecastHorizon: number;
  readonly models: PredictiveModel[];
  readonly forecasts: Forecast[];
  readonly anomalies: AnomalyDetection;
  readonly recommendations: Recommendation[];
}

export interface PredictiveModel {
  readonly modelId: UUID;
  readonly type: 'LINEAR' | 'ARIMA' | 'NEURAL_NETWORK' | 'ENSEMBLE';
  readonly target: string;
  readonly accuracy: number;
  readonly confidence: number;
  readonly lastTrained: ISOTimestamp;
  readonly features: string[];
}

export interface Forecast {
  readonly metric: string;
  readonly horizon: number;
  readonly values: ForecastPoint[];
  readonly confidence: ConfidenceInterval;
  readonly accuracy: number;
}

export interface ForecastPoint {
  readonly timestamp: ISOTimestamp;
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
}

export interface ConfidenceInterval {
  readonly level: number;
  readonly lower: number[];
  readonly upper: number[];
}

export interface AnomalyDetection {
  readonly algorithm: 'ISOLATION_FOREST' | 'ONE_CLASS_SVM' | 'STATISTICAL' | 'ENSEMBLE';
  readonly anomalies: Anomaly[];
  readonly threshold: number;
  readonly sensitivity: number;
}

export interface Anomaly {
  readonly timestamp: ISOTimestamp;
  readonly metric: string;
  readonly value: number;
  readonly score: number;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly explanation: string;
}

export interface Recommendation {
  readonly type: 'OPTIMIZATION' | 'SCALING' | 'CONFIGURATION' | 'MAINTENANCE';
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  readonly description: string;
  readonly impact: ImpactEstimate;
  readonly implementation: string;
}

export interface ImpactEstimate {
  readonly performance: number;
  readonly cost: number;
  readonly reliability: number;
  readonly effort: number;
}

export interface ObservabilityConfig {
  readonly tracing: TracingConfig;
  readonly logging: LoggingConfig;
  readonly metrics: MetricsConfig;
  readonly correlation: CorrelationConfig;
}

export interface TracingConfig {
  readonly enabled: boolean;
  readonly sampling: number;
  readonly retention: number;
  readonly exporters: string[];
}

export interface LoggingConfig {
  readonly level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  readonly structured: boolean;
  readonly retention: number;
  readonly aggregation: boolean;
}

export interface MetricsConfig {
  readonly collection: CollectionConfig;
  readonly storage: StorageConfig;
  readonly export: ExportConfig;
}

export interface CollectionConfig {
  readonly interval: number;
  readonly batch: boolean;
  readonly compression: boolean;
}

export interface StorageConfig {
  readonly type: 'MEMORY' | 'DISK' | 'DISTRIBUTED';
  readonly retention: number;
  readonly compression: boolean;
}

export interface ExportConfig {
  readonly enabled: boolean;
  readonly targets: string[];
  readonly format: 'PROMETHEUS' | 'INFLUX' | 'JSON';
}

export interface CorrelationConfig {
  readonly enabled: boolean;
  readonly timeWindow: number;
  readonly algorithms: string[];
  readonly threshold: number;
}