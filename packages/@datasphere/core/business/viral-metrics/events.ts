
/**
 * @file packages/@datasphere/core/business/viral-metrics/events.ts
 * @version 2.0.0
 * @description Defines the structure of analytics events related to growth and virality.
 * These events are designed to be sent to analytics platforms like Segment, Mixpanel, or Amplitude.
 */

import { ReferralChannel } from './constants';

/**
 * A generic base structure for any analytics event.
 */
interface AnalyticsEvent<T, P> {
  eventName: T;
  userId: string; // The user who performed the action.
  timestamp: string; // ISO 8601
  properties: P;
  deviceInfo?: {
    platform: 'ios' | 'android' | 'web';
    appVersion: string;
  };
}

// --- Event-specific Property Definitions ---

interface ReferralInviteSentProperties {
  channel: ReferralChannel;
  recipientCount: number;
  sourceScreen: string; // e.g., 'ReferralDashboard', 'PostTaskModal'
}

interface ReferredUserSignedUpProperties {
  referralCodeUsed: string;
  channel: ReferralChannel;
  landingPage: string;
}

interface AchievementSharedProperties {
  achievementType: string; // e.g., 'REACHED_1000_EARNINGS', 'PROMOTED_TO_EXPERT'
  channel: 'twitter' | 'linkedin' | 'whatsapp' | 'other';
}

// --- Concrete Event Type Definitions ---

export type ReferralInviteSentEvent = AnalyticsEvent<
  'Referral Invite Sent',
  ReferralInviteSentProperties
>;

export type ReferredUserSignedUpEvent = AnalyticsEvent<
  'Referred User Signed Up',
  ReferredUserSignedUpProperties
>;

export type AchievementSharedEvent = AnalyticsEvent<
  'Achievement Shared',
  AchievementSharedProperties
>;

// A union of all possible viral events for easy handling.
export type ViralAnalyticsEvent = 
  | ReferralInviteSentEvent 
  | ReferredUserSignedUpEvent 
  | AchievementSharedEvent;
