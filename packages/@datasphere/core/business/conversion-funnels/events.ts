
/**
 * @file packages/@datasphere/core/business/conversion-funnels/events.ts
 * @version 2.0.0
 * @description Defines the structure of analytics events that trigger steps in conversion funnels.
 */

import { FunnelStepEvent } from './constants';

/**
 * A generic base structure for any analytics event that can be part of a funnel.
 */
interface FunnelAnalyticsEvent<T, P> {
  eventName: T;
  userId: string;
  timestamp: string; // ISO 8601
  properties: P & {
    // Common properties for segmentation
    acquisitionChannel?: string;
    countryCode?: string;
    devicePlatform?: 'ios' | 'android' | 'web';
    experimentVariant?: string; // For A/B testing, e.g., 'variation_A'
  };
}

// --- Event-specific Property Definitions ---

interface UserSignedUpProperties {
  referralCodeUsed?: string;
}

interface FirstTaskSubmittedProperties {
  taskId: string;
  taskDomain: string;
  timeToClaimMinutes: number;
}

// --- Concrete Event Type Definitions ---

export type UserSignedUpEvent = FunnelAnalyticsEvent<
  typeof FunnelStepEvent.USER_SIGNED_UP,
  UserSignedUpProperties
>;

export type FirstTaskSubmittedEvent = FunnelAnalyticsEvent<
  typeof FunnelStepEvent.FIRST_TASK_SUBMITTED,
  FirstTaskSubmittedProperties
>;

// Add other event types as needed...

// A union of all possible funnel events.
export type ConversionFunnelEvent = 
  | UserSignedUpEvent
  | FirstTaskSubmittedEvent;
