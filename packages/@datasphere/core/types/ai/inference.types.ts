/** @fileoverview Types for AI/ML inference requests and responses. */
import { Uuid } from '../../types/common.types';

export interface InferenceRequest {
  readonly modelId: Uuid;
  readonly inputData: Record<string, any>;
  readonly requestId?: Uuid;
}

export interface InferenceResponse {
  readonly inferenceId: Uuid;
  readonly modelId: Uuid;
  readonly outputData: Record<string, any>;
  readonly confidence: number;
  readonly latencyMs: number;
}
