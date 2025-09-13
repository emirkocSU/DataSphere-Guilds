/**
 * @fileoverview Notification Orchestrator
 */

import { EventEmitter } from 'events';
import { Notification, NotificationChannel, UserProfile, NotificationMetrics, Campaign } from './types';
import { SegmentationEngine, createSegmentationEngine } from './segmentation-engine';

export class NotificationOrchestrator extends EventEmitter {
  private static instance: NotificationOrchestrator;
  private segmentationEngine: SegmentationEngine;
  private notifications = new Map<string, Notification>();
  private channels = new Map<string, NotificationChannel>();
  private metrics: NotificationMetrics;

  private constructor() {
    super();
    this.segmentationEngine = createSegmentationEngine();
    this.metrics = {
      totalNotifications: 0,
      deliveredNotifications: 0,
      failedNotifications: 0,
      bounceRate: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      averageDeliveryTime: 0,
      channelPerformance: {}
    };
  }

  static getInstance(): NotificationOrchestrator {
    if (!NotificationOrchestrator.instance) {
      NotificationOrchestrator.instance = new NotificationOrchestrator();
    }
    return NotificationOrchestrator.instance;
  }

  async sendNotification(notification: Omit<Notification, 'id' | 'status' | 'sentAt'>): Promise<string> {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: Notification = {
      id,
      ...notification,
      status: 'pending',
      sentAt: new Date().toISOString()
    };

    this.notifications.set(id, fullNotification);
    this.metrics.totalNotifications++;

    try {
      await this.processNotification(fullNotification);
      fullNotification.status = 'sent';
      this.emit('notification-sent', fullNotification);
      return id;
    } catch (error) {
      fullNotification.status = 'failed';
      this.metrics.failedNotifications++;
      this.emit('notification-failed', { notification: fullNotification, error });
      throw error;
    }
  }

  async sendCampaign(campaign: Campaign): Promise<void> {
    const users = this.getUsersForCampaign(campaign);
    
    for (const userId of users) {
      const notification = this.createNotificationFromCampaign(campaign, userId);
      await this.sendNotification(notification);
    }

    this.emit('campaign-sent', { campaignId: campaign.id, userCount: users.length });
  }

  registerChannel(name: string, channel: NotificationChannel): void {
    this.channels.set(name, channel);
  }

  async trackEvent(notificationId: string, event: string, data?: Record<string, unknown>): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return;

    switch (event) {
      case 'delivered':
        notification.status = 'delivered';
        notification.deliveredAt = new Date().toISOString();
        this.metrics.deliveredNotifications++;
        break;
      case 'opened':
        this.updateChannelMetrics(notification.channels[0]?.type, 'opened');
        break;
      case 'clicked':
        this.updateChannelMetrics(notification.channels[0]?.type, 'clicked');
        break;
      case 'bounced':
        notification.status = 'bounced';
        this.updateChannelMetrics(notification.channels[0]?.type, 'bounced');
        break;
    }

    this.emit('event-tracked', { notificationId, event, data });
  }

  getMetrics(): NotificationMetrics {
    return { ...this.metrics };
  }

  private async processNotification(notification: Notification): Promise<void> {
    for (const channel of notification.channels) {
      if (!channel.enabled) continue;

      try {
        await this.sendToChannel(notification, channel);
      } catch (error) {
        if (!channel.fallback) throw error;
      }
    }
  }

  private async sendToChannel(notification: Notification, channel: NotificationChannel): Promise<void> {
    const channelHandler = this.channels.get(channel.type);
    if (!channelHandler) {
      throw new Error(`Channel ${channel.type} not registered`);
    }

    // Mock channel delivery
    await new Promise(resolve => setTimeout(resolve, 100));
    this.emit('channel-sent', { notificationId: notification.id, channel: channel.type });
  }

  private getUsersForCampaign(campaign: Campaign): string[] {
    const users: string[] = [];
    
    for (const segmentId of campaign.targeting.segments) {
      const segmentUsers = this.segmentationEngine.getUsersInSegment(segmentId);
      users.push(...segmentUsers);
    }

    users.push(...campaign.targeting.includeUsers);
    
    return [...new Set(users)].filter(userId => 
      !campaign.targeting.excludeUsers.includes(userId)
    );
  }

  private createNotificationFromCampaign(campaign: Campaign, userId: string): Omit<Notification, 'id' | 'status' | 'sentAt'> {
    return {
      userId,
      title: 'Campaign Notification',
      body: 'Campaign message',
      channels: [{ type: 'push', config: { provider: 'fcm', credentials: {}, settings: {} }, enabled: true }],
      priority: 'normal',
      campaignId: campaign.id,
      metadata: {
        source: 'campaign',
        tags: [],
        customData: {},
        tracking: { enabled: true, events: ['delivered', 'opened', 'clicked'], parameters: {} },
        personalization: { userId, variables: {}, preferences: {}, context: {} },
        retryCount: 0,
        maxRetries: 3
      }
    };
  }

  private updateChannelMetrics(channelType: string, metric: string): void {
    if (!this.metrics.channelPerformance[channelType]) {
      this.metrics.channelPerformance[channelType] = {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        deliveryRate: 0,
        engagementRate: 0,
        averageDeliveryTime: 0
      };
    }

    const channelMetrics = this.metrics.channelPerformance[channelType];
    (channelMetrics as any)[metric]++;
  }
}

export const createNotificationOrchestrator = (): NotificationOrchestrator => {
  return NotificationOrchestrator.getInstance();
};