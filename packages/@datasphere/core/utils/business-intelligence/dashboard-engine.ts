/**
 * @fileoverview Business Intelligence Dashboard Engine
 */

import { EventEmitter } from 'events';
import { Dashboard, Widget, KPI, Report, DashboardId, WidgetId, KPIId, ReportId, BusinessMetrics, DataSource } from './types';

export class DashboardEngine extends EventEmitter {
  private static instance: DashboardEngine;
  private dashboards = new Map<DashboardId, Dashboard>();
  private widgets = new Map<WidgetId, Widget>();
  private kpis = new Map<KPIId, KPI>();
  private reports = new Map<ReportId, Report>();
  private dataCache = new Map<string, { data: unknown; expires: number }>();

  private constructor() {
    super();
    this.startMetricsCollection();
  }

  static getInstance(): DashboardEngine {
    if (!DashboardEngine.instance) {
      DashboardEngine.instance = new DashboardEngine();
    }
    return DashboardEngine.instance;
  }

  createDashboard(config: Partial<Dashboard>): Dashboard {
    const dashboard: Dashboard = {
      id: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name!,
      description: config.description || '',
      type: config.type || 'custom',
      widgets: config.widgets || [],
      layout: config.layout || { type: 'grid', columns: 12, rows: 10, gap: 16, padding: 16, responsive: true },
      permissions: config.permissions || { view: [], edit: [], admin: [], share: true, export: true },
      settings: config.settings || { theme: 'auto', autoRefresh: true, refreshInterval: 300, showFilters: true, showToolbar: true, fullscreen: false, timezone: 'UTC' },
      createdBy: config.createdBy!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.dashboards.set(dashboard.id, dashboard);
    this.emit('dashboard-created', dashboard);
    return dashboard;
  }

  addWidget(dashboardId: DashboardId, widget: Widget): boolean {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return false;

    dashboard.widgets.push(widget);
    dashboard.updatedAt = new Date().toISOString();
    this.widgets.set(widget.id, widget);
    
    this.emit('widget-added', { dashboardId, widget });
    return true;
  }

  async executeQuery(dataSource: DataSource): Promise<Record<string, unknown>[]> {
    const cacheKey = `query_${JSON.stringify(dataSource)}`;
    
    if (dataSource.cache.enabled) {
      const cached = this.dataCache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.data as Record<string, unknown>[];
      }
    }

    let data: Record<string, unknown>[] = [];

    try {
      switch (dataSource.type) {
        case 'sql':
          data = await this.executeSQLQuery(dataSource);
          break;
        case 'api':
          data = await this.executeAPIQuery(dataSource);
          break;
        case 'real_time':
          data = await this.executeRealTimeQuery(dataSource);
          break;
        default:
          data = [];
      }

      // Apply transformations
      data = await this.applyTransforms(data, dataSource.transform);

      // Cache result
      if (dataSource.cache.enabled) {
        this.dataCache.set(cacheKey, {
          data,
          expires: Date.now() + (dataSource.cache.ttl * 1000)
        });
      }

      this.emit('query-executed', { dataSource, resultCount: data.length });
      return data;
    } catch (error) {
      this.emit('query-error', { dataSource, error });
      throw error;
    }
  }

  createKPI(config: Partial<KPI>): KPI {
    const kpi: KPI = {
      id: `kpi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name!,
      description: config.description || '',
      type: config.type!,
      category: config.category || 'general',
      calculation: config.calculation!,
      targets: config.targets || [],
      trends: config.trends || [],
      alerts: config.alerts || [],
      dimensions: config.dimensions || [],
      isActive: config.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.kpis.set(kpi.id, kpi);
    this.emit('kpi-created', kpi);
    return kpi;
  }

  async calculateKPI(kpiId: KPIId): Promise<number> {
    const kpi = this.kpis.get(kpiId);
    if (!kpi || !kpi.isActive) return 0;

    try {
      const data = await this.executeQuery(kpi.calculation.dataSource);
      const result = this.evaluateFormula(kpi.calculation.formula, data);
      
      // Update trends
      kpi.trends.push({
        period: new Date().toISOString(),
        value: result,
        change: 0, // Calculate based on previous value
        changePercent: 0,
        direction: 'stable'
      });

      // Check alerts
      this.checkKPIAlerts(kpi, result);

      this.emit('kpi-calculated', { kpiId, value: result });
      return result;
    } catch (error) {
      this.emit('kpi-error', { kpiId, error });
      return 0;
    }
  }

  generateReport(reportId: ReportId): Promise<Buffer> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);

    return this.renderReport(report);
  }

  getBusinessMetrics(): BusinessMetrics {
    return {
      revenue: { total: 0, recurring: 0, oneTime: 0, growth: 0, forecast: 0, breakdown: {} },
      users: { total: 0, active: 0, new: 0, retained: 0, churned: 0, segments: {} },
      engagement: { sessions: 0, pageViews: 0, duration: 0, bounceRate: 0, conversion: 0, features: {} },
      performance: { responseTime: 0, throughput: 0, errorRate: 0, uptime: 0, availability: 0, resources: {} },
      operations: { costs: 0, efficiency: 0, productivity: 0, quality: 0, satisfaction: 0, incidents: 0 }
    };
  }

  private async executeSQLQuery(dataSource: DataSource): Promise<Record<string, unknown>[]> {
    // Mock SQL execution
    return [{ id: 1, value: 100, timestamp: new Date().toISOString() }];
  }

  private async executeAPIQuery(dataSource: DataSource): Promise<Record<string, unknown>[]> {
    const response = await fetch(dataSource.connection.url!, {
      method: dataSource.query.method || 'GET',
      headers: dataSource.connection.headers,
      body: dataSource.query.body ? JSON.stringify(dataSource.query.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API query failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private async executeRealTimeQuery(dataSource: DataSource): Promise<Record<string, unknown>[]> {
    // Mock real-time data
    return [{ metric: 'users_online', value: Math.floor(Math.random() * 1000), timestamp: new Date().toISOString() }];
  }

  private async applyTransforms(data: Record<string, unknown>[], transforms: any[]): Promise<Record<string, unknown>[]> {
    let result = [...data];

    for (const transform of transforms.sort((a, b) => a.order - b.order)) {
      switch (transform.type) {
        case 'filter':
          result = result.filter(item => this.evaluateFilter(item, transform.config));
          break;
        case 'sort':
          result = result.sort((a, b) => this.compareValues(a[transform.config.field], b[transform.config.field]));
          break;
        case 'group':
          result = this.groupData(result, transform.config);
          break;
        case 'aggregate':
          result = this.aggregateData(result, transform.config);
          break;
      }
    }

    return result;
  }

  private evaluateFormula(formula: string, data: Record<string, unknown>[]): number {
    // Simple formula evaluation - can be extended with a proper parser
    if (formula === 'SUM(value)') {
      return data.reduce((sum, item) => sum + (item.value as number || 0), 0);
    }
    if (formula === 'AVG(value)') {
      return data.reduce((sum, item) => sum + (item.value as number || 0), 0) / data.length;
    }
    if (formula === 'COUNT(*)') {
      return data.length;
    }
    return 0;
  }

  private evaluateFilter(item: Record<string, unknown>, config: any): boolean {
    const value = item[config.field];
    switch (config.operator) {
      case 'eq': return value === config.value;
      case 'gt': return (value as number) > config.value;
      case 'lt': return (value as number) < config.value;
      default: return true;
    }
  }

  private compareValues(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    return String(a).localeCompare(String(b));
  }

  private groupData(data: Record<string, unknown>[], config: any): Record<string, unknown>[] {
    const groups = new Map<string, Record<string, unknown>[]>();
    
    for (const item of data) {
      const key = String(item[config.field]);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    }

    return Array.from(groups.entries()).map(([key, items]) => ({
      [config.field]: key,
      count: items.length,
      items
    }));
  }

  private aggregateData(data: Record<string, unknown>[], config: any): Record<string, unknown>[] {
    interface AggregateAccumulator {
      value: number;
      sum: number;
      count: number;
    }

    const result = data.reduce((acc: AggregateAccumulator, item) => {
      const value = item[config.field] as number || 0;
      switch (config.function) {
        case 'sum':
          acc.value += value;
          break;
        case 'avg':
          acc.sum += value;
          acc.count += 1;
          acc.value = acc.sum / acc.count;
          break;
        case 'count':
          acc.value += 1;
          break;
      }
      return acc;
    }, { value: 0, sum: 0, count: 0 });

    return [result];
  }

  private checkKPIAlerts(kpi: KPI, value: number): void {
    for (const alert of kpi.alerts) {
      const shouldTrigger = this.evaluateCondition(value, alert.condition, alert.threshold);
      
      if (shouldTrigger && !alert.isTriggered) {
        alert.isTriggered = true;
        alert.lastTriggered = new Date().toISOString();
        this.emit('kpi-alert-triggered', { kpi, alert, value });
      } else if (!shouldTrigger && alert.isTriggered) {
        alert.isTriggered = false;
        this.emit('kpi-alert-resolved', { kpi, alert, value });
      }
    }
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'above': return value > threshold;
      case 'below': return value < threshold;
      case 'equal': return value === threshold;
      default: return false;
    }
  }

  private async renderReport(report: Report): Promise<Buffer> {
    // Mock report generation
    const reportContent = `Report: ${report.name}\nGenerated: ${new Date().toISOString()}`;
    return Buffer.from(reportContent, 'utf8');
  }

  private startMetricsCollection(): void {
    setInterval(() => {
      this.emit('metrics-collected', this.getBusinessMetrics());
    }, 60000);
  }
}

export const createDashboardEngine = (): DashboardEngine => {
  return DashboardEngine.getInstance();
};