/**
 * @fileoverview ML Pipeline Types
 */

export type ModelId = string;
export type ExperimentId = string;
export type FeatureId = string;
export type PipelineId = string;
export type ISOTimestamp = string;

export interface Model {
  id: ModelId;
  name: string;
  version: string;
  type: 'classification' | 'regression' | 'clustering' | 'recommendation';
  algorithm: string;
  framework: 'tensorflow' | 'pytorch' | 'sklearn' | 'xgboost';
  status: 'training' | 'trained' | 'deployed' | 'retired';
  metrics: ModelMetrics;
  features: FeatureId[];
  hyperparameters: Record<string, unknown>;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  mse?: number;
  rmse?: number;
  mae?: number;
  r2Score?: number;
  auc?: number;
  logloss?: number;
}

export interface Feature {
  id: FeatureId;
  name: string;
  type: 'numerical' | 'categorical' | 'text' | 'image' | 'timeseries';
  description: string;
  source: string;
  transformation: string;
  importance: number;
  nullable: boolean;
  dataType: string;
}

export interface TrainingJob {
  id: string;
  modelId: ModelId;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: ISOTimestamp;
  endTime?: ISOTimestamp;
  config: TrainingConfig;
  metrics: Record<string, number>;
  logs: string[];
}

export interface TrainingConfig {
  dataset: string;
  validationSplit: number;
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: string;
  loss: string;
  metrics: string[];
  earlyStoppingPatience?: number;
  checkpointFrequency?: number;
}

export interface Experiment {
  id: ExperimentId;
  name: string;
  description: string;
  models: ModelId[];
  baseline: ModelId;
  champion: ModelId;
  objective: string;
  status: 'running' | 'completed' | 'archived';
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  trafficSplit: Record<string, number>;
  status: 'draft' | 'running' | 'completed' | 'stopped';
  startTime: ISOTimestamp;
  endTime?: ISOTimestamp;
  metrics: ABMetrics;
}

export interface ABVariant {
  id: string;
  name: string;
  modelId: ModelId;
  trafficPercentage: number;
  isControl: boolean;
}

export interface ABMetrics {
  totalRequests: number;
  conversionRate: number;
  confidenceInterval: number;
  pValue: number;
  significance: boolean;
  lift: number;
}

export interface Prediction {
  id: string;
  modelId: ModelId;
  input: Record<string, unknown>;
  output: unknown;
  confidence: number;
  timestamp: ISOTimestamp;
  latency: number;
  version: string;
}

export interface ModelRegistry {
  models: Model[];
  experiments: Experiment[];
  deployments: Deployment[];
  versions: ModelVersion[];
}

export interface ModelVersion {
  id: string;
  modelId: ModelId;
  version: string;
  checksum: string;
  size: number;
  createdAt: ISOTimestamp;
  isActive: boolean;
}

export interface Deployment {
  id: string;
  modelId: ModelId;
  version: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'deploying' | 'deployed' | 'failed' | 'stopped';
  endpoint: string;
  replicas: number;
  resources: ResourceConfig;
  createdAt: ISOTimestamp;
}

export interface ResourceConfig {
  cpu: string;
  memory: string;
  gpu?: string;
  storage: string;
}