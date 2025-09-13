/** @fileoverview Types for predictive analytics and forecasting. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type PredictionModelType = 'TIME_SERIES' | 'REGRESSION' | 'CLASSIFICATION';

export interface PredictionRequest {
  readonly modelId: Uuid;
  readonly inputData: Record<string, any>;
  readonly forecastHorizon?: number; // For time series
}

export interface PredictionResult {
  readonly predictionId: Uuid;
  readonly modelId: Uuid;
  readonly predictedValue: number | string | boolean;
  readonly confidenceScore: number; // 0-1
  readonly forecastDataPoints?: { timestamp: IsoTimestamp; value: number; }[];
}
