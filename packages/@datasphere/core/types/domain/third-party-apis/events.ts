/** @fileoverview Event types for Third-Party APIs. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { ExternalApiConfig } from './types';

export interface ApiCallLoggedEvent {
  eventId: Uuid;
  config: ExternalApiConfig;
  endpoint: string;
  success: boolean;
  timestamp: IsoTimestamp;
}
