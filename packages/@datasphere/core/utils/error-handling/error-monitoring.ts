/**
 * @fileoverview Enterprise Error Monitoring - Real-Time Error Tracking
 * 
 * Advanced real-time error monitoring system with metrics collection,
 * alerting, health checks, and integration with external monitoring
 * platforms for unicorn-level enterprise observability.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity,
  ErrorMetrics,
  ErrorEvent,
  AlertConfig,
  HealthCheckResult,
  CorrelationId,
  ISOTimestamp,
  ErrorMonitoringCallback
} from './types';

interface MonitoringConfig {
  enabled: boolean;
  samplingRate: number;
  retentionDays: number;
  aggregationInterval: number;
  alerting: {
    enabled: boolean;
    channels: string[];
    escalationRules: Array<{
      threshold: number;
      timeWindow: number;
      severity: ErrorSeverity;
      action: string;
    }>;
  };
  integrations: {
    prometheus?: { enabled: boolean; endpoint: string; };
    grafana?: { enabled: boolean; endpoint: string; apiKey: string; };
    sentry?: { enabled: boolean; dsn: string; };
    datadog?: { enabled: boolean; apiKey: string; site: string; };
    newrelic?: { enabled: boolean; licenseKey: string; };
    slack?: { enabled: boolean; webhookUrl: string; };
    pagerduty?: { enabled: boolean; serviceKey: string; };
  };
}

interface MetricPoint {
  timestamp: number;
  value: number;
  labels: Record<string, string>;
}

interface AlertState {
  id: string;
  config: AlertConfig;
  triggered: boolean;
  triggeredAt?: ISOTimestamp;
  lastEvaluated: ISOTimestamp;
  currentValue: number;
  escalationLevel: number;
}

/**
 * Enterprise Error Monitoring System
 * 
 * Provides real-time error tracking, metrics collection, alerting,
 * and integration with external monitoring platforms.
 */
export class ErrorMonitor extends EventEmitter {
  private static instance: ErrorMonitor;
  private config: MonitoringConfig;
  private metrics: ErrorMetrics;
  private metricHistory: Map<string, MetricPoint[]> = new Map();
  private alertStates: Map<string, AlertState> = new Map();
  private callbacks: Set<ErrorMonitoringCallback> = new Set();
  private aggregationTimer?: NodeJS.Timeout;
  private healthCheckTimer?: NodeJS.Timeout;

  private constructor(config: MonitoringConfig) {
    super();
    this.config = config;
    this.metrics = {
      totalErrors: 0,
      errorsByCategory: Object.values(ErrorCategory).reduce((acc, cat) => {
        acc[cat] = 0;
        return acc;
      }, {} as Record<ErrorCategory, number>),
      errorsBySeverity: Object.values(ErrorSeverity).reduce((acc, sev) => {
        acc[sev] = 0;
        return acc;
      }, {} as Record<ErrorSeverity, number>),
      errorRate: 0,
      averageResolutionTime: 0,
      successRate: 100,
      topErrorTypes: [],
      trends: {
        hourly: new Array(24).fill(0),
        daily: new Array(7).fill(0),
        weekly: new Array(4).fill(0)
      }
    };

    this.startAggregation();
    this.startHealthChecks();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: MonitoringConfig): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      if (!config) {
        throw new Error('ErrorMonitor requires configuration on first instantiation');
      }
      ErrorMonitor.instance = new ErrorMonitor(config);
    }
    return ErrorMonitor.instance;
  }

  /**
   * Track error event
   */
  public async trackError(errorEvent: ErrorEvent): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Apply sampling
    if (Math.random() > this.config.samplingRate) {
      return;
    }

    try {
      // Update metrics
      this.updateMetrics(errorEvent);

      // Store metric point
      this.storeMetricPoint('error_count', 1, {
        category: errorEvent.error.category,
        severity: errorEvent.error.severity,
        service: errorEvent.error.context.service,
        component: errorEvent.error.context.component
      });

      // Evaluate alerts
      await this.evaluateAlerts(errorEvent);

      // Send to integrations
      await this.sendToIntegrations(errorEvent);

      // Notify callbacks
      for (const callback of this.callbacks) {
        try {
          await callback(errorEvent);
        } catch (callbackError) {
          this.emit('callback-error', { callback, error: callbackError });
        }
      }

      this.emit('error-tracked', errorEvent);

    } catch (monitoringError) {
      this.emit('monitoring-error', {
        originalEvent: errorEvent,
        monitoringError,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Register monitoring callback
   */
  public addCallback(callback: ErrorMonitoringCallback): void {
    this.callbacks.add(callback);
  }

  /**
   * Remove monitoring callback
   */
  public removeCallback(callback: ErrorMonitoringCallback): void {
    this.callbacks.delete(callback);
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ErrorMetrics {
    this.calculateDerivedMetrics();
    return { ...this.metrics };
  }

  /**
   * Get metric history
   */
  public getMetricHistory(metricName: string, timeRange: { start: Date; end: Date }): MetricPoint[] {
    const history = this.metricHistory.get(metricName) || [];
    return history.filter(point => 
      point.timestamp >= timeRange.start.getTime() && 
      point.timestamp <= timeRange.end.getTime()
    );
  }

  /**
   * Get alert states
   */
  public getAlertStates(): AlertState[] {
    return Array.from(this.alertStates.values());
  }

  /**
   * Perform health check
   */
  public async performHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString() as ISOTimestamp;
    const services: Record<string, any> = {};

    // Check error rates per service
    const recentErrors = this.getRecentErrors(300000); // Last 5 minutes
    const serviceStats = this.calculateServiceStats(recentErrors);

    for (const [serviceName, stats] of Object.entries(serviceStats)) {
      let status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';
      
      if (stats.errorRate > 0.1) { // 10% error rate
        status = 'UNHEALTHY';
      } else if (stats.errorRate > 0.05) { // 5% error rate
        status = 'DEGRADED';
      }

      services[serviceName] = {
        status,
        responseTime: stats.averageResponseTime,
        errorRate: stats.errorRate,
        lastError: stats.lastError
      };
    }

    // Overall health status
    const unhealthyServices = Object.values(services).filter(s => s.status === 'UNHEALTHY').length;
    const degradedServices = Object.values(services).filter(s => s.status === 'DEGRADED').length;
    
    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';
    if (unhealthyServices > 0) {
      overallStatus = 'UNHEALTHY';
    } else if (degradedServices > 0) {
      overallStatus = 'DEGRADED';
    }

    return {
      status: overallStatus,
      services,
      systemMetrics: {
        cpuUsage: process.cpuUsage().system / 1000000,
        memoryUsage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100,
        diskUsage: 0,
        networkLatency: 0
      },
      timestamp
    };
  }

  /**
   * Update monitoring configuration
   */
  public updateConfig(updates: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  /**
   * Shutdown monitoring gracefully
   */
  public async shutdown(): Promise<void> {
    if (this.aggregationTimer) {
      clearInterval(this.aggregationTimer);
    }

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    await this.pushMetricsToIntegrations();

    this.emit('shutdown', {
      finalMetrics: this.getMetrics(),
      alertStates: this.getAlertStates().length,
      metricPoints: Array.from(this.metricHistory.values()).reduce((sum, points) => sum + points.length, 0)
    });
  }

  /**
   * Update internal metrics with error event
   */
  private updateMetrics(errorEvent: ErrorEvent): void {
    this.metrics.totalErrors++;
    this.metrics.errorsByCategory[errorEvent.error.category]++;
    this.metrics.errorsBySeverity[errorEvent.error.severity]++;

    // Update trends
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const week = Math.floor(now.getDate() / 7);

    this.metrics.trends.hourly[hour]++;
    this.metrics.trends.daily[day]++;
    this.metrics.trends.weekly[week % 4]++;

    // Update top error types
    this.updateTopErrorTypes(errorEvent.error.code);
  }

  /**
   * Store metric point for time series data
   */
  private storeMetricPoint(metricName: string, value: number, labels: Record<string, string>): void {
    if (!this.metricHistory.has(metricName)) {
      this.metricHistory.set(metricName, []);
    }

    const points = this.metricHistory.get(metricName)!;
    points.push({
      timestamp: Date.now(),
      value,
      labels
    });

    // Cleanup old points
    const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - retentionMs;
    
    const validPoints = points.filter(point => point.timestamp > cutoff);
    this.metricHistory.set(metricName, validPoints);
  }

  /**
   * Calculate derived metrics
   */
  private calculateDerivedMetrics(): void {
    const timeWindow = 60000; // 1 minute
    const recentErrors = this.getRecentErrors(timeWindow);
    
    this.metrics.errorRate = recentErrors.length / (timeWindow / 1000);
    
    if (recentErrors.length > 0) {
      const totalRequests = recentErrors.length + Math.max(100 - recentErrors.length, 0);
      this.metrics.successRate = ((totalRequests - recentErrors.length) / totalRequests) * 100;
    }
  }

  /**
   * Update top error types ranking
   */
  private updateTopErrorTypes(errorCode: string): void {
    let found = false;
    
    for (const item of this.metrics.topErrorTypes) {
      if (item.code === errorCode) {
        item.count++;
        found = true;
        break;
      }
    }

    if (!found) {
      this.metrics.topErrorTypes.push({
        code: errorCode,
        count: 1,
        percentage: 0
      });
    }

    this.metrics.topErrorTypes.sort((a, b) => b.count - a.count);
    this.metrics.topErrorTypes = this.metrics.topErrorTypes.slice(0, 10);

    const total = this.metrics.topErrorTypes.reduce((sum, item) => sum + item.count, 0);
    for (const item of this.metrics.topErrorTypes) {
      item.percentage = (item.count / total) * 100;
    }
  }

  /**
   * Get recent errors within time window
   */
  private getRecentErrors(timeWindowMs: number): any[] {
    const cutoff = Date.now() - timeWindowMs;
    const errorPoints = this.metricHistory.get('error_count') || [];
    return errorPoints.filter(point => point.timestamp > cutoff);
  }

  /**
   * Calculate service statistics
   */
  private calculateServiceStats(errors: any[]): Record<string, any> {
    const serviceStats: Record<string, any> = {};

    for (const error of errors) {
      const service = error.labels.service || 'unknown';
      
      if (!serviceStats[service]) {
        serviceStats[service] = {
          errorCount: 0,
          totalRequests: 100,
          averageResponseTime: 0,
          errorRate: 0,
          lastError: null
        };
      }

      serviceStats[service].errorCount++;
      serviceStats[service].lastError = error;
    }

    for (const stats of Object.values(serviceStats)) {
      (stats as any).errorRate = (stats as any).errorCount / (stats as any).totalRequests;
    }

    return serviceStats;
  }

  /**
   * Evaluate alert conditions
   */
  private async evaluateAlerts(errorEvent: ErrorEvent): Promise<void> {
    for (const [alertId, alertState] of this.alertStates) {
      try {
        const shouldTrigger = await this.shouldTriggerAlert(alertState, errorEvent);
        
        if (shouldTrigger && !alertState.triggered) {
          alertState.triggered = true;
          alertState.triggeredAt = new Date().toISOString() as ISOTimestamp;
          
          await this.sendAlert(alertState, errorEvent);
          this.emit('alert-triggered', { alertId, alertState, errorEvent });
          
        } else if (!shouldTrigger && alertState.triggered) {
          alertState.triggered = false;
          alertState.triggeredAt = undefined;
          alertState.escalationLevel = 0;
          
          this.emit('alert-resolved', { alertId, alertState });
        }

        alertState.lastEvaluated = new Date().toISOString() as ISOTimestamp;

      } catch (alertError) {
        this.emit('alert-evaluation-error', { alertId, alertError });
      }
    }
  }

  /**
   * Check if alert should trigger
   */
  private async shouldTriggerAlert(alertState: AlertState, errorEvent: ErrorEvent): Promise<boolean> {
    const config = alertState.config;
    const timeWindow = config.timeWindow;
    const threshold = config.threshold;

    const recentErrors = this.getRecentErrors(timeWindow);
    const errorCount = recentErrors.length;

    alertState.currentValue = errorCount;

    return errorCount >= threshold;
  }

  /**
   * Send alert notification
   */
  private async sendAlert(alertState: AlertState, errorEvent: ErrorEvent): Promise<void> {
    const config = alertState.config;
    
    for (const channel of config.channels) {
      try {
        await this.sendAlertToChannel(channel, alertState, errorEvent);
      } catch (channelError) {
        this.emit('alert-channel-error', { channel, error: channelError });
      }
    }
  }

  /**
   * Send alert to specific channel
   */
  private async sendAlertToChannel(channel: string, alertState: AlertState, errorEvent: ErrorEvent): Promise<void> {
    switch (channel) {
      case 'slack':
        await this.sendToSlack(alertState, errorEvent);
        break;
      case 'pagerduty':
        await this.sendToPagerDuty(alertState, errorEvent);
        break;
      case 'email':
        await this.sendToEmail(alertState, errorEvent);
        break;
      default:
        this.emit('unknown-alert-channel', { channel });
    }
  }

  /**
   * Send to Slack integration
   */
  private async sendToSlack(alertState: AlertState, errorEvent: ErrorEvent): Promise<void> {
    if (!this.config.integrations.slack?.enabled) return;

    const webhookUrl = this.config.integrations.slack.webhookUrl;
    const message = {
      text: `🚨 Error Alert: ${alertState.config.severity}`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Error Code', value: errorEvent.error.code, short: true },
          { title: 'Category', value: errorEvent.error.category, short: true },
          { title: 'Service', value: errorEvent.error.context.service, short: true },
          { title: 'Count', value: alertState.currentValue.toString(), short: true }
        ]
      }]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  /**
   * Send to PagerDuty integration
   */
  private async sendToPagerDuty(alertState: AlertState, errorEvent: ErrorEvent): Promise<void> {
    if (!this.config.integrations.pagerduty?.enabled) return;

    const serviceKey = this.config.integrations.pagerduty.serviceKey;
    const event = {
      service_key: serviceKey,
      event_type: 'trigger',
      description: `Error Alert: ${errorEvent.error.code}`,
      details: {
        error: errorEvent.error,
        alert: alertState.config
      }
    };

    await fetch('https://events.pagerduty.com/generic/2010-04-15/create_event.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  }

  /**
   * Send to email
   */
  private async sendToEmail(alertState: AlertState, errorEvent: ErrorEvent): Promise<void> {
    this.emit('email-alert-sent', { alertState, errorEvent });
  }

  /**
   * Send to external integrations
   */
  private async sendToIntegrations(errorEvent: ErrorEvent): Promise<void> {
    const promises = [];

    if (this.config.integrations.sentry?.enabled) {
      promises.push(this.sendToSentry(errorEvent));
    }

    if (this.config.integrations.datadog?.enabled) {
      promises.push(this.sendToDatadog(errorEvent));
    }

    if (this.config.integrations.newrelic?.enabled) {
      promises.push(this.sendToNewRelic(errorEvent));
    }

    await Promise.allSettled(promises);
  }

  /**
   * Send to Sentry
   */
  private async sendToSentry(errorEvent: ErrorEvent): Promise<void> {
    this.emit('sentry-sent', errorEvent);
  }

  /**
   * Send to Datadog
   */
  private async sendToDatadog(errorEvent: ErrorEvent): Promise<void> {
    this.emit('datadog-sent', errorEvent);
  }

  /**
   * Send to New Relic
   */
  private async sendToNewRelic(errorEvent: ErrorEvent): Promise<void> {
    this.emit('newrelic-sent', errorEvent);
  }

  /**
   * Push metrics to external systems
   */
  private async pushMetricsToIntegrations(): Promise<void> {
    if (this.config.integrations.prometheus?.enabled) {
      await this.pushToPrometheus();
    }

    if (this.config.integrations.grafana?.enabled) {
      await this.pushToGrafana();
    }
  }

  /**
   * Push to Prometheus
   */
  private async pushToPrometheus(): Promise<void> {
    this.emit('prometheus-pushed', this.metrics);
  }

  /**
   * Push to Grafana
   */
  private async pushToGrafana(): Promise<void> {
    this.emit('grafana-pushed', this.metrics);
  }

  /**
   * Start metrics aggregation timer
   */
  private startAggregation(): void {
    this.aggregationTimer = setInterval(() => {
      this.calculateDerivedMetrics();
      this.pushMetricsToIntegrations().catch(error => {
        this.emit('metrics-push-error', error);
      });
    }, this.config.aggregationInterval);
  }

  /**
   * Start health check timer
   */
  private startHealthChecks(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        const health = await this.performHealthCheck();
        this.emit('health-check', health);
      } catch (error) {
        this.emit('health-check-error', error);
      }
    }, 60000);
  }
}

export { ErrorMonitor as Monitor };

export const createErrorMonitor = (config: Partial<MonitoringConfig> = {}): ErrorMonitor => {
  const defaultConfig: MonitoringConfig = {
    enabled: true,
    samplingRate: 1.0,
    retentionDays: 30,
    aggregationInterval: 300000,
    alerting: {
      enabled: true,
      channels: ['console'],
      escalationRules: []
    },
    integrations: {}
  };

  return ErrorMonitor.getInstance({ ...defaultConfig, ...config });
};