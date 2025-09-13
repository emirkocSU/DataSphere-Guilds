/** @fileoverview Core types for Prediction Models. */
import { Uuid, IsoTimestamp, Percentage } from '../../../types/common.types';

export type PredictionModelType = 'REGRESSION' | 'CLASSIFICATION' | 'FORECASTING';

export interface PredictionModel {
  modelId: Uuid;
  name: string;
  type: PredictionModelType;
  version: string;
  accuracy: Percentage;
  lastTrained: IsoTimestamp;
}
