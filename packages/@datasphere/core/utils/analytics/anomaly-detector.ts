/**
 * @fileoverview Anomaly Detection Engine
 */

import { EventEmitter } from 'events';
import { AnomalyConfig, TimeSeriesPoint, StreamEvent } from './types';

interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  timestamp: number;
  value: number;
  expectedRange: { min: number; max: number };
}

export class AnomalyDetector extends EventEmitter {
  private static instance: AnomalyDetector;
  private configs = new Map<string, AnomalyConfig>();
  private baselines = new Map<string, number[]>();
  private models = new Map<string, any>();

  private constructor() {
    super();
  }

  static getInstance(): AnomalyDetector {
    if (!AnomalyDetector.instance) {
      AnomalyDetector.instance = new AnomalyDetector();
    }
    return AnomalyDetector.instance;
  }

  registerConfig(metricId: string, config: AnomalyConfig): void {
    this.configs.set(metricId, config);
    this.baselines.set(metricId, []);
  }

  async detectAnomalies(
    metricId: string,
    dataPoints: TimeSeriesPoint[]
  ): Promise<AnomalyResult[]> {
    const config = this.configs.get(metricId);
    if (!config) return [];

    const results: AnomalyResult[] = [];
    
    for (const point of dataPoints) {
      const result = await this.detectAnomaly(metricId, point, config);
      if (result.isAnomaly) {
        results.push(result);
        this.emit('anomaly-detected', { metricId, result });
      }
    }

    return results;
  }

  private async detectAnomaly(
    metricId: string,
    point: TimeSeriesPoint,
    config: AnomalyConfig
  ): Promise<AnomalyResult> {
    switch (config.algorithm) {
      case 'statistical':
        return this.statisticalDetection(metricId, point, config);
      case 'ml':
        return this.mlDetection(metricId, point, config);
      case 'threshold':
        return this.thresholdDetection(point, config);
      default:
        return this.createNormalResult(point);
    }
  }

  private statisticalDetection(
    metricId: string,
    point: TimeSeriesPoint,
    config: AnomalyConfig
  ): AnomalyResult {
    const baseline = this.baselines.get(metricId) || [];
    baseline.push(point.value);
    
    // Keep only recent values for baseline
    if (baseline.length > config.baselineWindow) {
      baseline.shift();
    }
    
    this.baselines.set(metricId, baseline);
    
    if (baseline.length < 10) {
      return this.createNormalResult(point);
    }

    const mean = baseline.reduce((sum, v) => sum + v, 0) / baseline.length;
    const variance = baseline.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / baseline.length;
    const stdDev = Math.sqrt(variance);
    
    const zscore = Math.abs(point.value - mean) / stdDev;
    const threshold = 2 + (config.sensitivity * 2); // 2-6 sigma
    
    const isAnomaly = zscore > threshold;
    
    return {
      isAnomaly,
      score: zscore / threshold,
      severity: this.calculateSeverity(zscore / threshold),
      reason: `Statistical outlier: ${zscore.toFixed(2)} standard deviations`,
      timestamp: point.timestamp,
      value: point.value,
      expectedRange: {
        min: mean - (stdDev * threshold),
        max: mean + (stdDev * threshold)
      }
    };
  }

  private mlDetection(
    metricId: string,
    point: TimeSeriesPoint,
    config: AnomalyConfig
  ): AnomalyResult {
    // Simplified ML detection using isolation forest concept
    const baseline = this.baselines.get(metricId) || [];
    baseline.push(point.value);
    
    if (baseline.length > config.baselineWindow) {
      baseline.shift();
    }
    
    this.baselines.set(metricId, baseline);
    
    if (baseline.length < 20) {
      return this.createNormalResult(point);
    }

    // Simple isolation score based on distance from median
    const sorted = [...baseline].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const mad = sorted.map(v => Math.abs(v - median)).sort((a, b) => a - b)[Math.floor(sorted.length / 2)];
    
    const isolationScore = Math.abs(point.value - median) / (mad || 1);
    const threshold = 3 + (config.sensitivity * 2);
    
    const isAnomaly = isolationScore > threshold;
    
    return {
      isAnomaly,
      score: isolationScore / threshold,
      severity: this.calculateSeverity(isolationScore / threshold),
      reason: `ML isolation score: ${isolationScore.toFixed(2)}`,
      timestamp: point.timestamp,
      value: point.value,
      expectedRange: {
        min: median - (mad * threshold),
        max: median + (mad * threshold)
      }
    };
  }

  private thresholdDetection(point: TimeSeriesPoint, config: AnomalyConfig): AnomalyResult {
    const threshold = config.alertThreshold;
    const isAnomaly = point.value > threshold;
    
    return {
      isAnomaly,
      score: isAnomaly ? point.value / threshold : 0,
      severity: this.calculateSeverity(point.value / threshold),
      reason: `Threshold exceeded: ${point.value} > ${threshold}`,
      timestamp: point.timestamp,
      value: point.value,
      expectedRange: { min: 0, max: threshold }
    };
  }

  private calculateSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 2) return 'critical';
    if (score >= 1.5) return 'high';
    if (score >= 1.2) return 'medium';
    return 'low';
  }

  private createNormalResult(point: TimeSeriesPoint): AnomalyResult {
    return {
      isAnomaly: false,
      score: 0,
      severity: 'low',
      reason: 'Normal',
      timestamp: point.timestamp,
      value: point.value,
      expectedRange: { min: point.value, max: point.value }
    };
  }
}

export const createAnomalyDetector = (): AnomalyDetector => {
  return AnomalyDetector.getInstance();
};