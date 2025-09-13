/** @fileoverview Types for dashboards and widgets. */
import { Uuid } from '../../types/common.types';

export type WidgetType = 'LINE_CHART' | 'BAR_CHART' | 'GAUGE' | 'TABLE';

export interface Dashboard {
  readonly dashboardId: Uuid;
  readonly name: string;
  readonly widgets: Widget[];
  readonly layout: Record<string, any>;
}

export interface Widget {
  readonly widgetId: Uuid;
  readonly title: string;
  readonly type: WidgetType;
  readonly dataSource: string; // e.g., metricId, API endpoint
  readonly config: Record<string, any>;
}
