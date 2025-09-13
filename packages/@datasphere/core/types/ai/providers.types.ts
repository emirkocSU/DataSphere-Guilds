/** @fileoverview Types for AI/ML service providers. */
import { Uuid } from '../../types/common.types';

export type AIProviderType = 'OPENAI' | 'GOOGLE_AI' | 'CUSTOM';

export interface AIProviderConfig {
  readonly providerId: Uuid;
  readonly type: AIProviderType;
  readonly apiKey: string; // Should be managed securely
  readonly endpoint: string;
  readonly isActive: boolean;
}
