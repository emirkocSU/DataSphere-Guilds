
/**
 * @file packages/@datasphere/core/business/retention-analysis/events.ts
 * @version 2.0.0
 * @description Defines analytics events related to user lifecycle and retention.
 */

import { ChurnRiskLevel, UserLifecycleStatus } from './constants';

/**
 * A generic base structure for retention-related analytics events.
 */
interface RetentionAnalyticsEvent<T, P> {
  eventName: T;
  userId: string;
  timestamp: string; // ISO 8601
  properties: P;
}

// --- Event-specific Property Definitions ---

interface UserLifecycleStatusChangedProperties {
  previousStatus: UserLifecycleStatus;
  newStatus: UserLifecycleStatus;
  reason: string; // e.g., 'INACTIVITY_THRESHOLD_REACHED', 'USER_RETURNED'
}

interface ChurnRiskLevelChangedProperties {
  previousRiskLevel: ChurnRiskLevel;
  newRiskLevel: ChurnRiskLevel;
  churnProbability: number;
  contributingFactors: string[];
}

// --- Concrete Event Type Definitions ---

export type UserLifecycleStatusChangedEvent = RetentionAnalyticsEvent<
  'User Lifecycle Status Changed',
  UserLifecycleStatusChangedProperties
>;

export type ChurnRiskLevelChangedEvent = RetentionAnalyticsEvent<
  'Churn Risk Level Changed',
  ChurnRiskLevelChangedProperties
>;

// A union of all possible retention events.
export type RetentionEvent = 
  | UserLifecycleStatusChangedEvent
  | ChurnRiskLevelChangedEvent;
