/** @fileoverview API types for AI model interactions. */
import { Uuid } from '../../types/common.types';

export interface AIInferenceRequest {
  modelId: Uuid;
  inputData: any;
  context?: Record<string, any>;
}

export interface AIInferenceResponse {
  inferenceId: Uuid;
  outputData: any;
  confidence: number;
  latencyMs: number;
}
