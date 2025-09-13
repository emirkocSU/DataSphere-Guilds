/**
 * @fileoverview Enterprise Error Logger - Structured Logging & Correlation System
 * 
 * Advanced logging infrastructure for enterprise-grade error tracking with
 * structured JSON logging, correlation tracking, PII filtering, and
 * integration with external SIEM and monitoring systems.
 */

import { EventEmitter } from 'events';
import { 
  DataSphereError, 
  ErrorSeverity, 
  ErrorCategory,
  CorrelationId, 
  ISOTimestamp,
  ErrorEvent
} from './types';

interface LoggerConfig {
  level: ErrorSeverity;
  structured: boolean;
  includeStackTrace: boolean;
  includeContext: boolean;
  sensitiveFields: string[];
  maxLogSize: number;
  batchSize: number;
  flushInterval: number;
  outputs: LogOutput[];
}

interface LogOutput {
  type: 'console' | 'file' | 'http' | 'syslog' | 'elasticsearch' | 'datadog' | 'newrelic';
  config: Record<string, unknown>;
  enabled: boolean;
  filter?: (entry: LogEntry) => boolean;
}

interface LogEntry {
  timestamp: ISOTimestamp;
  level: ErrorSeverity;
  category: ErrorCategory;
  correlationId: CorrelationId;
  service: string;
  component: string;
  message: string;
  code?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    cause?: string;
  };
  context?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    environment: Record<string, string>;
    metadata?: Record<string, unknown>;
  };
  metrics?: {
    duration?: number;
    memory?: number;
    cpu?: number;
  };
  tags: string[];
}

interface LoggerMetrics {
  totalLogs: number;
  logsByLevel: Record<ErrorSeverity, number>;
  logsByCategory: Record<ErrorCategory, number>;
  averageLogSize: number;
  droppedLogs: number;
  batchesSent: number;
  lastFlush: ISOTimestamp;
}

/**
 * Enterprise Error Logger Class
 * 
 * Provides structured logging with correlation tracking, PII filtering,
 * batching, and multiple output destinations for enterprise monitoring.
 */
export class ErrorLogger extends EventEmitter {
  private static instance: ErrorLogger;
  private config: LoggerConfig;
  private metrics: LoggerMetrics;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sensitiveFieldPatterns: RegExp[];

  private constructor(config: LoggerConfig) {
    super();
    this.config = config;
    this.metrics = {
      totalLogs: 0,
      logsByLevel: Object.values(ErrorSeverity).reduce((acc, level) => {
        acc[level] = 0;
        return acc;
      }, {} as Record<ErrorSeverity, number>),
      logsByCategory: Object.values(ErrorCategory).reduce((acc, cat) => {
        acc[cat] = 0;
        return acc;
      }, {} as Record<ErrorCategory, number>),
      averageLogSize: 0,
      droppedLogs: 0,
      batchesSent: 0,
      lastFlush: new Date().toISOString() as ISOTimestamp
    };

    this.sensitiveFieldPatterns = this.config.sensitiveFields.map(
      field => new RegExp(`"${field}"\\s*:\\s*"[^"]*"`, 'gi')
    );

    this.startFlushTimer();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: LoggerConfig): ErrorLogger {
    if (!ErrorLogger.instance) {
      if (!config) {
        throw new Error('ErrorLogger requires configuration on first instantiation');
      }
      ErrorLogger.instance = new ErrorLogger(config);
    }
    return ErrorLogger.instance;
  }

  /**
   * Log error with structured format
   */
  public async log(
    error: DataSphereError | Error,
    metadata?: Record<string, unknown>,
    metrics?: { duration?: number; memory?: number; cpu?: number }
  ): Promise<void> {
    try {
      const logEntry = this.createLogEntry(error, metadata, metrics);
      
      // Check log level
      if (!this.shouldLog(logEntry.level)) {
        return;
      }

      // Update metrics
      this.updateMetrics(logEntry);

      // Add to buffer
      this.logBuffer.push(logEntry);

      // Emit log event
      this.emit('log-created', logEntry);

      // Check if immediate flush is needed
      if (logEntry.level === ErrorSeverity.FATAL || this.logBuffer.length >= this.config.batchSize) {
        await this.flush();
      }

    } catch (loggingError) {
      this.emit('logging-error', {
        originalError: error,
        loggingError,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log error event from error handler
   */
  public async logErrorEvent(errorEvent: ErrorEvent): Promise<void> {
    await this.log(errorEvent.error, errorEvent.metadata);
  }

  /**
   * Log with specific severity level
   */
  public async trace(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.TRACE, message, metadata);
  }

  public async debug(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.DEBUG, message, metadata);
  }

  public async info(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.INFO, message, metadata);
  }

  public async warn(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.WARN, message, metadata);
  }

  public async error(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.ERROR, message, metadata);
  }

  public async fatal(message: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logMessage(ErrorSeverity.FATAL, message, metadata);
  }

  /**
   * Flush log buffer to outputs
   */
  public async flush(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const batch = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await Promise.all(
        this.config.outputs
          .filter(output => output.enabled)
          .map(output => this.sendToOutput(batch, output))
      );

      this.metrics.batchesSent++;
      this.metrics.lastFlush = new Date().toISOString() as ISOTimestamp;
      this.emit('batch-flushed', { count: batch.length, timestamp: this.metrics.lastFlush });

    } catch (flushError) {
      // Put logs back in buffer if all outputs failed
      this.logBuffer.unshift(...batch);
      this.emit('flush-error', { error: flushError, batchSize: batch.length });
    }
  }

  /**
   * Get logger metrics
   */
  public getMetrics(): LoggerMetrics {
    return { ...this.metrics };
  }

  /**
   * Update logger configuration
   */
  public updateConfig(updates: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (updates.sensitiveFields) {
      this.sensitiveFieldPatterns = this.config.sensitiveFields.map(
        field => new RegExp(`"${field}"\\s*:\\s*"[^"]*"`, 'gi')
      );
    }
  }

  /**
   * Shutdown logger gracefully
   */
  public async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Flush remaining logs
    await this.flush();

    this.emit('shutdown', {
      finalMetrics: this.getMetrics(),
      remainingLogs: this.logBuffer.length
    });
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    error: DataSphereError | Error,
    metadata?: Record<string, unknown>,
    metrics?: { duration?: number; memory?: number; cpu?: number }
  ): LogEntry {
    const isDataSphereError = this.isDataSphereError(error);
    const timestamp = new Date().toISOString() as ISOTimestamp;

    const entry: LogEntry = {
      timestamp,
      level: isDataSphereError ? error.severity : ErrorSeverity.ERROR,
      category: isDataSphereError ? error.category : ErrorCategory.UNKNOWN_ERROR,
      correlationId: isDataSphereError ? error.context.correlationId : this.generateCorrelationId(),
      service: isDataSphereError ? error.context.service : 'unknown',
      component: isDataSphereError ? error.context.component : 'unknown',
      message: error.message,
      code: isDataSphereError ? error.code : error.name,
      error: {
        name: error.name,
        message: error.message,
        stack: this.config.includeStackTrace ? error.stack : undefined,
        cause: error.cause instanceof Error ? error.cause.message : undefined
      },
      tags: isDataSphereError ? error.tags : ['unstructured']
    };

    // Add context if available and configured
    if (this.config.includeContext && isDataSphereError) {
      entry.context = {
        userId: error.context.userId,
        sessionId: error.context.sessionId,
        requestId: error.context.requestId,
        environment: error.context.environment,
        metadata: { ...error.context.metadata, ...metadata }
      };
    }

    // Add metrics if provided
    if (metrics) {
      entry.metrics = metrics;
    }

    return entry;
  }

  /**
   * Log simple message with level
   */
  private async logMessage(
    level: ErrorSeverity,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString() as ISOTimestamp,
      level,
      category: ErrorCategory.UNKNOWN_ERROR,
      correlationId: this.generateCorrelationId(),
      service: 'logger',
      component: 'message',
      message,
      context: metadata ? { metadata } : undefined,
      tags: ['message']
    };

    if (this.shouldLog(level)) {
      this.updateMetrics(entry);
      this.logBuffer.push(entry);
      this.emit('log-created', entry);

      if (level === ErrorSeverity.FATAL || this.logBuffer.length >= this.config.batchSize) {
        await this.flush();
      }
    }
  }

  /**
   * Check if error is DataSphereError
   */
  private isDataSphereError(error: Error | DataSphereError): error is DataSphereError {
    return 'category' in error && 'severity' in error && 'context' in error;
  }

  /**
   * Generate correlation ID
   */
  private generateCorrelationId(): CorrelationId {
    return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as CorrelationId;
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: ErrorSeverity): boolean {
    const levelPriority = {
      [ErrorSeverity.TRACE]: 0,
      [ErrorSeverity.DEBUG]: 1,
      [ErrorSeverity.INFO]: 2,
      [ErrorSeverity.WARN]: 3,
      [ErrorSeverity.ERROR]: 4,
      [ErrorSeverity.FATAL]: 5
    };

    return levelPriority[level] >= levelPriority[this.config.level];
  }

  /**
   * Update logging metrics
   */
  private updateMetrics(entry: LogEntry): void {
    this.metrics.totalLogs++;
    this.metrics.logsByLevel[entry.level]++;
    this.metrics.logsByCategory[entry.category]++;

    const entrySize = JSON.stringify(entry).length;
    const total = this.metrics.averageLogSize * (this.metrics.totalLogs - 1) + entrySize;
    this.metrics.averageLogSize = total / this.metrics.totalLogs;
  }

  /**
   * Send batch to specific output
   */
  private async sendToOutput(batch: LogEntry[], output: LogOutput): Promise<void> {
    const filteredBatch = output.filter ? batch.filter(output.filter) : batch;
    
    if (filteredBatch.length === 0) {
      return;
    }

    switch (output.type) {
      case 'console':
        await this.sendToConsole(filteredBatch, output);
        break;
      case 'file':
        await this.sendToFile(filteredBatch, output);
        break;
      case 'http':
        await this.sendToHttp(filteredBatch, output);
        break;
      case 'elasticsearch':
        await this.sendToElasticsearch(filteredBatch, output);
        break;
      case 'datadog':
        await this.sendToDatadog(filteredBatch, output);
        break;
      default:
        throw new Error(`Unsupported output type: ${output.type}`);
    }
  }

  /**
   * Send to console output
   */
  private async sendToConsole(batch: LogEntry[], output: LogOutput): Promise<void> {
    for (const entry of batch) {
      const logLine = this.config.structured 
        ? this.filterSensitiveData(JSON.stringify(entry))
        : this.formatPlainText(entry);
      
      console.log(logLine);
    }
  }

  /**
   * Send to file output
   */
  private async sendToFile(batch: LogEntry[], output: LogOutput): Promise<void> {
    const fs = await import('fs/promises');
    const path = output.config.path as string;
    
    const lines = batch.map(entry => {
      const logLine = this.config.structured 
        ? this.filterSensitiveData(JSON.stringify(entry))
        : this.formatPlainText(entry);
      return logLine + '\n';
    }).join('');

    await fs.appendFile(path, lines);
  }

  /**
   * Send to HTTP endpoint
   */
  private async sendToHttp(batch: LogEntry[], output: LogOutput): Promise<void> {
    const url = output.config.url as string;
    const headers = output.config.headers as Record<string, string> || {};
    
    const sanitizedBatch = batch.map(entry => 
      JSON.parse(this.filterSensitiveData(JSON.stringify(entry)))
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({ logs: sanitizedBatch })
    });

    if (!response.ok) {
      throw new Error(`HTTP log delivery failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Send to Elasticsearch
   */
  private async sendToElasticsearch(batch: LogEntry[], output: LogOutput): Promise<void> {
    const url = output.config.url as string;
    const index = output.config.index as string || 'datasphere-logs';
    
    const bulkBody = batch.flatMap(entry => [
      { index: { _index: index } },
      JSON.parse(this.filterSensitiveData(JSON.stringify(entry)))
    ]);

    const response = await fetch(`${url}/_bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: bulkBody.map(line => JSON.stringify(line)).join('\n') + '\n'
    });

    if (!response.ok) {
      throw new Error(`Elasticsearch bulk insert failed: ${response.status}`);
    }
  }

  /**
   * Send to Datadog
   */
  private async sendToDatadog(batch: LogEntry[], output: LogOutput): Promise<void> {
    const apiKey = output.config.apiKey as string;
    const site = output.config.site as string || 'datadoghq.com';
    
    const payload = batch.map(entry => ({
      ...JSON.parse(this.filterSensitiveData(JSON.stringify(entry))),
      ddsource: 'datasphere-guilds',
      ddtags: entry.tags.join(','),
      hostname: process.env.HOSTNAME || 'unknown'
    }));

    const response = await fetch(`https://http-intake.logs.${site}/v1/input/${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Datadog log delivery failed: ${response.status}`);
    }
  }

  /**
   * Format entry as plain text
   */
  private formatPlainText(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.padEnd(5);
    const correlation = entry.correlationId.substr(-8);
    const service = entry.service;
    const component = entry.component;
    const message = entry.message;
    
    return `${timestamp} [${level}] ${correlation} ${service}/${component}: ${message}`;
  }

  /**
   * Filter sensitive data from log content
   */
  private filterSensitiveData(content: string): string {
    let filtered = content;
    
    for (const pattern of this.sensitiveFieldPatterns) {
      filtered = filtered.replace(pattern, (match) => {
        const fieldName = match.split(':')[0];
        return `${fieldName}: "***"`;
      });
    }
    
    return filtered;
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flush().catch(error => {
          this.emit('flush-error', error);
        });
      }
    }, this.config.flushInterval);
  }
}

// Legacy compatibility export
export { ErrorLogger as Logger };

/**
 * Create default error logger instance
 */
export const createErrorLogger = (config: Partial<LoggerConfig> = {}): ErrorLogger => {
  const defaultConfig: LoggerConfig = {
    level: ErrorSeverity.INFO,
    structured: true,
    includeStackTrace: true,
    includeContext: true,
    sensitiveFields: ['password', 'token', 'secret', 'key', 'authorization', 'cookie'],
    maxLogSize: 64 * 1024, // 64KB
    batchSize: 100,
    flushInterval: 5000, // 5 seconds
    outputs: [
      {
        type: 'console',
        config: {},
        enabled: true
      }
    ]
  };

  return ErrorLogger.getInstance({ ...defaultConfig, ...config });
};