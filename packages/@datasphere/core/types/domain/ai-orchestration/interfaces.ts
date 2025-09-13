/** @fileoverview Interfaces for AI Orchestration services. */
import { Uuid } from '../../../types/common.types';
import { AIModel, AIModelType } from './types';

export interface IAIModelService {
  getModel(modelId: Uuid): Promise<AIModel | null>;
  listModels(type?: AIModelType): Promise<AIModel[]>;
  deployModel(modelId: Uuid): Promise<boolean>;
}
