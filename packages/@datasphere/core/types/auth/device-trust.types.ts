/** @fileoverview Types for device trust management. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type DeviceTrustLevel = 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface DeviceTrustRecord {
  readonly deviceId: Uuid;
  readonly userId: Uuid;
  readonly trustLevel: DeviceTrustLevel;
  readonly lastEvaluated: IsoTimestamp;
  readonly factors: Record<string, any>; // e.g., { geo_location_consistency: 0.9, ip_reputation: 'HIGH' }
  readonly isBlocked: boolean;
}
