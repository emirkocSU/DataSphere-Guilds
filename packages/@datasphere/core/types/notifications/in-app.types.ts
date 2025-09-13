/** @fileoverview Types for in-app notifications. */
import { UUID, ISOTimestamp } from '../common.types';

export type InAppNotificationCategory = 'ANNOUNCEMENT' | 'TASK_UPDATE' | 'EARNINGS' | 'SOCIAL';

export interface InAppNotification {
  readonly notificationId: UUID;
  readonly userId: UUID;
  readonly title: string;
  readonly body: string;
  readonly category: InAppNotificationCategory;
  readonly isRead: boolean;
  readonly createdAt: ISOTimestamp;
  readonly deepLink?: string;
  readonly metadata?: Record<string, any>;
}
