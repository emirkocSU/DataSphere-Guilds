/**
 * @fileoverview Dashboard Engine
 */

import { EventEmitter } from 'events';
import { DashboardConfig, Widget, Filter, TimeSeriesPoint } from './types';

export class DashboardEngine extends EventEmitter {
  private static instance: DashboardEngine;
  private dashboards = new Map<string, DashboardConfig>();
  private cache = new Map<string, { data: unknown; expires: number }>();

  private constructor() {
    super();
    setInterval(() => this.cleanup(), 60000);
  }

  static getInstance(): DashboardEngine {
    if (!DashboardEngine.instance) {
      DashboardEngine.instance = new DashboardEngine();
    }
    return DashboardEngine.instance;
  }

  createDashboard(config: DashboardConfig): void {
    this.dashboards.set(config.id, config);
    this.emit('dashboard-created', config);
  }

  async renderDashboard(dashboardId: string): Promise<Record<string, unknown>> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const widgets = await Promise.all(
      dashboard.widgets.map(widget => this.renderWidget(widget))
    );

    return {
      id: dashboard.id,
      name: dashboard.name,
      widgets: widgets.map((data, i) => ({
        ...dashboard.widgets[i],
        data
      })),
      lastUpdated: new Date().toISOString()
    };
  }

  async renderWidget(widget: Widget): Promise<unknown> {
    const cacheKey = `widget:${widget.id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    const data = await this.executeQuery(widget.query);
    const processed = this.processWidgetData(data, widget);
    
    this.cache.set(cacheKey, {
      data: processed,
      expires: Date.now() + 60000 // 1 minute
    });

    return processed;
  }

  private async executeQuery(query: string): Promise<TimeSeriesPoint[]> {
    // Mock query execution
    return [
      { timestamp: Date.now() - 3600000, value: 100, tags: {} },
      { timestamp: Date.now() - 1800000, value: 150, tags: {} },
      { timestamp: Date.now(), value: 200, tags: {} }
    ];
  }

  private processWidgetData(data: TimeSeriesPoint[], widget: Widget): unknown {
    switch (widget.type) {
      case 'chart':
        return {
          type: 'line',
          data: data.map(d => ({ x: d.timestamp, y: d.value })),
          options: widget.config
        };
      
      case 'metric':
        const latest = data[data.length - 1];
        return {
          value: latest?.value || 0,
          change: this.calculateChange(data),
          trend: this.calculateTrend(data)
        };
      
      case 'gauge':
        return {
          value: data[data.length - 1]?.value || 0,
          min: widget.config.min || 0,
          max: widget.config.max || 100,
          thresholds: widget.config.thresholds || []
        };
      
      case 'table':
        return {
          headers: ['Timestamp', 'Value'],
          rows: data.map(d => [new Date(d.timestamp).toISOString(), d.value])
        };
      
      default:
        return data;
    }
  }

  private calculateChange(data: TimeSeriesPoint[]): number {
    if (data.length < 2) return 0;
    
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    
    return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
  }

  private calculateTrend(data: TimeSeriesPoint[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const change = this.calculateChange(data);
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const createDashboardEngine = (): DashboardEngine => {
  return DashboardEngine.getInstance();
};