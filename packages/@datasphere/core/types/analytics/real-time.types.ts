/** @fileoverview Types for real-time analytics data structures. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type StreamDataType = 'EVENT' | 'METRIC' | 'LOG';

export interface RealTimeDataPoint {
  readonly id: Uuid;
  readonly type: StreamDataType;
  readonly timestamp: IsoTimestamp;
  readonly value: number | string | Record<string, any>;
  readonly labels?: Record<string, string>;
}

export interface RealTimeDashboardUpdate {
  readonly dashboardId: Uuid;
  readonly widgetId: Uuid;
  readonly data: any; // Updated data for the widget
  readonly timestamp: IsoTimestamp;
}
