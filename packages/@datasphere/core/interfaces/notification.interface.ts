/**
 * @fileoverview Lean, high-performance notification interfaces for unicorn-scale messaging
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../types/common.types';

export interface INotificationService {
  // Send notifications
  send(notification: NotificationRequest): Promise<NotificationResult>;
  sendBatch(notifications: NotificationRequest[]): Promise<BatchNotificationResult>;
  
  // Templates
  sendFromTemplate(templateId: string, data: TemplateData): Promise<NotificationResult>;
  
  // Preferences
  getPreferences(userId: UUID): Promise<NotificationPreferences>;
  updatePreferences(userId: UUID, preferences: NotificationPreferences): Promise<void>;
  
  // Analytics
  getDeliveryStats(period: TimePeriod): Promise<DeliveryStats>;
}

export interface NotificationRequest {
  userId: UUID;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  data?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduleFor?: Date;
}

export interface NotificationResult {
  id: UUID;
  status: 'sent' | 'failed' | 'scheduled';
  deliveredAt?: Date;
  error?: string;
}

export interface BatchNotificationResult {
  total: number;
  sent: number;
  failed: number;
  results: NotificationResult[];
}

export interface TemplateData {
  userId: UUID;
  variables: Record<string, any>;
  channel?: NotificationChannel;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface NotificationPreferences {
  userId: UUID;
  channels: ChannelPreference[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours?: QuietHours;
}

export interface ChannelPreference {
  channel: NotificationChannel;
  enabled: boolean;
  types: NotificationType[];
}

export interface QuietHours {
  start: string; // HH:mm format
  end: string;   // HH:mm format
  timezone: string;
}

export interface DeliveryStats {
  period: TimePeriod;
  totalSent: number;
  deliveryRate: number;
  channelStats: ChannelStats[];
}

export interface ChannelStats {
  channel: NotificationChannel;
  sent: number;
  delivered: number;
  failed: number;
  rate: number;
}

export interface TimePeriod {
  start: Date;
  end: Date;
}

export type NotificationType = 
  | 'system'
  | 'marketing'
  | 'transactional'
  | 'security'
  | 'social';

export type NotificationChannel = 
  | 'email'
  | 'sms'
  | 'push'
  | 'in_app'
  | 'webhook';