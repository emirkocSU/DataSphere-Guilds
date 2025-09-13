/** @fileoverview Types for real-time event streaming. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type RealtimeEventType = 'USER_ONLINE' | 'TASK_UPDATED' | 'MESSAGE_RECEIVED';

export interface RealtimeEvent {
  readonly eventId: Uuid;
  readonly type: RealtimeEventType;
  readonly payload: Record<string, any>;
  readonly timestamp: IsoTimestamp;
  readonly sourceService: string;
}

export interface EventSubscription {
  readonly subscriptionId: Uuid;
  readonly userId: Uuid;
  readonly eventType: RealtimeEventType;
  readonly subscribedAt: IsoTimestamp;
}
