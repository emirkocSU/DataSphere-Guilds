/** @fileoverview Types for notification delivery channels. */
import type { UUID, ISOTimestamp } from '@datasphere/core/types/common.types';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
export type DeliveryStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'OPENED' | 'CLICKED';

export interface DeliveryRecord {
  readonly recordId: UUID;
  readonly notificationId: UUID;
  readonly channel: NotificationChannel;
  readonly recipient: string;
  readonly status: DeliveryStatus;
  readonly sentAt: ISOTimestamp;
  readonly lastUpdatedAt: ISOTimestamp;
  readonly providerResponse?: string;
}