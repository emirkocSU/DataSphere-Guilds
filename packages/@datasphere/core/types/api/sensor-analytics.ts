/**
 * DataSphere Guilds - Sensor Analytics & Reporting Types
 * Optimized for real-time analytics, performance metrics, and mobile visualization
 * 
 * Bundle Impact: ~3-4KB (vs 9KB in monolith)
 * Performance Focus: Real-time processing, mobile visualization, computational efficiency
 */

import { BaseSensorData, SensorId, TimestampISO, SensorStatus, SensorType } from './sensor-core';

// ==================== CORE ANALYTICS TYPES ====================

export type AnalyticsTimeframe = '1h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'custom';

export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'median' | 'p95' | 'p99' | 'stddev';

export type MetricType = 
  | 'data-quality' | 'data-volume' | 'device-health' | 'connectivity' 
  | 'performance' | 'energy' | 'accuracy' | 'reliability' | 'cost';

export interface AnalyticsQuery {
  readonly id: string;
  readonly sensorIds?: SensorId[];
  readonly sensorTypes?: SensorType[];
  readonly metrics: MetricType[];
  readonly timeframe: AnalyticsTimeframe;
  readonly startTime?: TimestampISO;
  readonly endTime?: TimestampISO;
  readonly aggregation: AggregationType;
  readonly groupBy?: string[];
  readonly filters?: Record<string, any>;
  readonly realTime: boolean;
}

// ==================== REAL-TIME METRICS ====================

export interface RealTimeMetrics {
  readonly timestamp: TimestampISO;
  readonly dataPoints: number;
  readonly activeSensors: number;
  readonly averageLatency: number; // ms
  readonly throughputPerSecond: number;
  readonly errorRate: number; // 0-1
  readonly qualityScore: number; // 0-100
  readonly anomalieDetected: number;
  readonly networkHealth: number; // 0-1
  readonly systemLoad: number; // 0-1
}

export interface SensorMetrics {
  readonly sensorId: SensorId;
  readonly timestamp: TimestampISO;
  readonly dataQuality: DataQualityMetrics;
  readonly performance: PerformanceMetrics;
  readonly connectivity: ConnectivityMetrics;
  readonly health: HealthMetrics;
  readonly energy: EnergyMetrics;
}

export interface DataQualityMetrics {
  readonly completeness: number; // 0-1
  readonly accuracy: number; // 0-1
  readonly consistency: number; // 0-1
  readonly timeliness: number; // 0-1
  readonly validity: number; // 0-1
  readonly duplicateRate: number; // 0-1
  readonly outlierRate: number; // 0-1
  readonly missingDataRate: number; // 0-1
  readonly overallScore: number; // 0-100
}

export interface PerformanceMetrics {
  readonly responseTime: number; // ms
  readonly throughput: number; // data points per second
  readonly cpuUsage: number; // 0-1
  readonly memoryUsage: number; // 0-1
  readonly diskUsage: number; // 0-1
  readonly networkUsage: number; // bytes per second
  readonly errorCount: number;
  readonly successRate: number; // 0-1
  readonly availability: number; // 0-1
}

export interface ConnectivityMetrics {
  readonly signalStrength: number; // dBm
  readonly packetLoss: number; // 0-1
  readonly latency: number; // ms
  readonly jitter: number; // ms
  readonly bandwidth: number; // bps
  readonly connectionUptime: number; // 0-1
  readonly handoverCount: number;
  readonly dataUsage: number; // bytes
  readonly compressionRatio: number;
}

export interface HealthMetrics {
  readonly batteryLevel: number; // 0-100
  readonly temperature: number; // Celsius
  readonly humidity: number; // 0-100
  readonly vibration: number; // g
  readonly operationalStatus: number; // 0-1
  readonly maintenanceScore: number; // 0-100
  readonly lifespanRemaining: number; // 0-1
  readonly failurePrediction: number; // 0-1 (probability)
  readonly alertCount: number;
}

export interface EnergyMetrics {
  readonly powerConsumption: number; // watts
  readonly energyEfficiency: number; // data points per watt
  readonly batteryDrainRate: number; // %/hour
  readonly chargingEfficiency: number; // 0-1
  readonly estimatedRuntime: number; // hours
  readonly powerSavingActive: boolean;
  readonly energyCost: number; // currency units
  readonly carbonFootprint: number; // kg CO2
}

// ==================== MOBILE-FIRST ANALYTICS ====================

export interface MobileAnalyticsConfig {
  readonly maxDataPoints: number;
  readonly compressionLevel: 1 | 2 | 3 | 4 | 5;
  readonly cachingEnabled: boolean;
  readonly offlineAnalytics: boolean;
  readonly adaptiveRefresh: boolean;
  readonly batteryAwareUpdates: boolean;
  readonly dataUsageLimit: number; // MB per hour
  readonly lowDataMode: boolean;
}

export interface LightweightMetrics {
  readonly timestamp: TimestampISO;
  readonly value: number;
  readonly status: 'good' | 'warning' | 'error';
  readonly trend: 'increasing' | 'decreasing' | 'stable';
  readonly changePercent: number;
}

export interface CompactTimeSeriesData {
  readonly metric: MetricType;
  readonly timeframe: AnalyticsTimeframe;
  readonly dataPoints: LightweightMetrics[];
  readonly summary: {
    readonly min: number;
    readonly max: number;
    readonly avg: number;
    readonly current: number;
    readonly trend: 'up' | 'down' | 'stable';
    readonly changePercent: number;
  };
}

// ==================== DATA VISUALIZATION ====================

export interface ChartConfig {
  readonly type: 'line' | 'bar' | 'pie' | 'gauge' | 'heatmap' | 'scatter' | 'area';
  readonly title: string;
  readonly xAxis: AxisConfig;
  readonly yAxis: AxisConfig;
  readonly series: SeriesConfig[];
  readonly responsive: boolean;
  readonly realTimeUpdates: boolean;
  readonly maxDataPoints: number;
  readonly animationEnabled: boolean;
}

export interface AxisConfig {
  readonly label: string;
  readonly unit?: string;
  readonly min?: number;
  readonly max?: number;
  readonly logarithmic: boolean;
  readonly timeFormat?: string;
}

export interface SeriesConfig {
  readonly name: string;
  readonly metric: MetricType;
  readonly color: string;
  readonly lineWidth: number;
  readonly showPoints: boolean;
  readonly fillArea: boolean;
  readonly aggregation: AggregationType;
}

export interface DashboardLayout {
  readonly id: string;
  readonly name: string;
  readonly widgets: WidgetConfig[];
  readonly refreshInterval: number; // seconds
  readonly autoRefresh: boolean;
  readonly mobileOptimized: boolean;
  readonly darkModeSupported: boolean;
}

export interface WidgetConfig {
  readonly id: string;
  readonly type: 'chart' | 'gauge' | 'table' | 'map' | 'kpi' | 'alert-list';
  readonly title: string;
  readonly position: { x: number; y: number; width: number; height: number };
  readonly config: ChartConfig | GaugeConfig | TableConfig | MapConfig | KPIConfig;
  readonly dataSource: AnalyticsQuery;
  readonly updateInterval: number; // seconds
}

export interface GaugeConfig {
  readonly min: number;
  readonly max: number;
  readonly unit: string;
  readonly thresholds: {
    readonly good: { min: number; max: number; color: string };
    readonly warning: { min: number; max: number; color: string };
    readonly critical: { min: number; max: number; color: string };
  };
  readonly showValue: boolean;
  readonly showPercentage: boolean;
}

export interface TableConfig {
  readonly columns: TableColumn[];
  readonly sortable: boolean;
  readonly filterable: boolean;
  readonly pagination: boolean;
  readonly pageSize: number;
  readonly exportEnabled: boolean;
}

export interface TableColumn {
  readonly key: string;
  readonly label: string;
  readonly type: 'string' | 'number' | 'date' | 'boolean' | 'status';
  readonly format?: string;
  readonly sortable: boolean;
  readonly width?: number;
}

export interface MapConfig {
  readonly center: { lat: number; lng: number };
  readonly zoom: number;
  readonly clusteringEnabled: boolean;
  readonly heatmapEnabled: boolean;
  readonly markerConfig: {
    readonly colorByMetric: boolean;
    readonly sizeByValue: boolean;
    readonly showLabels: boolean;
  };
}

export interface KPIConfig {
  readonly metric: MetricType;
  readonly format: 'number' | 'percentage' | 'currency' | 'duration';
  readonly precision: number;
  readonly showTrend: boolean;
  readonly showComparison: boolean;
  readonly comparisonPeriod: AnalyticsTimeframe;
  readonly thresholds: {
    readonly good: number;
    readonly warning: number;
    readonly critical: number;
  };
}

// ==================== ANALYTICS PROCESSING ====================

export interface AnalyticsProcessor {
  readonly id: string;
  readonly type: 'aggregation' | 'transformation' | 'ml-model' | 'anomaly-detection' | 'forecasting';
  readonly inputMetrics: MetricType[];
  readonly outputMetrics: MetricType[];
  readonly processingLatency: number; // ms
  readonly accuracy: number; // 0-1
  readonly resourceUsage: ProcessorResourceUsage;
  readonly realTimeCapable: boolean;
}

export interface ProcessorResourceUsage {
  readonly cpuUsage: number; // 0-1
  readonly memoryUsageMB: number;
  readonly networkBandwidthBps: number;
  readonly storageUsageMB: number;
  readonly energyConsumptionWh: number;
  readonly costPerHour: number;
}

export interface AnomalyDetection {
  readonly algorithm: 'statistical' | 'ml-based' | 'rule-based' | 'hybrid';
  readonly sensitivity: number; // 0-1
  readonly falsePositiveRate: number; // 0-1
  readonly detectionLatency: number; // ms
  readonly trainingDataDays: number;
  readonly retrainingInterval: number; // hours
  readonly adaptiveThresholds: boolean;
}

export interface ForecastingModel {
  readonly algorithm: 'linear-regression' | 'arima' | 'lstm' | 'prophet' | 'ensemble';
  readonly forecastHorizon: number; // hours
  readonly confidence: number; // 0-1
  readonly accuracy: number; // 0-1 (historical)
  readonly trainingDataDays: number;
  readonly featureCount: number;
  readonly modelSizeMB: number;
}

// ==================== REPORTING & EXPORTS ====================

export interface ReportConfig {
  readonly id: string;
  readonly name: string;
  readonly template: 'summary' | 'detailed' | 'compliance' | 'performance' | 'custom';
  readonly metrics: MetricType[];
  readonly timeframe: AnalyticsTimeframe;
  readonly format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  readonly recipients: string[];
  readonly schedule: ScheduleConfig;
  readonly visualizations: ChartConfig[];
}

export interface ScheduleConfig {
  readonly frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on-demand';
  readonly time?: string; // HH:mm format
  readonly dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  readonly dayOfMonth?: number; // 1-31
  readonly timezone: string;
  readonly enabled: boolean;
}

export interface ReportGeneration {
  readonly reportId: string;
  readonly generationId: string;
  readonly status: 'queued' | 'generating' | 'completed' | 'failed';
  readonly progress: number; // 0-100
  readonly startTime: TimestampISO;
  readonly completionTime?: TimestampISO;
  readonly fileSizeMB?: number;
  readonly downloadUrl?: string;
  readonly errorMessage?: string;
}

export interface DataExport {
  readonly id: string;
  readonly type: 'raw-data' | 'aggregated' | 'processed' | 'analytics';
  readonly query: AnalyticsQuery;
  readonly format: 'csv' | 'json' | 'parquet' | 'avro';
  readonly compression: 'none' | 'gzip' | 'bzip2' | 'lz4';
  readonly estimatedSizeMB: number;
  readonly estimatedDurationMinutes: number;
  readonly maxRecords: number;
}

// ==================== REFERENCE-BASED HEAVY DATA ====================

export interface HeavyAnalyticsDataRef {
  readonly dataType: 'raw-timeseries' | 'processed-analytics' | 'ml-models' | 'historical-reports' | 'aggregated-data';
  readonly refId: string;
  readonly sizeEstimateMB: number;
  readonly recordCount: number;
  readonly timeRange: { start: TimestampISO; end: TimestampISO };
  readonly compressionRatio: number;
  readonly accessUrl?: string; // For lazy loading
  readonly queryOptimized: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface AnalyticsResponse {
  readonly queryId: string;
  readonly executionTime: number; // ms
  readonly dataPoints: number;
  readonly realTimeData: CompactTimeSeriesData[];
  readonly summary: AnalyticsSummary;
  readonly alerts: AnalyticsAlert[];
  readonly heavyDataRefs: HeavyAnalyticsDataRef[];
  readonly nextRefresh: TimestampISO;
}

export interface AnalyticsSummary {
  readonly totalSensors: number;
  readonly activeSensors: number;
  readonly averageQuality: number; // 0-100
  readonly totalDataPoints: number;
  readonly alertCount: number;
  readonly healthyDevices: number;
  readonly performanceScore: number; // 0-100
  readonly energyEfficiency: number;
  readonly costPerDataPoint: number;
}

export interface AnalyticsAlert {
  readonly id: string;
  readonly type: 'anomaly' | 'threshold' | 'pattern' | 'prediction';
  readonly severity: 'info' | 'warning' | 'error' | 'critical';
  readonly metric: MetricType;
  readonly sensorId?: SensorId;
  readonly message: string;
  readonly timestamp: TimestampISO;
  readonly acknowledged: boolean;
  readonly autoResolved: boolean;
  readonly value: number;
  readonly threshold: number;
}

export interface DashboardResponse {
  readonly dashboardId: string;
  readonly layout: DashboardLayout;
  readonly widgetData: Record<string, CompactTimeSeriesData[]>;
  readonly realTimeConnected: boolean;
  readonly lastUpdate: TimestampISO;
  readonly loadTime: number; // ms
  readonly cacheHit: boolean;
}

export interface ReportingResponse {
  readonly availableReports: ReportConfig[];
  readonly scheduledReports: ReportGeneration[];
  readonly recentReports: ReportGeneration[];
  readonly exportCapabilities: DataExport[];
  readonly processingQueue: {
    readonly position: number;
    readonly estimatedWaitMinutes: number;
  };
}

// ==================== EXPORTS ====================

export type {
  // Core analytics
  AnalyticsTimeframe, AggregationType, MetricType, AnalyticsQuery,
  
  // Real-time metrics
  RealTimeMetrics, SensorMetrics, DataQualityMetrics, PerformanceMetrics, 
  ConnectivityMetrics, HealthMetrics, EnergyMetrics,
  
  // Mobile analytics
  MobileAnalyticsConfig, LightweightMetrics, CompactTimeSeriesData,
  
  // Visualization
  ChartConfig, AxisConfig, SeriesConfig, DashboardLayout, WidgetConfig,
  GaugeConfig, TableConfig, MapConfig, KPIConfig,
  
  // Processing
  AnalyticsProcessor, ProcessorResourceUsage, AnomalyDetection, ForecastingModel,
  
  // Reporting
  ReportConfig, ScheduleConfig, ReportGeneration, DataExport,
  
  // References
  HeavyAnalyticsDataRef,
  
  // API responses
  AnalyticsResponse, AnalyticsSummary, AnalyticsAlert, DashboardResponse, ReportingResponse
}; 