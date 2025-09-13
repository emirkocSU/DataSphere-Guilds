
/**
 * @file packages/@datasphere/core/business/retention-analysis/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Retention & LTV Analytics Engine.
 */

/**
 * Defines the time intervals for cohort analysis.
 */
export enum CohortInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

/**
 * Defines the predicted risk level of a user churning (leaving the platform).
 */
export enum ChurnRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Defines the key metrics used to calculate a user's engagement score.
 */
export enum EngagementMetric {
  TASKS_COMPLETED = 'TASKS_COMPLETED',
  QC_JOBS_DONE = 'QC_JOBS_DONE',
  LOGIN_FREQUENCY = 'LOGIN_FREQUENCY',
  SESSION_DURATION = 'SESSION_DURATION',
  FEATURE_ADOPTION_RATE = 'FEATURE_ADOPTION_RATE',
  REFERRALS_SENT = 'REFERRALS_SENT',
}

/**
 * Defines the possible status of a user in their lifecycle.
 */
export enum UserLifecycleStatus {
  NEW = 'NEW', // Just signed up
  ACTIVATED = 'ACTIVATED', // Completed first task
  ENGAGED = 'ENGAGED', // Regularly active
  DORMANT = 'DORMANT', // Inactive for a period
  CHURNED = 'CHURNED', // Considered lost
  RESURRECTED = 'RESURRECTED', // Returned after being churned
}
