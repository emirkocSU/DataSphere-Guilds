
/**
 * @file packages/@datasphere/core/business/ab-testing/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the A/B Testing & Experimentation Engine.
 */

/**
 * Defines the lifecycle status of an A/B test experiment.
 */
export enum ExperimentStatus {
  /** The experiment is being designed and is not yet active. */
  DRAFT = 'DRAFT',
  /** The experiment is currently active and collecting data. */
  RUNNING = 'RUNNING',
  /** The experiment is temporarily paused. */
  PAUSED = 'PAUSED',
  /** The experiment has concluded and results are available. */
  COMPLETED = 'COMPLETED',
}

/**
 * Defines the type of the primary metric being measured for an experiment.
 */
export enum GoalMetricType {
  /** Measures the percentage of users who perform a specific action (e.g., signup rate). */
  CONVERSION_RATE = 'CONVERSION_RATE',
  /** Measures the average of a value across users (e.g., average revenue per user). */
  AVERAGE_VALUE = 'AVERAGE_VALUE',
  /** Measures the percentage of users who remain active over time. */
  RETENTION_RATE = 'RETENTION_RATE',
}

/**
 * Defines the statistical test used to determine the significance of the results.
 */
export enum StatisticalTest {
  /** Used for comparing the means of two groups. */
  T_TEST = 'T_TEST',
  /** Used for comparing categorical data and conversion rates. */
  CHI_SQUARED = 'CHI_SQUARED',
}

/**
 * Defines the layer of the platform where the experiment is being conducted.
 * This helps in organizing and preventing conflicting experiments.
 */
export enum ExperimentLayer {
  UI_UX = 'UI_UX',
  WORKFLOW_LOGIC = 'WORKFLOW_LOGIC',
  PRICING_MODEL = 'PRICING_MODEL',
  COMMUNICATION = 'COMMUNICATION',
}
