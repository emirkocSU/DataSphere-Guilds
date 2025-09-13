/** @fileoverview Types for partner integrations. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type IntegrationType = 'API' | 'WEBHOOK' | 'SDK';

export interface PartnerIntegration {
  readonly integrationId: Uuid;
  readonly partnerName: string;
  readonly type: IntegrationType;
  readonly apiKey?: string; // Managed securely
  readonly endpoint?: string;
  readonly isActive: boolean;
  readonly createdAt: IsoTimestamp;
}
