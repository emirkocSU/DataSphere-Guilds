/** @fileoverview Core types for Third-Party APIs. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ApiProvider = 'STRIPE' | 'TWILIO' | 'GOOGLE_MAPS';

export interface ExternalApiConfig {
  configId: Uuid;
  provider: ApiProvider;
  apiKey: string; // Should be managed securely
  endpoint: string;
  isActive: boolean;
  createdAt: IsoTimestamp;
}
