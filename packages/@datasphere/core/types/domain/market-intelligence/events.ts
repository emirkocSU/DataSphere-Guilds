/** @fileoverview Event types for Market Intelligence. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { MarketDataPoint } from './types';

export interface MarketDataUpdatedEvent {
  eventId: Uuid;
  dataPoint: MarketDataPoint;
  timestamp: IsoTimestamp;
}
