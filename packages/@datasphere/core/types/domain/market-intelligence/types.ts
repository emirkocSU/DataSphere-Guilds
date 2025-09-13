/** @fileoverview Core types for Market Intelligence. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type MarketSegment = 'FREELANCE_DATA' | 'AI_TRAINING_DATA';

export interface MarketDataPoint {
  dataPointId: Uuid;
  segment: MarketSegment;
  metric: string; // e.g., 'demand', 'supply', 'price'
  value: number;
  timestamp: IsoTimestamp;
  region?: string;
}
