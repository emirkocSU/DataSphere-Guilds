
/**
 * @file packages/@datasphere/core/business/viral-metrics/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Growth Hacking & Viral Analytics Engine.
 */

/**
 * Defines the channels through which a referral can be initiated.
 */
export enum ReferralChannel {
  DIRECT_LINK = 'DIRECT_LINK',
  EMAIL_INVITE = 'EMAIL_INVITE',
  SOCIAL_SHARE = 'SOCIAL_SHARE',
  QR_CODE = 'QR_CODE',
  IN_APP_PROMPT = 'IN_APP_PROMPT',
}

/**
 * The status of a referral invitation.
 */
export enum ReferralStatus {
  SENT = 'SENT', // The invitation has been sent but not yet accepted.
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE', // The recipient has clicked the link but not signed up.
  COMPLETED = 'COMPLETED', // The recipient signed up successfully.
  EXPIRED = 'EXPIRED', // The invitation was not accepted within the time limit.
  INELIGIBLE = 'INELIGIBLE', // The recipient was not eligible for the program.
}

/**
 * Defines the type of reward for a successful referral.
 */
export enum RewardType {
  PLATFORM_CREDIT = 'PLATFORM_CREDIT',
  CASH_BONUS = 'CASH_BONUS',
  REPUTATION_BOOST = 'REPUTATION_BOOST',
  PREMIUM_FEATURE_ACCESS = 'PREMIUM_FEATURE_ACCESS',
}

/**
 * Specific event names tracked for viral analytics.
 * These align with standard analytics platforms like Segment or Mixpanel.
 */
export enum ViralEventType {
  // Funnel Events
  REFERRAL_PROGRAM_VIEWED = 'Referral Program Viewed',
  REFERRAL_INVITE_SENT = 'Referral Invite Sent',
  REFERRAL_LINK_CLICKED = 'Referral Link Clicked',
  REFERRED_USER_SIGNED_UP = 'Referred User Signed Up',

  // Milestone Events
  REFERRED_USER_COMPLETED_FIRST_TASK = 'Referred User Completed First Task',
  REFERRER_REWARD_EARNED = 'Referrer Reward Earned',

  // Sharing Events
  ACHIEVEMENT_SHARED = 'Achievement Shared',
  TASK_RESULT_SHARED = 'Task Result Shared',
}
