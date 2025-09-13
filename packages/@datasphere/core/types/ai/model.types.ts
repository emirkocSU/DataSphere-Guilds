/** @fileoverview Types for AI/ML models. */
import { Uuid, IsoTimestamp, Percentage } from '../../types/common.types';

export type ModelType = 'CLASSIFICATION' | 'REGRESSION' | 'ANOMALY_DETECTION';

export interface AIModel {
  readonly modelId: Uuid;
  readonly name: string;
  readonly type: ModelType;
  readonly version: string;
  readonly accuracy: Percentage;
  readonly lastTrained: IsoTimestamp;
  readonly inputFeatures: string[];
  readonly outputClasses?: string[];
}
