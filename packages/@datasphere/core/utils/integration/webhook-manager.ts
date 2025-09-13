/**
 * @fileoverview Webhook Management System
 */

import { EventEmitter } from 'events';
import { Webhook, WebhookDelivery, WebhookEvent, WebhookId, PartnerId, RetryConfig } from './types';

export class WebhookManager extends EventEmitter {
  private static instance: WebhookManager;
  private webhooks = new Map<WebhookId, Webhook>();
  private deliveries = new Map<string, WebhookDelivery>();
  private retryQueue: WebhookDelivery[] = [];

  private constructor() {
    super();
    this.startRetryProcessor();
  }

  static getInstance(): WebhookManager {
    if (!WebhookManager.instance) {
      WebhookManager.instance = new WebhookManager();
    }
    return WebhookManager.instance;
  }

  createWebhook(config: Partial<Webhook>): Webhook {
    const webhook: Webhook = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: config.url!,
      events: config.events || [],
      secret: config.secret || this.generateSecret(),
      isActive: config.isActive ?? true,
      partnerId: config.partnerId!,
      retryConfig: config.retryConfig || { maxAttempts: 3, backoffMultiplier: 2, maxDelay: 60000, retryOn: [500, 502, 503, 504] },
      headers: config.headers || {},
      metadata: config.metadata || {},
      createdAt: new Date().toISOString()
    };

    this.webhooks.set(webhook.id, webhook);
    this.emit('webhook-created', webhook);
    return webhook;
  }

  async triggerWebhook(event: WebhookEvent, payload: Record<string, unknown>, partnerId?: PartnerId): Promise<void> {
    const relevantWebhooks = Array.from(this.webhooks.values()).filter(webhook => 
      webhook.isActive && 
      webhook.events.includes(event) &&
      (!partnerId || webhook.partnerId === partnerId)
    );

    for (const webhook of relevantWebhooks) {
      const delivery = this.createDelivery(webhook, event, payload);
      await this.deliverWebhook(delivery);
    }
  }

  private createDelivery(webhook: Webhook, event: WebhookEvent, payload: Record<string, unknown>): WebhookDelivery {
    const delivery: WebhookDelivery = {
      id: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      webhookId: webhook.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString()
    };

    this.deliveries.set(delivery.id, delivery);
    return delivery;
  }

  private async deliverWebhook(delivery: WebhookDelivery): Promise<void> {
    const webhook = this.webhooks.get(delivery.webhookId);
    if (!webhook) return;

    delivery.attempts++;
    delivery.status = 'pending';

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': delivery.event,
          'X-Webhook-Signature': this.generateSignature(delivery.payload, webhook.secret),
          ...webhook.headers
        },
        body: JSON.stringify(delivery.payload)
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      delivery.response = {
        statusCode: response.status,
        headers: responseHeaders,
        body: await response.text(),
        duration: Date.now() - new Date(delivery.createdAt).getTime()
      };

      if (response.ok) {
        delivery.status = 'delivered';
        delivery.deliveredAt = new Date().toISOString();
        webhook.lastTriggered = new Date().toISOString();
        this.emit('webhook-delivered', delivery);
      } else {
        this.handleDeliveryFailure(delivery, webhook);
      }
    } catch (error) {
      this.handleDeliveryFailure(delivery, webhook, error as Error);
    }
  }

  private handleDeliveryFailure(delivery: WebhookDelivery, webhook: Webhook, error?: Error): void {
    if (delivery.attempts >= webhook.retryConfig.maxAttempts) {
      delivery.status = 'failed';
      this.emit('webhook-failed', delivery);
      return;
    }

    delivery.status = 'retrying';
    const delay = Math.min(
      webhook.retryConfig.maxDelay,
      1000 * Math.pow(webhook.retryConfig.backoffMultiplier, delivery.attempts - 1)
    );
    
    delivery.nextRetry = new Date(Date.now() + delay).toISOString();
    this.retryQueue.push(delivery);
    this.emit('webhook-retry-scheduled', delivery);
  }

  private generateSecret(): string {
    return Math.random().toString(36).substr(2, 32);
  }

  private generateSignature(payload: Record<string, unknown>, secret: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
  }

  private startRetryProcessor(): void {
    setInterval(() => {
      const now = Date.now();
      const readyToRetry = this.retryQueue.filter(delivery => 
        delivery.nextRetry && new Date(delivery.nextRetry).getTime() <= now
      );

      for (const delivery of readyToRetry) {
        this.deliverWebhook(delivery);
        this.retryQueue = this.retryQueue.filter(d => d.id !== delivery.id);
      }
    }, 5000);
  }
}

export const createWebhookManager = (): WebhookManager => {
  return WebhookManager.getInstance();
};