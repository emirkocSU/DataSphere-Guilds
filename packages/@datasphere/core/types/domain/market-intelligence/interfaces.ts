/** @fileoverview Interfaces for Market Intelligence services. */
import { Uuid } from '../../../types/common.types';
import { MarketDataPoint, MarketSegment } from './types';

export interface IMarketIntelligenceService {
  getMarketData(segment: MarketSegment, metric: string, startDate: IsoTimestamp, endDate: IsoTimestamp): Promise<MarketDataPoint[]>;
  predictMarketTrend(segment: MarketSegment, metric: string, horizonDays: number): Promise<number[]>;
}
