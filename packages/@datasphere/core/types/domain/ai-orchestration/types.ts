/** @fileoverview Core types for AI Orchestration. */
import { Uuid, IsoTimestamp, Percentage } from '../../../types/common.types';

export type AIModelType = 'CLASSIFICATION' | 'REGRESSION' | 'ANOMALY_DETECTION';

export interface AIModel {
  modelId: Uuid;
  name: string;
  type: AIModelType;
  version: string;
  accuracy: Percentage;
  lastTrained: IsoTimestamp;
}
