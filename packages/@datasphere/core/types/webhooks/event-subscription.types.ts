/** @fileoverview Types for managing event subscriptions. */
import { UUID } from '../common.types';
import { EventType as WebhookEventType } from './webhook.types';

export interface EventSubscription {
  readonly subscriptionId: UUID;
  readonly endpointId: UUID;
  readonly eventType: WebhookEventType;
  readonly filters: SubscriptionFilter[];
  readonly isActive: boolean;
}

export interface SubscriptionFilter {
  readonly field: string; // e.g., 'payload.currency', 'payload.taskDomain'
  readonly operator: 'EQUALS' | 'NOT_EQUALS' | 'IN';
  readonly value: any;
}
