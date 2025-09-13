/** @fileoverview Types for system-level resource and performance metrics. */
import { IsoTimestamp } from '../common.types';

export interface SystemMetrics {
  readonly timestamp: IsoTimestamp;
  readonly cpu: { load: number; cores: number; };
  readonly memory: { totalMb: number; usedMb: number; usage: number; };
  readonly disk: { totalGb: number; usedGb: number; usage: number; };
  readonly network: { requestsPerSecond: number; bandwidthMbps: number; };
}
