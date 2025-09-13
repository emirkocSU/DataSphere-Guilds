/** @fileoverview Types for BI dashboards and visualization. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type DashboardLayoutType = 'GRID' | 'FREEFORM';
export type WidgetVisualizationType = 'BAR_CHART' | 'LINE_CHART' | 'PIE_CHART' | 'TABLE' | 'GAUGE';

export interface Dashboard {
  readonly dashboardId: Uuid;
  readonly name: string;
  readonly description?: string;
  readonly layout: DashboardLayoutType;
  readonly widgets: DashboardWidget[];
  readonly createdAt: IsoTimestamp;
  readonly lastUpdated: IsoTimestamp;
}

export interface DashboardWidget {
  readonly widgetId: Uuid;
  readonly title: string;
  readonly visualization: WidgetVisualizationType;
  readonly dataSource: string; // e.g., 'kpi:MRR', 'report:sales_daily'
  readonly config: Record<string, any>; // Visualization specific config
}
