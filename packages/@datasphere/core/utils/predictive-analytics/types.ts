/**
 * @fileoverview Predictive Analytics & Forecasting Types
 */

export type ModelId = string;
export type PredictionId = string;
export type ForecastId = string;
export type ISOTimestamp = string;

export enum ModelType {
  TIME_SERIES = 'time_series',
  CLASSIFICATION = 'classification',
  REGRESSION = 'regression',
  CLUSTERING = 'clustering',
  ANOMALY_DETECTION = 'anomaly_detection',
  NEURAL_NETWORK = 'neural_network'
}

export enum PredictionType {
  DEMAND = 'demand',
  CHURN = 'churn',
  REVENUE = 'revenue',
  RISK = 'risk',
  MAINTENANCE = 'maintenance',
  TREND = 'trend',
  MARKET = 'market'
}

export interface PredictiveModel {
  id: ModelId;
  name: string;
  type: ModelType;
  algorithm: string;
  features: ModelFeature[];
  hyperparameters: Record<string, unknown>;
  performance: ModelPerformance;
  training: TrainingConfig;
  deployment: DeploymentConfig;
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ModelFeature {
  name: string;
  type: 'numerical' | 'categorical' | 'text' | 'datetime';
  importance: number;
  correlation: number;
  distribution: FeatureDistribution;
  preprocessing: PreprocessingStep[];
}

export interface FeatureDistribution {
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  categories?: string[];
  nullCount: number;
}

export interface PreprocessingStep {
  type: 'scale' | 'normalize' | 'encode' | 'impute' | 'transform';
  parameters: Record<string, unknown>;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  mse: number;
  mae: number;
  r2: number;
  confusionMatrix: number[][];
  validationScore: number;
  crossValidationScore: number;
}

export interface TrainingConfig {
  algorithm: 'linear_regression' | 'random_forest' | 'xgboost' | 'neural_network' | 'arima' | 'lstm';
  splitRatio: number;
  validationMethod: 'holdout' | 'cross_validation' | 'time_series_split';
  earlyStoppingPatience: number;
  maxEpochs: number;
  batchSize: number;
  learningRate: number;
}

export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  endpoints: string[];
  scaling: ScalingConfig;
  monitoring: MonitoringConfig;
  rollback: RollbackConfig;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetUtilization: number;
  autoScaling: boolean;
}

export interface MonitoringConfig {
  metrics: string[];
  alerts: AlertConfig[];
  logging: boolean;
  sampling: number;
}

export interface AlertConfig {
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq';
  severity: 'low' | 'medium' | 'high';
  channels: string[];
}

export interface RollbackConfig {
  enabled: boolean;
  triggerConditions: string[];
  automaticRollback: boolean;
  rollbackVersion: string;
}

export interface Prediction {
  id: PredictionId;
  modelId: ModelId;
  type: PredictionType;
  input: Record<string, unknown>;
  output: PredictionOutput;
  confidence: number;
  probability: number;
  explanation: PredictionExplanation;
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
}

export interface PredictionOutput {
  value: number | string | boolean;
  category?: string;
  score?: number;
  ranking?: number;
  distribution?: Record<string, number>;
}

export interface PredictionExplanation {
  featureImportance: Record<string, number>;
  topFeatures: string[];
  reasoning: string;
  confidence: number;
  alternatives: Alternative[];
}

export interface Alternative {
  value: unknown;
  probability: number;
  explanation: string;
}

export interface Forecast {
  id: ForecastId;
  modelId: ModelId;
  type: PredictionType;
  timeRange: TimeRange;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  predictions: ForecastPoint[];
  confidence: ConfidenceInterval;
  accuracy: ForecastAccuracy;
  trends: TrendAnalysis;
  seasonality: SeasonalityPattern;
  metadata: Record<string, unknown>;
  createdAt: ISOTimestamp;
}

export interface TimeRange {
  start: ISOTimestamp;
  end: ISOTimestamp;
  periods: number;
}

export interface ForecastPoint {
  timestamp: ISOTimestamp;
  value: number;
  lower: number;
  upper: number;
  confidence: number;
}

export interface ConfidenceInterval {
  level: number;
  lower: number[];
  upper: number[];
}

export interface ForecastAccuracy {
  mape: number;
  smape: number;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
}

export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: number;
  changePoints: ChangePoint[];
  slope: number;
  volatility: number;
}

export interface ChangePoint {
  timestamp: ISOTimestamp;
  significance: number;
  direction: 'up' | 'down';
  magnitude: number;
}

export interface SeasonalityPattern {
  detected: boolean;
  period: number;
  strength: number;
  components: SeasonalComponent[];
}

export interface SeasonalComponent {
  name: string;
  period: number;
  amplitude: number;
  phase: number;
}

export interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeToChurn: number;
  factors: ChurnFactor[];
  interventions: Intervention[];
  retentionScore: number;
}

export interface ChurnFactor {
  factor: string;
  impact: number;
  value: unknown;
  category: 'behavioral' | 'transactional' | 'engagement' | 'demographic';
}

export interface Intervention {
  type: 'discount' | 'support' | 'engagement' | 'feature';
  description: string;
  effectiveness: number;
  cost: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface DemandForecast {
  product: string;
  region: string;
  timeframe: TimeRange;
  demand: number;
  confidence: number;
  factors: DemandFactor[];
  scenarios: DemandScenario[];
  recommendations: DemandRecommendation[];
}

export interface DemandFactor {
  name: string;
  impact: number;
  type: 'seasonal' | 'trend' | 'external' | 'promotional';
  value: number;
}

export interface DemandScenario {
  name: string;
  probability: number;
  demand: number;
  conditions: string[];
}

export interface DemandRecommendation {
  action: string;
  impact: number;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface RiskAssessment {
  entity: string;
  type: 'credit' | 'operational' | 'market' | 'compliance';
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigations: RiskMitigation[];
  probability: number;
  impact: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  value: number;
  category: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface RiskMitigation {
  strategy: string;
  effectiveness: number;
  cost: number;
  timeline: number;
  priority: 'low' | 'medium' | 'high';
}

export interface MaintenancePrediction {
  asset: string;
  type: 'preventive' | 'corrective' | 'predictive';
  probability: number;
  timeToFailure: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cost: MaintenanceCost;
  recommendations: MaintenanceRecommendation[];
  conditions: AssetCondition[];
}

export interface MaintenanceCost {
  preventive: number;
  corrective: number;
  downtime: number;
  total: number;
}

export interface MaintenanceRecommendation {
  action: string;
  priority: 'low' | 'medium' | 'high';
  cost: number;
  benefit: number;
  timeline: number;
}

export interface AssetCondition {
  parameter: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'degrading';
}

export interface MarketAnalysis {
  market: string;
  segment: string;
  timeframe: TimeRange;
  size: number;
  growth: number;
  trends: MarketTrend[];
  opportunities: MarketOpportunity[];
  threats: MarketThreat[];
  competitive: CompetitiveAnalysis;
}

export interface MarketTrend {
  name: string;
  direction: 'positive' | 'negative' | 'neutral';
  strength: number;
  impact: number;
  duration: number;
}

export interface MarketOpportunity {
  name: string;
  size: number;
  probability: number;
  timeframe: number;
  requirements: string[];
}

export interface MarketThreat {
  name: string;
  severity: number;
  probability: number;
  impact: number;
  mitigations: string[];
}

export interface CompetitiveAnalysis {
  competitors: Competitor[];
  marketShare: Record<string, number>;
  positioning: PositioningMatrix;
  gaps: string[];
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
}

export interface PositioningMatrix {
  dimensions: string[];
  positions: Record<string, number[]>;
}

export interface PredictiveAnalytics {
  models: PredictiveModel[];
  predictions: Prediction[];
  forecasts: Forecast[];
  performance: AnalyticsPerformance;
  insights: AnalyticsInsight[];
}

export interface AnalyticsPerformance {
  accuracy: number;
  coverage: number;
  latency: number;
  throughput: number;
  errors: number;
  uptime: number;
}

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'pattern' | 'correlation';
  description: string;
  confidence: number;
  impact: number;
  recommendations: string[];
  evidence: Record<string, unknown>;
}