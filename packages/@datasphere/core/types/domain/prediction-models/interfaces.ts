/** @fileoverview Interfaces for Prediction Models services. */
import { Uuid } from '../../../types/common.types';
import { PredictionModel, PredictionModelType } from './types';

export interface IPredictionService {
  predict(modelId: Uuid, input: Record<string, any>): Promise<any>;
  listModels(type?: PredictionModelType): Promise<PredictionModel[]>;
  trainModel(modelId: Uuid, data: any): Promise<PredictionModel>;
}
