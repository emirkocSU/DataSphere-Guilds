/** @fileoverview API types for analytics and reporting requests and responses. */
import { Uuid } from '../../types/common.types';

export interface AnalyticsQueryRequest {
  metricName: string;
  timeRange: string;
  filters?: Record<string, any>;
}

export interface AnalyticsQueryResponse {
  queryId: Uuid;
  data: any[];
  metadata: Record<string, any>;
}
