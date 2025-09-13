
/**
 * @file packages/@datasphere/core/business/viral-metrics/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Growth Hacking & Viral Analytics Engine.
 */

import { ReferralChannel, ReferralStatus, RewardType } from './constants';

/**
 * Represents a single referral instance from one user to a potential new user.
 */
export interface Referral {
  referralId: string;
  referrerId: string; // The user who sent the invite.
  recipientIdentifier: string; // e.g., email address or phone number of the invited person.
  recipientId?: string; // The user ID of the recipient after they sign up.
  referralCode: string;
  channel: ReferralChannel;
  status: ReferralStatus;
  sentAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
  expiresAt: string; // ISO 8601
}

/**
 * Defines the structure of a reward given for a successful referral.
 */
export interface ReferralReward {
  rewardId: string;
  referralId: string;
  rewardType: RewardType;
  value: number | string;
  currency?: string;
  awardedTo: 'REFERRER' | 'RECIPIENT';
  awardedAt: string; // ISO 8601
}

/**
 * Represents a group of users who joined around the same time, used for cohort analysis.
 */
export interface Cohort {
  cohortId: string; // e.g., '2025-W30' for week 30 of 2025.
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  initialUserCount: number;
  // Retention data, e.g., { "week1": 0.45, "week2": 0.30 }
  retentionPercentage: Record<string, number>;
}

/**
 * A snapshot of the K-factor (virality coefficient) at a specific point in time.
 * K-factor = (Number of invites sent per user) * (Conversion rate of invites)
 */
export interface KFactorSnapshot {
  snapshotId: string;
  calculatedAt: string; // ISO 8601
  timePeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  kFactor: number;
  // Component metrics for diagnostics
  componentMetrics: {
    totalActiveUsers: number;
    totalInvitesSent: number;
    totalConversions: number;
    invitesPerUser: number;
    conversionRate: number;
  };
}

/**
 * Analytics for a specific viral loop, such as the core referral loop.
 */
export interface ViralLoopAnalytics {
  loopName: string; // e.g., 'CoreUserReferralLoop'
  timePeriod: string;
  // The average time it takes for a new user to send their first invite.
  cycleTimeHours: number;
  // The percentage of new users who send at least one invite.
  participationRate: number;
  // The overall effectiveness of the loop.
  conversionFunnel: {
    viewedProgram: number;
    sentInvites: number;
    clicks: number;
    signups: number;
  };
}
