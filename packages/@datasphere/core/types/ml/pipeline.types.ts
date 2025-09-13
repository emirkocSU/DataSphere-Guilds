/** @fileoverview Types for ML model training, deployment, and monitoring pipeline. */
import { Uuid, IsoTimestamp, Percentage } from '../../types/common.types';

export type MLStage = 'DATA_PREP' | 'TRAINING' | 'EVALUATION' | 'DEPLOYMENT' | 'MONITORING';

export interface MLPipeline {
  readonly pipelineId: Uuid;
  readonly name: string;
  readonly description: string;
  readonly currentStage: MLStage;
  readonly status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  readonly createdAt: IsoTimestamp;
  readonly lastUpdated: IsoTimestamp;
}

export interface ModelTrainingConfig {
  readonly modelId: Uuid;
  readonly datasetId: Uuid;
  readonly hyperparameters: Record<string, any>;
  readonly trainingTimeMinutes: number;
  readonly finalAccuracy: Percentage;
}

export interface ModelDeploymentConfig {
  readonly modelId: Uuid;
  readonly targetEnvironment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  readonly deploymentStrategy: 'BLUE_GREEN' | 'CANARY' | 'ROLLING_UPDATE';
  readonly trafficSplit?: Percentage;
}

export interface ModelMonitoringConfig {
  readonly modelId: Uuid;
  readonly driftDetectionEnabled: boolean;
  readonly anomalyDetectionEnabled: boolean;
  readonly retrainingTriggerThreshold: Percentage; // e.g., 0.05 for 5% accuracy drop
}
