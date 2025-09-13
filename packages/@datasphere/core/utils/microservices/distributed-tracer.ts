/**
 * @fileoverview Distributed Tracing System
 */

import { EventEmitter } from 'events';
import { DistributedTrace, Span, TraceId, ServiceId, SpanStatus } from './types';

export class DistributedTracer extends EventEmitter {
  private static instance: DistributedTracer;
  private traces = new Map<TraceId, DistributedTrace>();
  private activeSpans = new Map<string, Span>();

  private constructor() {
    super();
  }

  static getInstance(): DistributedTracer {
    if (!DistributedTracer.instance) {
      DistributedTracer.instance = new DistributedTracer();
    }
    return DistributedTracer.instance;
  }

  startTrace(operationName: string, serviceId: ServiceId): { traceId: TraceId; spanId: string } {
    const traceId = this.generateTraceId();
    const spanId = this.generateSpanId();
    
    const trace: DistributedTrace = {
      traceId,
      spans: [],
      duration: 0,
      status: 'success',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    };

    const span: Span = {
      spanId,
      traceId,
      operationName,
      serviceId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 0,
      tags: {},
      status: { code: 'ok' }
    };

    this.traces.set(traceId, trace);
    this.activeSpans.set(spanId, span);
    trace.spans.push(span);

    this.emit('trace-started', { traceId, spanId });
    return { traceId, spanId };
  }

  startSpan(traceId: TraceId, operationName: string, serviceId: ServiceId, parentSpanId?: string): string {
    const spanId = this.generateSpanId();
    const trace = this.traces.get(traceId);
    
    if (!trace) {
      throw new Error(`Trace ${traceId} not found`);
    }

    const span: Span = {
      spanId,
      parentSpanId,
      traceId,
      operationName,
      serviceId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 0,
      tags: {},
      status: { code: 'ok' }
    };

    this.activeSpans.set(spanId, span);
    trace.spans.push(span);

    this.emit('span-started', span);
    return spanId;
  }

  finishSpan(spanId: string, status?: SpanStatus): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    span.endTime = new Date().toISOString();
    span.duration = new Date(span.endTime).getTime() - new Date(span.startTime).getTime();
    
    if (status) {
      span.status = status;
    }

    this.activeSpans.delete(spanId);
    this.emit('span-finished', span);

    // Check if trace is complete
    this.checkTraceCompletion(span.traceId);
  }

  addSpanTag(spanId: string, key: string, value: unknown): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }

  setSpanStatus(spanId: string, status: SpanStatus): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.status = status;
    }
  }

  getTrace(traceId: TraceId): DistributedTrace | undefined {
    return this.traces.get(traceId);
  }

  getActiveSpan(spanId: string): Span | undefined {
    return this.activeSpans.get(spanId);
  }

  private checkTraceCompletion(traceId: TraceId): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    const activeSpansForTrace = Array.from(this.activeSpans.values())
      .filter(span => span.traceId === traceId);

    if (activeSpansForTrace.length === 0) {
      this.finishTrace(traceId);
    }
  }

  private finishTrace(traceId: TraceId): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    trace.endTime = new Date().toISOString();
    trace.duration = new Date(trace.endTime).getTime() - new Date(trace.startTime).getTime();

    // Determine overall trace status
    const hasErrors = trace.spans.some(span => span.status.code !== 'ok');
    trace.status = hasErrors ? 'error' : 'success';

    this.emit('trace-finished', trace);
  }

  private generateTraceId(): TraceId {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const createDistributedTracer = (): DistributedTracer => {
  return DistributedTracer.getInstance();
};