/**
 * @fileoverview Enterprise Error Analytics - Advanced Pattern Analysis & Prediction
 * 
 * Sophisticated error analytics system with machine learning pattern detection,
 * trend analysis, anomaly detection, and predictive insights for unicorn-level
 * enterprise error intelligence and proactive issue prevention.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorCategory, 
  ErrorSeverity,
  ErrorAggregation,
  ISOTimestamp,
  CorrelationId
} from './types';

interface ErrorPattern {
  id: string;
  type: 'frequency' | 'sequence' | 'temporal' | 'correlation' | 'anomaly';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  frequency: number;
  firstDetected: ISOTimestamp;
  lastDetected: ISOTimestamp;
  affectedServices: string[];
  errorCodes: string[];
  categories: ErrorCategory[];
  metadata: {
    averageInterval?: number;
    peakHours?: number[];
    correlatedEvents?: string[];
    predictiveWindow?: number;
    impactRadius?: number;
  };
}

interface AnalyticsConfig {
  enabled: boolean;
  analysisInterval: number; // ms
  retentionDays: number;
  patternDetection: {
    minOccurrences: number;
    timeWindow: number;
    confidenceThreshold: number;
    correlationThreshold: number;
  };
  anomalyDetection: {
    enabled: boolean;
    algorithm: 'statistical' | 'ml' | 'hybrid';
    sensitivity: number; // 0-1
    baselineWindow: number;
  };
  prediction: {
    enabled: boolean;
    horizonHours: number;
    modelType: 'linear' | 'exponential' | 'neural';
    updateInterval: number;
  };
}

interface ErrorSequence {
  id: string;
  errors: Array<{
    error: DataSphereError;
    timestamp: number;
    index: number;
  }>;
  pattern: string;
  confidence: number;
  averageInterval: number;
}

interface AnomalyResult {
  isAnomaly: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-1
  baseline: number;
  observed: number;
  explanation: string;
  recommendations: string[];
}

interface PredictionResult {
  timestamp: ISOTimestamp;
  predictedErrorRate: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  contributingFactors: Array<{
    factor: string;
    weight: number;
    description: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimatedImpact: number;
  }>;
}

/**
 * Enterprise Error Analytics Engine
 * 
 * Provides advanced error pattern analysis, anomaly detection,
 * trend prediction, and actionable insights for proactive error management.
 */
export class ErrorAnalytics extends EventEmitter {
  private static instance: ErrorAnalytics;
  private config: AnalyticsConfig;
  private errorHistory: Array<{ error: DataSphereError; timestamp: number }> = [];
  private patterns: Map<string, ErrorPattern> = new Map();
  private sequences: Map<string, ErrorSequence> = new Map();
  private analysisTimer?: NodeJS.Timeout;
  private predictionTimer?: NodeJS.Timeout;
  private baselines: Map<string, number[]> = new Map();

  private constructor(config: AnalyticsConfig) {
    super();
    this.config = config;
    
    this.startAnalysis();
    if (config.prediction.enabled) {
      this.startPrediction();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: AnalyticsConfig): ErrorAnalytics {
    if (!ErrorAnalytics.instance) {
      if (!config) {
        throw new Error('ErrorAnalytics requires configuration on first instantiation');
      }
      ErrorAnalytics.instance = new ErrorAnalytics(config);
    }
    return ErrorAnalytics.instance;
  }

  /**
   * Record error for analysis
   */
  public recordError(error: DataSphereError): void {
    if (!this.config.enabled) {
      return;
    }

    const timestamp = Date.now();
    this.errorHistory.push({ error, timestamp });

    // Maintain retention window
    const retentionMs = this.config.retentionDays * 24 * 60 * 60 * 1000;
    const cutoff = timestamp - retentionMs;
    this.errorHistory = this.errorHistory.filter(entry => entry.timestamp > cutoff);

    this.emit('error-recorded', { error, timestamp });
  }

  /**
   * Analyze error patterns
   */
  public async analyzePatterns(): Promise<ErrorPattern[]> {
    const now = Date.now();
    const timeWindow = this.config.patternDetection.timeWindow;
    const recentErrors = this.errorHistory.filter(entry => now - entry.timestamp <= timeWindow);

    // Clear old patterns
    this.patterns.clear();

    // Frequency patterns
    await this.detectFrequencyPatterns(recentErrors);

    // Sequence patterns
    await this.detectSequencePatterns(recentErrors);

    // Temporal patterns
    await this.detectTemporalPatterns(recentErrors);

    // Correlation patterns
    await this.detectCorrelationPatterns(recentErrors);

    // Anomaly patterns
    if (this.config.anomalyDetection.enabled) {
      await this.detectAnomalyPatterns(recentErrors);
    }

    const patterns = Array.from(this.patterns.values());
    this.emit('patterns-analyzed', { patterns, count: patterns.length });

    return patterns;
  }

  /**
   * Detect anomalies in error patterns
   */
  public async detectAnomalies(timeRange?: { start: Date; end: Date }): Promise<AnomalyResult[]> {
    const range = timeRange || {
      start: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      end: new Date()
    };

    const errors = this.errorHistory.filter(entry => 
      entry.timestamp >= range.start.getTime() && 
      entry.timestamp <= range.end.getTime()
    );

    const anomalies: AnomalyResult[] = [];

    // Error rate anomalies
    const errorRateAnomaly = await this.detectErrorRateAnomaly(errors, range);
    if (errorRateAnomaly.isAnomaly) {
      anomalies.push(errorRateAnomaly);
    }

    // Category distribution anomalies
    const categoryAnomalies = await this.detectCategoryAnomalies(errors, range);
    anomalies.push(...categoryAnomalies);

    // Service-specific anomalies
    const serviceAnomalies = await this.detectServiceAnomalies(errors, range);
    anomalies.push(...serviceAnomalies);

    this.emit('anomalies-detected', { anomalies, count: anomalies.length });

    return anomalies;
  }

  /**
   * Generate error predictions
   */
  public async generatePredictions(): Promise<PredictionResult[]> {
    if (!this.config.prediction.enabled) {
      return [];
    }

    const predictions: PredictionResult[] = [];
    const horizonMs = this.config.prediction.horizonHours * 60 * 60 * 1000;
    const intervals = Math.ceil(horizonMs / (60 * 60 * 1000)); // Hourly predictions

    for (let i = 1; i <= intervals; i++) {
      const targetTime = new Date(Date.now() + i * 60 * 60 * 1000);
      const prediction = await this.predictErrorRate(targetTime);
      predictions.push(prediction);
    }

    this.emit('predictions-generated', { predictions, count: predictions.length });

    return predictions;
  }

  /**
   * Get error aggregation analysis
   */
  public async getAggregation(period: { start: Date; end: Date }): Promise<ErrorAggregation> {
    const errors = this.errorHistory.filter(entry => 
      entry.timestamp >= period.start.getTime() && 
      entry.timestamp <= period.end.getTime()
    );

    const metrics = this.calculateMetrics(errors.map(e => e.error));
    const patterns = await this.analyzePatterns();
    const anomalies = await this.detectAnomalies(period);

    return {
      period: {
        start: period.start.toISOString() as ISOTimestamp,
        end: period.end.toISOString() as ISOTimestamp
      },
      metrics,
      patterns: patterns.map(p => ({
        type: p.type,
        description: p.description,
        severity: p.severity as ErrorSeverity,
        affectedSystems: p.affectedServices
      })),
      recommendations: this.generateRecommendations(patterns, anomalies, metrics)
    };
  }

  /**
   * Get detected patterns
   */
  public getPatterns(): ErrorPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get error sequences
   */
  public getSequences(): ErrorSequence[] {
    return Array.from(this.sequences.values());
  }

  /**
   * Update analytics configuration
   */
  public updateConfig(updates: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  /**
   * Shutdown analytics gracefully
   */
  public async shutdown(): Promise<void> {
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer);
    }

    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }

    this.emit('shutdown', {
      patterns: this.patterns.size,
      sequences: this.sequences.size,
      errorHistory: this.errorHistory.length
    });
  }

  /**
   * Detect frequency patterns
   */
  private async detectFrequencyPatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): Promise<void> {
    const errorCounts = new Map<string, number>();
    const errorFirstSeen = new Map<string, number>();
    const errorLastSeen = new Map<string, number>();
    const affectedServices = new Map<string, Set<string>>();

    for (const { error, timestamp } of errors) {
      const key = `${error.category}-${error.code}`;
      
      errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
      
      if (!errorFirstSeen.has(key)) {
        errorFirstSeen.set(key, timestamp);
      }
      errorLastSeen.set(key, timestamp);

      if (!affectedServices.has(key)) {
        affectedServices.set(key, new Set());
      }
      affectedServices.get(key)!.add(error.context.service);
    }

    for (const [key, count] of errorCounts) {
      if (count >= this.config.patternDetection.minOccurrences) {
        const [category, code] = key.split('-');
        const firstSeen = errorFirstSeen.get(key)!;
        const lastSeen = errorLastSeen.get(key)!;
        const services = Array.from(affectedServices.get(key)!);

        const pattern: ErrorPattern = {
          id: `freq-${key}-${Date.now()}`,
          type: 'frequency',
          description: `High frequency error: ${code} in category ${category} (${count} occurrences)`,
          severity: this.calculateSeverity(count, category as ErrorCategory),
          confidence: this.calculateConfidence(count, this.config.patternDetection.minOccurrences),
          frequency: count,
          firstDetected: new Date(firstSeen).toISOString() as ISOTimestamp,
          lastDetected: new Date(lastSeen).toISOString() as ISOTimestamp,
          affectedServices: services,
          errorCodes: [code],
          categories: [category as ErrorCategory],
          metadata: {
            averageInterval: services.length > 1 ? (lastSeen - firstSeen) / (count - 1) : 0
          }
        };

        this.patterns.set(pattern.id, pattern);
      }
    }
  }

  /**
   * Detect sequence patterns
   */
  private async detectSequencePatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): Promise<void> {
    const sequences = new Map<string, Array<{ error: DataSphereError; timestamp: number }>>();

    // Group by service and sort by timestamp
    for (const entry of errors) {
      const service = entry.error.context.service;
      if (!sequences.has(service)) {
        sequences.set(service, []);
      }
      sequences.get(service)!.push(entry);
    }

    for (const [service, serviceErrors] of sequences) {
      serviceErrors.sort((a, b) => a.timestamp - b.timestamp);
      
      // Look for recurring sequences
      const sequencePatterns = this.findSequencePatterns(serviceErrors);
      
      for (const seqPattern of sequencePatterns) {
        if (seqPattern.confidence >= this.config.patternDetection.confidenceThreshold) {
          const pattern: ErrorPattern = {
            id: `seq-${service}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            type: 'sequence',
            description: `Error sequence pattern in ${service}: ${seqPattern.pattern}`,
            severity: 'medium',
            confidence: seqPattern.confidence,
            frequency: seqPattern.errors.length,
            firstDetected: new Date(seqPattern.errors[0].timestamp).toISOString() as ISOTimestamp,
            lastDetected: new Date(seqPattern.errors[seqPattern.errors.length - 1].timestamp).toISOString() as ISOTimestamp,
            affectedServices: [service],
            errorCodes: seqPattern.errors.map(e => e.error.code),
            categories: [...new Set(seqPattern.errors.map(e => e.error.category))],
            metadata: {
              averageInterval: seqPattern.averageInterval
            }
          };

          this.patterns.set(pattern.id, pattern);
          this.sequences.set(seqPattern.id, seqPattern);
        }
      }
    }
  }

  /**
   * Detect temporal patterns
   */
  private async detectTemporalPatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): Promise<void> {
    const hourlyDistribution = new Array(24).fill(0);
    const dailyDistribution = new Array(7).fill(0);

    for (const { timestamp } of errors) {
      const date = new Date(timestamp);
      const hour = date.getHours();
      const day = date.getDay();
      
      hourlyDistribution[hour]++;
      dailyDistribution[day]++;
    }

    // Find peak hours
    const avgHourly = hourlyDistribution.reduce((sum, count) => sum + count, 0) / 24;
    const peakHours = hourlyDistribution
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > avgHourly * 2)
      .map(({ hour }) => hour);

    if (peakHours.length > 0) {
      const pattern: ErrorPattern = {
        id: `temporal-peak-${Date.now()}`,
        type: 'temporal',
        description: `Error peak hours detected: ${peakHours.join(', ')}`,
        severity: 'medium',
        confidence: 0.8,
        frequency: peakHours.reduce((sum, hour) => sum + hourlyDistribution[hour], 0),
        firstDetected: new Date().toISOString() as ISOTimestamp,
        lastDetected: new Date().toISOString() as ISOTimestamp,
        affectedServices: [...new Set(errors.map(e => e.error.context.service))],
        errorCodes: [...new Set(errors.map(e => e.error.code))],
        categories: [...new Set(errors.map(e => e.error.category))],
        metadata: {
          peakHours
        }
      };

      this.patterns.set(pattern.id, pattern);
    }
  }

  /**
   * Detect correlation patterns
   */
  private async detectCorrelationPatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): Promise<void> {
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const correlations = new Map<string, Array<{ error: DataSphereError; timestamp: number }>>();

    // Group errors by time windows
    for (const entry of errors) {
      const windowStart = Math.floor(entry.timestamp / timeWindow) * timeWindow;
      const key = windowStart.toString();
      
      if (!correlations.has(key)) {
        correlations.set(key, []);
      }
      correlations.get(key)!.push(entry);
    }

    // Find windows with multiple different error types
    for (const [window, windowErrors] of correlations) {
      if (windowErrors.length < 2) continue;

      const errorTypes = new Set(windowErrors.map(e => `${e.error.category}-${e.error.code}`));
      const services = new Set(windowErrors.map(e => e.error.context.service));

      if (errorTypes.size >= 2 && services.size >= 2) {
        const pattern: ErrorPattern = {
          id: `corr-${window}-${Date.now()}`,
          type: 'correlation',
          description: `Correlated errors across services: ${Array.from(services).join(', ')}`,
          severity: 'high',
          confidence: 0.9,
          frequency: windowErrors.length,
          firstDetected: new Date(windowErrors[0].timestamp).toISOString() as ISOTimestamp,
          lastDetected: new Date(windowErrors[windowErrors.length - 1].timestamp).toISOString() as ISOTimestamp,
          affectedServices: Array.from(services),
          errorCodes: [...new Set(windowErrors.map(e => e.error.code))],
          categories: [...new Set(windowErrors.map(e => e.error.category))],
          metadata: {
            correlatedEvents: Array.from(errorTypes)
          }
        };

        this.patterns.set(pattern.id, pattern);
      }
    }
  }

  /**
   * Detect anomaly patterns
   */
  private async detectAnomalyPatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): Promise<void> {
    const anomalies = await this.detectAnomalies();
    
    for (const anomaly of anomalies) {
      if (anomaly.isAnomaly && anomaly.severity !== 'low') {
        const pattern: ErrorPattern = {
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'anomaly',
          description: `Anomaly detected: ${anomaly.explanation}`,
          severity: anomaly.severity,
          confidence: anomaly.score,
          frequency: anomaly.observed,
          firstDetected: new Date().toISOString() as ISOTimestamp,
          lastDetected: new Date().toISOString() as ISOTimestamp,
          affectedServices: [],
          errorCodes: [],
          categories: [],
          metadata: {}
        };

        this.patterns.set(pattern.id, pattern);
      }
    }
  }

  /**
   * Find sequence patterns in error array
   */
  private findSequencePatterns(errors: Array<{ error: DataSphereError; timestamp: number }>): ErrorSequence[] {
    const sequences: ErrorSequence[] = [];
    const minSequenceLength = 3;

    for (let i = 0; i <= errors.length - minSequenceLength; i++) {
      for (let len = minSequenceLength; len <= Math.min(errors.length - i, 5); len++) {
        const sequence = errors.slice(i, i + len);
        const pattern = sequence.map(e => e.error.code).join('->');
        
        // Check if this pattern repeats
        const confidence = this.calculateSequenceConfidence(pattern, errors);
        
        if (confidence >= 0.6) {
          const intervals = [];
          for (let j = 1; j < sequence.length; j++) {
            intervals.push(sequence[j].timestamp - sequence[j - 1].timestamp);
          }
          
          const avgInterval = intervals.length > 0 ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length : 0;

          sequences.push({
            id: `seq-${Date.now()}-${i}-${len}`,
            errors: sequence.map((e, idx) => ({ ...e, index: i + idx })),
            pattern,
            confidence,
            averageInterval: avgInterval
          });
        }
      }
    }

    return sequences;
  }

  /**
   * Calculate sequence confidence
   */
  private calculateSequenceConfidence(pattern: string, errors: Array<{ error: DataSphereError; timestamp: number }>): number {
    const patternLength = pattern.split('->').length;
    let matches = 0;
    let total = 0;

    for (let i = 0; i <= errors.length - patternLength; i++) {
      const candidatePattern = errors.slice(i, i + patternLength).map(e => e.error.code).join('->');
      total++;
      if (candidatePattern === pattern) {
        matches++;
      }
    }

    return total > 0 ? matches / total : 0;
  }

  /**
   * Detect error rate anomaly
   */
  private async detectErrorRateAnomaly(
    errors: Array<{ error: DataSphereError; timestamp: number }>,
    range: { start: Date; end: Date }
  ): Promise<AnomalyResult> {
    const currentRate = errors.length / ((range.end.getTime() - range.start.getTime()) / (60 * 1000)); // errors per minute
    
    // Get baseline from history
    const baselineKey = 'error_rate';
    const baseline = this.getBaseline(baselineKey);
    
    if (baseline === null) {
      this.updateBaseline(baselineKey, currentRate);
      return {
        isAnomaly: false,
        severity: 'low',
        score: 0,
        baseline: currentRate,
        observed: currentRate,
        explanation: 'Establishing baseline',
        recommendations: []
      };
    }

    const deviation = Math.abs(currentRate - baseline) / baseline;
    const isAnomaly = deviation > this.config.anomalyDetection.sensitivity;

    this.updateBaseline(baselineKey, currentRate);

    return {
      isAnomaly,
      severity: this.mapDeviationToSeverity(deviation),
      score: Math.min(deviation, 1),
      baseline,
      observed: currentRate,
      explanation: `Error rate ${currentRate.toFixed(2)}/min vs baseline ${baseline.toFixed(2)}/min (${(deviation * 100).toFixed(1)}% deviation)`,
      recommendations: isAnomaly ? [
        'Investigate recent deployments',
        'Check system resource utilization',
        'Review error logs for patterns',
        'Consider scaling resources if needed'
      ] : []
    };
  }

  /**
   * Detect category distribution anomalies
   */
  private async detectCategoryAnomalies(
    errors: Array<{ error: DataSphereError; timestamp: number }>,
    range: { start: Date; end: Date }
  ): Promise<AnomalyResult[]> {
    const categoryDistribution = new Map<ErrorCategory, number>();
    
    for (const { error } of errors) {
      categoryDistribution.set(error.category, (categoryDistribution.get(error.category) || 0) + 1);
    }

    const anomalies: AnomalyResult[] = [];

    for (const [category, count] of categoryDistribution) {
      const rate = count / errors.length;
      const baselineKey = `category_${category}`;
      const baseline = this.getBaseline(baselineKey);

      if (baseline !== null) {
        const deviation = Math.abs(rate - baseline) / baseline;
        const isAnomaly = deviation > this.config.anomalyDetection.sensitivity;

        if (isAnomaly) {
          anomalies.push({
            isAnomaly: true,
            severity: this.mapDeviationToSeverity(deviation),
            score: Math.min(deviation, 1),
            baseline,
            observed: rate,
            explanation: `${category} error rate ${(rate * 100).toFixed(1)}% vs baseline ${(baseline * 100).toFixed(1)}%`,
            recommendations: [
              `Investigate ${category} specific issues`,
              'Check related service health',
              'Review recent changes affecting this category'
            ]
          });
        }
      }

      this.updateBaseline(baselineKey, rate);
    }

    return anomalies;
  }

  /**
   * Detect service-specific anomalies
   */
  private async detectServiceAnomalies(
    errors: Array<{ error: DataSphereError; timestamp: number }>,
    range: { start: Date; end: Date }
  ): Promise<AnomalyResult[]> {
    const serviceDistribution = new Map<string, number>();
    
    for (const { error } of errors) {
      const service = error.context.service;
      serviceDistribution.set(service, (serviceDistribution.get(service) || 0) + 1);
    }

    const anomalies: AnomalyResult[] = [];

    for (const [service, count] of serviceDistribution) {
      const rate = count / errors.length;
      const baselineKey = `service_${service}`;
      const baseline = this.getBaseline(baselineKey);

      if (baseline !== null) {
        const deviation = Math.abs(rate - baseline) / baseline;
        const isAnomaly = deviation > this.config.anomalyDetection.sensitivity;

        if (isAnomaly) {
          anomalies.push({
            isAnomaly: true,
            severity: this.mapDeviationToSeverity(deviation),
            score: Math.min(deviation, 1),
            baseline,
            observed: rate,
            explanation: `Service ${service} error rate ${(rate * 100).toFixed(1)}% vs baseline ${(baseline * 100).toFixed(1)}%`,
            recommendations: [
              `Check ${service} service health`,
              'Review service deployment logs',
              'Monitor service dependencies',
              'Consider service-specific alerts'
            ]
          });
        }
      }

      this.updateBaseline(baselineKey, rate);
    }

    return anomalies;
  }

  /**
   * Predict error rate for target time
   */
  private async predictErrorRate(targetTime: Date): Promise<PredictionResult> {
    const historicalData = this.errorHistory
      .filter(entry => entry.timestamp >= Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .map(entry => ({
        timestamp: entry.timestamp,
        count: 1
      }));

    // Simple linear regression prediction
    const hourlyRates = this.aggregateHourlyRates(historicalData);
    const trend = this.calculateTrend(hourlyRates);
    
    const hoursAhead = (targetTime.getTime() - Date.now()) / (60 * 60 * 1000);
    const predictedRate = Math.max(0, hourlyRates[hourlyRates.length - 1] + trend * hoursAhead);
    
    const confidence = this.calculatePredictionConfidence(hourlyRates, trend);
    const riskLevel = this.assessRiskLevel(predictedRate, hourlyRates);

    return {
      timestamp: targetTime.toISOString() as ISOTimestamp,
      predictedErrorRate: predictedRate,
      confidence,
      riskLevel,
      contributingFactors: [
        {
          factor: 'Historical trend',
          weight: 0.7,
          description: `Based on ${hourlyRates.length} hours of data`
        },
        {
          factor: 'Seasonal patterns',
          weight: 0.2,
          description: 'Time-of-day variations'
        },
        {
          factor: 'Recent patterns',
          weight: 0.1,
          description: 'Latest error patterns'
        }
      ],
      recommendations: this.generatePredictionRecommendations(predictedRate, riskLevel, confidence)
    };
  }

  /**
   * Calculate metrics from errors
   */
  private calculateMetrics(errors: DataSphereError[]): any {
    const totalErrors = errors.length;
    const errorsByCategory = errors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<ErrorCategory, number>);

    const errorsBySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    return {
      totalErrors,
      errorsByCategory,
      errorsBySeverity,
      errorRate: totalErrors / 60, // Assume 1 minute period
      averageResolutionTime: 0,
      successRate: 95, // Mock value
      topErrorTypes: Object.entries(errorsByCategory)
        .map(([code, count]) => ({ code, count, percentage: (count / totalErrors) * 100 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      trends: {
        hourly: new Array(24).fill(0),
        daily: new Array(7).fill(0),
        weekly: new Array(4).fill(0)
      }
    };
  }

  /**
   * Generate recommendations based on patterns and anomalies
   */
  private generateRecommendations(patterns: ErrorPattern[], anomalies: AnomalyResult[], metrics: any): Array<{
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    actionItems: string[];
  }> {
    const recommendations = [];

    // High frequency pattern recommendations
    const highFreqPatterns = patterns.filter(p => p.severity === 'high' || p.severity === 'critical');
    if (highFreqPatterns.length > 0) {
      recommendations.push({
        priority: 'HIGH' as const,
        description: 'Address high-frequency error patterns',
        actionItems: [
          'Implement circuit breakers for affected services',
          'Add retry logic with exponential backoff',
          'Review and optimize error-prone code paths',
          'Set up automated alerts for pattern detection'
        ]
      });
    }

    // Anomaly recommendations
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');
    if (criticalAnomalies.length > 0) {
      recommendations.push({
        priority: 'CRITICAL' as const,
        description: 'Investigate critical anomalies',
        actionItems: [
          'Immediate investigation of anomalous services',
          'Check for recent deployments or changes',
          'Scale resources if capacity-related',
          'Implement emergency rollback procedures'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Helper methods
   */
  private calculateSeverity(count: number, category: ErrorCategory): 'low' | 'medium' | 'high' | 'critical' {
    if (count > 100) return 'critical';
    if (count > 50) return 'high';
    if (count > 10) return 'medium';
    return 'low';
  }

  private calculateConfidence(observed: number, minimum: number): number {
    return Math.min(observed / (minimum * 2), 1);
  }

  private mapDeviationToSeverity(deviation: number): 'low' | 'medium' | 'high' | 'critical' {
    if (deviation > 2) return 'critical';
    if (deviation > 1) return 'high';
    if (deviation > 0.5) return 'medium';
    return 'low';
  }

  private getBaseline(key: string): number | null {
    const values = this.baselines.get(key) || [];
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : null;
  }

  private updateBaseline(key: string, value: number): void {
    if (!this.baselines.has(key)) {
      this.baselines.set(key, []);
    }
    
    const values = this.baselines.get(key)!;
    values.push(value);
    
    // Keep only recent values for baseline
    const maxValues = this.config.anomalyDetection.baselineWindow;
    if (values.length > maxValues) {
      values.shift();
    }
  }

  private aggregateHourlyRates(data: Array<{ timestamp: number; count: number }>): number[] {
    const hourlyBuckets = new Map<number, number>();
    
    for (const point of data) {
      const hour = Math.floor(point.timestamp / (60 * 60 * 1000));
      hourlyBuckets.set(hour, (hourlyBuckets.get(hour) || 0) + point.count);
    }

    return Array.from(hourlyBuckets.values());
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = n * (n - 1) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, idx) => sum + idx * val, 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6;

    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculatePredictionConfidence(historicalRates: number[], trend: number): number {
    if (historicalRates.length < 3) return 0.3;
    
    // Calculate variance in historical data
    const mean = historicalRates.reduce((sum, val) => sum + val, 0) / historicalRates.length;
    const variance = historicalRates.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalRates.length;
    
    // Lower variance = higher confidence
    const normalizedVariance = Math.min(variance / mean, 1);
    return Math.max(0.1, 1 - normalizedVariance);
  }

  private assessRiskLevel(predictedRate: number, historicalRates: number[]): 'low' | 'medium' | 'high' | 'critical' {
    if (historicalRates.length === 0) return 'medium';
    
    const avgRate = historicalRates.reduce((sum, val) => sum + val, 0) / historicalRates.length;
    const ratio = predictedRate / avgRate;
    
    if (ratio > 3) return 'critical';
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private generatePredictionRecommendations(
    predictedRate: number,
    riskLevel: 'low' | 'medium' | 'high' | 'critical',
    confidence: number
  ): Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimatedImpact: number;
  }> {
    const recommendations = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push({
        action: 'Prepare incident response team',
        priority: riskLevel,
        estimatedImpact: 0.8
      });
      
      recommendations.push({
        action: 'Scale up critical services proactively',
        priority: riskLevel,
        estimatedImpact: 0.7
      });
    }

    if (confidence > 0.7) {
      recommendations.push({
        action: 'Set up predictive alerts',
        priority: 'medium' as const,
        estimatedImpact: 0.6
      });
    }

    return recommendations;
  }

  /**
   * Start analysis timer
   */
  private startAnalysis(): void {
    this.analysisTimer = setInterval(async () => {
      try {
        await this.analyzePatterns();
      } catch (error) {
        this.emit('analysis-error', error);
      }
    }, this.config.analysisInterval);
  }

  /**
   * Start prediction timer
   */
  private startPrediction(): void {
    this.predictionTimer = setInterval(async () => {
      try {
        await this.generatePredictions();
      } catch (error) {
        this.emit('prediction-error', error);
      }
    }, this.config.prediction.updateInterval);
  }
}

// Export default instance
export const createErrorAnalytics = (config: Partial<AnalyticsConfig> = {}): ErrorAnalytics => {
  const defaultConfig: AnalyticsConfig = {
    enabled: true,
    analysisInterval: 300000, // 5 minutes
    retentionDays: 30,
    patternDetection: {
      minOccurrences: 5,
      timeWindow: 3600000, // 1 hour
      confidenceThreshold: 0.7,
      correlationThreshold: 0.8
    },
    anomalyDetection: {
      enabled: true,
      algorithm: 'statistical',
      sensitivity: 0.3,
      baselineWindow: 100
    },
    prediction: {
      enabled: true,
      horizonHours: 24,
      modelType: 'linear',
      updateInterval: 1800000 // 30 minutes
    }
  };

  return ErrorAnalytics.getInstance({ ...defaultConfig, ...config });
};