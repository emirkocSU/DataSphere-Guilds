/**
 * @fileoverview Event Bus Architecture
 */

import { EventEmitter } from 'events';
import { Message, EventHandler, EventBusConfig, MessageId, ServiceId, MessageType } from './types';

export class EventBus extends EventEmitter {
  private static instance: EventBus;
  private handlers = new Map<string, EventHandler[]>();
  private config: EventBusConfig;
  private messageQueue: Message[] = [];
  private processing = false;

  private constructor(config: EventBusConfig) {
    super();
    this.config = config;
    this.startProcessing();
  }

  static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) {
      if (!config) {
        throw new Error('EventBus config required for first initialization');
      }
      EventBus.instance = new EventBus(config);
    }
    return EventBus.instance;
  }

  async publish(message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    const fullMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.messageQueue.push(fullMessage);
    this.emit('message-published', fullMessage);
  }

  subscribe(topic: string, handler: EventHandler): void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, []);
    }
    this.handlers.get(topic)!.push(handler);
    this.emit('subscription-added', { topic, handler });
  }

  unsubscribe(topic: string, handler: EventHandler): void {
    const handlers = this.handlers.get(topic);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
        this.emit('subscription-removed', { topic, handler });
      }
    }
  }

  async sendCommand(target: ServiceId, command: string, payload: Record<string, unknown>): Promise<void> {
    await this.publish({
      type: MessageType.COMMAND,
      source: 'system',
      destination: target,
      topic: command,
      payload,
      headers: { 'message-type': 'command' },
      traceId: this.generateTraceId()
    });
  }

  async emitEvent(event: string, payload: Record<string, unknown>, source: ServiceId = 'system'): Promise<void> {
    await this.publish({
      type: MessageType.EVENT,
      source,
      destination: '*',
      topic: event,
      payload,
      headers: { 'message-type': 'event' },
      traceId: this.generateTraceId()
    });
  }

  private startProcessing(): void {
    setInterval(() => {
      if (!this.processing && this.messageQueue.length > 0) {
        this.processMessages();
      }
    }, 100);
  }

  private async processMessages(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    const batch = this.messageQueue.splice(0, this.config.batchSize);
    
    for (const message of batch) {
      await this.processMessage(message);
    }

    this.processing = false;
  }

  private async processMessage(message: Message): Promise<void> {
    const handlers = this.handlers.get(message.topic) || [];
    
    for (const handlerConfig of handlers) {
      try {
        await this.executeHandler(message, handlerConfig);
      } catch (error) {
        await this.handleError(message, error as Error, handlerConfig);
      }
    }
  }

  private async executeHandler(message: Message, handlerConfig: EventHandler): Promise<void> {
    const concurrency = handlerConfig.options.concurrency || 1;
    
    if (concurrency === 1) {
      await handlerConfig.handler(message);
    } else {
      // Handle concurrency - simplified implementation
      await handlerConfig.handler(message);
    }

    if (handlerConfig.options.acknowledgment === 'manual') {
      this.acknowledge(message.id);
    }
  }

  private async handleError(message: Message, error: Error, handlerConfig: EventHandler): Promise<void> {
    const retryCount = message.retryCount || 0;
    const maxRetries = handlerConfig.options.retryPolicy.maxRetries;

    if (retryCount < maxRetries) {
      const delay = this.calculateRetryDelay(retryCount, handlerConfig.options.retryPolicy);
      
      setTimeout(() => {
        const retryMessage = { ...message, retryCount: retryCount + 1 };
        this.messageQueue.push(retryMessage);
      }, delay);
    } else {
      this.emit('message-failed', { message, error });
    }
  }

  private calculateRetryDelay(retryCount: number, retryPolicy: any): number {
    const { backoffStrategy, initialDelay, maxDelay } = retryPolicy;
    
    switch (backoffStrategy) {
      case 'exponential':
        return Math.min(initialDelay * Math.pow(2, retryCount), maxDelay);
      case 'linear':
        return Math.min(initialDelay * (retryCount + 1), maxDelay);
      default:
        return initialDelay;
    }
  }

  private acknowledge(messageId: MessageId): void {
    this.emit('message-acknowledged', messageId);
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const createEventBus = (config: EventBusConfig): EventBus => {
  return EventBus.getInstance(config);
};