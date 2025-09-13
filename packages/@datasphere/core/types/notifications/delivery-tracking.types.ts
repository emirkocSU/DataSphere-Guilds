/** @fileoverview Types for tracking notification delivery and engagement. */
import type { UUID, ISOTimestamp } from '@datasphere/core/types/common.types';

export interface NotificationDeliveryMetrics {
  readonly notificationId: UUID;
  readonly channel: 'EMAIL' | 'SMS' | 'IN_APP';
  readonly openRate: number;
  readonly clickThroughRate: number;
  readonly conversionRate: number;
  readonly deliveryTimestamp: ISOTimestamp;
}

export interface EngagementInsight {
  readonly insightId: UUID;
  readonly message: string;
  readonly recommendation: string;
}
