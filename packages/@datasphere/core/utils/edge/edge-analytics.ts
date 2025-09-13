/**
 * @fileoverview Edge Analytics System
 */

import { EventEmitter } from 'events';
import { EdgeAnalytics, EdgeRequest, EdgeResponse, RegionId, EdgeNodeId, RegionStat, PathStat, PerformanceMetrics } from './types';

export class EdgeAnalyticsManager extends EventEmitter {
  private static instance: EdgeAnalyticsManager;
  private analytics: EdgeAnalytics;
  private requestLogs: Array<{ request: EdgeRequest; response: EdgeResponse; timestamp: number }> = [];
  private maxLogs = 10000;

  private constructor() {
    super();
    this.analytics = {
      requests: 0,
      bandwidth: 0,
      errors: 0,
      cacheMisses: 0,
      topRegions: [],
      topPaths: [],
      performance: {
        averageLatency: 0,
        p95Latency: 0,
        p99Latency: 0,
        throughput: 0,
        errorRate: 0
      }
    };
    this.startAnalyticsAggregation();
  }

  static getInstance(): EdgeAnalyticsManager {
    if (!EdgeAnalyticsManager.instance) {
      EdgeAnalyticsManager.instance = new EdgeAnalyticsManager();
    }
    return EdgeAnalyticsManager.instance;
  }

  recordRequest(request: EdgeRequest, response: EdgeResponse): void {
    const timestamp = Date.now();
    
    // Add to request log
    this.requestLogs.push({ request, response, timestamp });
    
    // Maintain log size limit
    if (this.requestLogs.length > this.maxLogs) {
      this.requestLogs.shift();
    }

    // Update real-time metrics
    this.analytics.requests++;
    this.analytics.bandwidth += response.size;
    
    if (response.status >= 400) {
      this.analytics.errors++;
    }
    
    if (!response.cached) {
      this.analytics.cacheMisses++;
    }

    this.emit('request-recorded', { request, response });
  }

  getAnalytics(): EdgeAnalytics {
    return { ...this.analytics };
  }

  getRegionStats(region: RegionId): RegionStat | null {
    const regionRequests = this.requestLogs.filter(log => log.request.region === region);
    
    if (regionRequests.length === 0) return null;

    const requests = regionRequests.length;
    const bandwidth = regionRequests.reduce((sum, log) => sum + log.response.size, 0);
    const latency = regionRequests.reduce((sum, log) => sum + log.response.processingTime, 0) / requests;

    return {
      region,
      requests,
      bandwidth,
      latency
    };
  }

  getPathStats(path: string): PathStat | null {
    const pathRequests = this.requestLogs.filter(log => log.request.path === path);
    
    if (pathRequests.length === 0) return null;

    const requests = pathRequests.length;
    const errors = pathRequests.filter(log => log.response.status >= 400).length;
    const averageTime = pathRequests.reduce((sum, log) => sum + log.response.processingTime, 0) / requests;

    return {
      path,
      requests,
      errors,
      averageTime
    };
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const recentRequests = this.requestLogs.slice(-1000); // Last 1000 requests
    
    if (recentRequests.length === 0) {
      return {
        averageLatency: 0,
        p95Latency: 0,
        p99Latency: 0,
        throughput: 0,
        errorRate: 0
      };
    }

    const latencies = recentRequests.map(log => log.response.processingTime).sort((a, b) => a - b);
    const errors = recentRequests.filter(log => log.response.status >= 400).length;
    
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const p95Index = Math.floor(latencies.length * 0.95);
    const p99Index = Math.floor(latencies.length * 0.99);
    
    const timespan = recentRequests.length > 1 ? 
      (recentRequests[recentRequests.length - 1].timestamp - recentRequests[0].timestamp) / 1000 : 1;
    
    return {
      averageLatency,
      p95Latency: latencies[p95Index] || 0,
      p99Latency: latencies[p99Index] || 0,
      throughput: recentRequests.length / timespan,
      errorRate: errors / recentRequests.length
    };
  }

  getTopRegions(limit: number = 10): RegionStat[] {
    const regionMap = new Map<RegionId, { requests: number; bandwidth: number; latencies: number[] }>();
    
    for (const log of this.requestLogs) {
      const region = log.request.region;
      if (!regionMap.has(region)) {
        regionMap.set(region, { requests: 0, bandwidth: 0, latencies: [] });
      }
      
      const stats = regionMap.get(region)!;
      stats.requests++;
      stats.bandwidth += log.response.size;
      stats.latencies.push(log.response.processingTime);
    }

    return Array.from(regionMap.entries())
      .map(([region, stats]) => ({
        region,
        requests: stats.requests,
        bandwidth: stats.bandwidth,
        latency: stats.latencies.reduce((sum, lat) => sum + lat, 0) / stats.latencies.length
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, limit);
  }

  getTopPaths(limit: number = 10): PathStat[] {
    const pathMap = new Map<string, { requests: number; errors: number; times: number[] }>();
    
    for (const log of this.requestLogs) {
      const path = log.request.path;
      if (!pathMap.has(path)) {
        pathMap.set(path, { requests: 0, errors: 0, times: [] });
      }
      
      const stats = pathMap.get(path)!;
      stats.requests++;
      stats.times.push(log.response.processingTime);
      
      if (log.response.status >= 400) {
        stats.errors++;
      }
    }

    return Array.from(pathMap.entries())
      .map(([path, stats]) => ({
        path,
        requests: stats.requests,
        errors: stats.errors,
        averageTime: stats.times.reduce((sum, time) => sum + time, 0) / stats.times.length
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, limit);
  }

  generateReport(): {
    summary: EdgeAnalytics;
    regions: RegionStat[];
    paths: PathStat[];
    performance: PerformanceMetrics;
    recommendations: string[];
  } {
    const summary = this.getAnalytics();
    const regions = this.getTopRegions();
    const paths = this.getTopPaths();
    const performance = this.getPerformanceMetrics();
    const recommendations = this.generateRecommendations(performance, regions, paths);

    return {
      summary,
      regions,
      paths,
      performance,
      recommendations
    };
  }

  private generateRecommendations(performance: PerformanceMetrics, regions: RegionStat[], paths: PathStat[]): string[] {
    const recommendations: string[] = [];

    if (performance.errorRate > 0.05) {
      recommendations.push('High error rate detected. Review error logs and implement better error handling.');
    }

    if (performance.p95Latency > 1000) {
      recommendations.push('High P95 latency detected. Consider optimizing slow endpoints or adding more edge nodes.');
    }

    if (this.analytics.cacheMisses / this.analytics.requests > 0.7) {
      recommendations.push('Low cache hit rate. Review caching strategies and TTL settings.');
    }

    const slowPaths = paths.filter(path => path.averageTime > 500);
    if (slowPaths.length > 0) {
      recommendations.push(`Slow paths detected: ${slowPaths.map(p => p.path).join(', ')}. Consider optimization.`);
    }

    return recommendations;
  }

  private startAnalyticsAggregation(): void {
    setInterval(() => {
      this.analytics.topRegions = this.getTopRegions();
      this.analytics.topPaths = this.getTopPaths();
      this.analytics.performance = this.getPerformanceMetrics();
      
      this.emit('analytics-updated', this.analytics);
    }, 60000); // Update every minute
  }
}

export const createEdgeAnalyticsManager = (): EdgeAnalyticsManager => {
  return EdgeAnalyticsManager.getInstance();
};