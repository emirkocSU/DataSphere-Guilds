
/**
 * @file packages/@datasphere/core/business/conversion-funnels/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Conversion Funnel Analytics Engine.
 */

/**
 * Defines the unique names for all major conversion funnels tracked within the platform.
 */
export enum FunnelName {
  /** The primary journey from signup to first payout for a new worker. */
  CORE_WORKER_ONBOARDING = 'CORE_WORKER_ONBOARDING',
  /** The journey for an experienced worker to become a qualified inspector. */
  INSPECTOR_QUALIFICATION = 'INSPECTOR_QUALIFICATION',
  /** The journey from receiving a referral to completing the first task. */
  REFERRAL_CONVERSION = 'REFERRAL_CONVERSION',
  /** The journey for a data consumer to post their first project. (Future) */
  CLIENT_FIRST_PROJECT = 'CLIENT_FIRST_PROJECT',
}

/**
 * Defines the attributes by which funnel analysis can be segmented.
 */
export enum SegmentationAttribute {
  COUNTRY = 'COUNTRY',
  DEVICE_PLATFORM = 'DEVICE_PLATFORM',
  ACQUISITION_CHANNEL = 'ACQUISITION_CHANNEL', // e.g., 'Organic', 'Paid', 'Referral'
  USER_AGE_BRACKET = 'USER_AGE_BRACKET',
  USER_TENURE = 'USER_TENURE', // e.g., '0-30 days', '31-90 days'
}

/**
 * Defines the analytics event names that mark the completion of a funnel step.
 * These should correspond to events sent to the analytics service.
 */
export const FunnelStepEvent = {
  // Worker Onboarding Funnel
  USER_SIGNED_UP: 'User Signed Up',
  ONBOARDING_STARTED: 'Onboarding Started',
  PROFILE_COMPLETED: 'Profile Completed',
  FIRST_TASK_VIEWED: 'First Task Viewed',
  FIRST_TASK_CLAIMED: 'First Task Claimed',
  FIRST_TASK_SUBMITTED: 'First Task Submitted',
  FIRST_TASK_APPROVED: 'First Task Approved',
  PAYOUT_METHOD_CONFIGURED: 'Payout Method Configured',
  FIRST_PAYOUT_REQUESTED: 'First Payout Requested',

  // Inspector Qualification Funnel
  INSPECTOR_INFO_VIEWED: 'Inspector Info Viewed',
  INSPECTOR_TEST_STARTED: 'Inspector Test Started',
  INSPECTOR_TEST_PASSED: 'Inspector Test Passed',
  FIRST_QC_JOB_COMPLETED: 'First QC Job Completed',
} as const;
