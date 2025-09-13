/**
 * @fileoverview Stream Processing Engine
 */

import { EventEmitter } from 'events';
import { StreamEvent, MetricDefinition, TimeSeriesPoint } from './types';

export class StreamProcessor extends EventEmitter {
  private static instance: StreamProcessor;
  private streams = new Map<string, StreamEvent[]>();
  private metrics = new Map<string, MetricDefinition>();
  private processors = new Map<string, Function>();
  private buffer = new Map<string, StreamEvent[]>();
  private isProcessing = false;

  private constructor() {
    super();
    this.startProcessing();
  }

  static getInstance(): StreamProcessor {
    if (!StreamProcessor.instance) {
      StreamProcessor.instance = new StreamProcessor();
    }
    return StreamProcessor.instance;
  }

  async ingest(event: StreamEvent): Promise<void> {
    const streamKey = `${event.type}:${event.metadata.source}`;
    
    if (!this.buffer.has(streamKey)) {
      this.buffer.set(streamKey, []);
    }
    
    this.buffer.get(streamKey)!.push(event);
    this.emit('event-ingested', event);
  }

  registerProcessor(eventType: string, processor: Function): void {
    this.processors.set(eventType, processor);
  }

  registerMetric(metric: MetricDefinition): void {
    this.metrics.set(metric.id, metric);
  }

  async query(
    metricId: string,
    startTime: number,
    endTime: number,
    filters?: Record<string, unknown>
  ): Promise<TimeSeriesPoint[]> {
    const metric = this.metrics.get(metricId);
    if (!metric) return [];

    const events = this.getEventsInRange(startTime, endTime);
    return this.aggregateEvents(events, metric, filters);
  }

  private startProcessing(): void {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    setInterval(() => this.processBatch(), 1000);
  }

  private async processBatch(): Promise<void> {
    for (const [streamKey, events] of this.buffer) {
      if (events.length === 0) continue;

      const batch = events.splice(0, 100);
      await this.processEvents(batch);
    }
  }

  private async processEvents(events: StreamEvent[]): Promise<void> {
    for (const event of events) {
      const processor = this.processors.get(event.type);
      if (processor) {
        await processor(event);
      }
      
      this.storeEvent(event);
      this.emit('event-processed', event);
    }
  }

  private storeEvent(event: StreamEvent): void {
    const streamKey = `${event.type}:${event.metadata.source}`;
    
    if (!this.streams.has(streamKey)) {
      this.streams.set(streamKey, []);
    }
    
    this.streams.get(streamKey)!.push(event);
    this.cleanupOldEvents(streamKey);
  }

  private cleanupOldEvents(streamKey: string): void {
    const events = this.streams.get(streamKey);
    if (!events) return;

    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours
    const filtered = events.filter(e => new Date(e.timestamp).getTime() > cutoff);
    this.streams.set(streamKey, filtered);
  }

  private getEventsInRange(startTime: number, endTime: number): StreamEvent[] {
    const allEvents: StreamEvent[] = [];
    
    for (const events of this.streams.values()) {
      const filtered = events.filter(e => {
        const timestamp = new Date(e.timestamp).getTime();
        return timestamp >= startTime && timestamp <= endTime;
      });
      allEvents.push(...filtered);
    }
    
    return allEvents;
  }

  private aggregateEvents(
    events: StreamEvent[],
    metric: MetricDefinition,
    filters?: Record<string, unknown>
  ): TimeSeriesPoint[] {
    const points: TimeSeriesPoint[] = [];
    const groups = new Map<number, StreamEvent[]>();

    // Group by time window
    for (const event of events) {
      const timestamp = new Date(event.timestamp).getTime();
      const windowStart = Math.floor(timestamp / metric.timeWindow) * metric.timeWindow;
      
      if (!groups.has(windowStart)) {
        groups.set(windowStart, []);
      }
      groups.get(windowStart)!.push(event);
    }

    // Aggregate each group
    for (const [timestamp, groupEvents] of groups) {
      const value = this.calculateAggregation(groupEvents, metric);
      points.push({
        timestamp,
        value,
        tags: this.extractTags(groupEvents, metric.dimensions)
      });
    }

    return points.sort((a, b) => a.timestamp - b.timestamp);
  }

  private calculateAggregation(events: StreamEvent[], metric: MetricDefinition): number {
    switch (metric.aggregation) {
      case 'count':
        return events.length;
      case 'sum':
        return events.reduce((sum, e) => sum + (Number(e.data.value) || 0), 0);
      case 'avg':
        const total = events.reduce((sum, e) => sum + (Number(e.data.value) || 0), 0);
        return events.length > 0 ? total / events.length : 0;
      case 'min':
        return Math.min(...events.map(e => Number(e.data.value) || 0));
      case 'max':
        return Math.max(...events.map(e => Number(e.data.value) || 0));
      default:
        return 0;
    }
  }

  private extractTags(events: StreamEvent[], dimensions: string[]): Record<string, string> {
    const tags: Record<string, string> = {};
    
    for (const dim of dimensions) {
      const values = events.map(e => String(e.data[dim] || ''));
      tags[dim] = values[0] || '';
    }
    
    return tags;
  }
}

export const createStreamProcessor = (): StreamProcessor => {
  return StreamProcessor.getInstance();
};