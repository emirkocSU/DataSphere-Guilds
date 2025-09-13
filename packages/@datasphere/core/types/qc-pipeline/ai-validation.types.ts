/**
 * @fileoverview Types for AI-powered validation (Layer 2 of QC).
 * These types define the interaction with AI models for automated quality assessment.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

/** The configuration for an AI validation request. */
export interface AiValidatorConfig {
  readonly modelId: string; // Identifier for the specific AI model to use
  readonly provider: 'OPENAI' | 'CUSTOM' | 'LOCAL';
  readonly confidenceThreshold: number; // 0-1, threshold to pass for auto-approval
  readonly timeoutMs: number;
  readonly retries: number;
}

/** The result from an AI validation call. */
export interface AiValidationResult {
  readonly validationId: UUID;
  readonly submissionId: UUID;
  readonly configUsed: AiValidatorConfig;
  readonly isApproved: boolean;
  readonly confidenceScore: number; // 0-1
  readonly failureReasons?: string[];
  readonly suggestedFixes?: string[];
  readonly cost?: number; // Cost of the API call, if applicable
  readonly latencyMs: number;
  readonly timestamp: ISOTimestamp;
}
