
import { z } from 'zod';

/**
 * Defines the structure for a feature flag rule.
 * Allows targeting specific user IDs, percentages, or environments.
 */
const FeatureFlagRuleSchema = z.object({
  /** List of user IDs for whom the feature is explicitly enabled. */
  userIds: z.array(z.string()).optional(),
  /** A value between 0 and 1 representing the percentage of users for whom the feature is enabled. */
  percentage: z.number().min(0).max(1).optional(),
  /** List of environments (e.g., 'development', 'staging') where the feature is active. */
  environments: z.array(z.string()).optional(),
});

/**
 * Defines the schema for a single feature flag, including its description and activation rules.
 */
const FeatureFlagSchema = z.object({
  description: z.string(),
  /** A set of rules that determine if the feature is active. */
  rules: FeatureFlagRuleSchema,
});

/**
 * Main schema for the feature flags configuration file.
 * It's a record mapping feature names (keys) to their configuration.
 */
export const FeatureFlagsConfigSchema = z.record(FeatureFlagSchema);

// Type inference for a single feature flag and the entire config
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export type FeatureFlagsConfig = z.infer<typeof FeatureFlagsConfigSchema>;

/**
 * Default feature flags configuration.
 * This serves as a fallback and a template for environment-specific overrides.
 */
export const defaultFeatureFlagsConfig: FeatureFlagsConfig = {
  'use-new-dashboard': {
    description: 'Enables the new, redesigned user dashboard.',
    rules: {
      percentage: 0.5, // 50% of users
      environments: ['staging', 'production'],
    },
  },
  'enable-crypto-payouts': {
    description: 'Allows users to receive payouts in cryptocurrency.',
    rules: {
      userIds: ['user-alpha-tester-1', 'user-alpha-tester-2'], // Specific alpha testers
      environments: ['development', 'staging'],
    },
  },
  'advanced-search-engine': {
    description: 'Activates the new Elasticsearch-powered search functionality.',
    rules: {
      percentage: 0, // Disabled by default, enabled via environment override
    },
  },
};

/**
 * A sophisticated feature flag evaluation engine.
 * This class determines if a feature is active for a given context (e.g., user, environment).
 * @class FeatureFlagEvaluator
 */
export class FeatureFlagEvaluator {
  constructor(private config: FeatureFlagsConfig) {}

  /**
   * Checks if a specific feature is enabled based on the provided context.
   *
   * @param {string} featureName - The name of the feature to check.
   * @param {{ userId?: string; environment?: string }} context - The context for evaluation.
   * @returns {boolean} - True if the feature is active, false otherwise.
   */
  public isEnabled(featureName: string, context: { userId?: string; environment?: string }): boolean {
    const feature = this.config[featureName];

    if (!feature) {
      console.warn(`⚠️ Feature flag "${featureName}" not found.`);
      return false;
    }

    const { rules } = feature;

    // Rule: Environment check
    if (rules.environments && context.environment && !rules.environments.includes(context.environment)) {
      return false; // Feature is not enabled for the current environment
    }

    // Rule: User ID check
    if (rules.userIds && context.userId && rules.userIds.includes(context.userId)) {
      return true; // Feature is explicitly enabled for this user
    }

    // Rule: Percentage check (simple implementation, can be improved with hashing for consistency)
    if (rules.percentage !== undefined) {
      return Math.random() < rules.percentage;
    }

    // Default to false if no rules match
    return false;
  }
}
