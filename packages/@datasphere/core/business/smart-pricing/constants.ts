
/**
 * @file packages/@datasphere/core/business/smart-pricing/constants.ts
 * @version 2.0.0
 * @description Contains all enumerations and constant values for the Smart Pricing Engine.
 * This centralization ensures consistency and ease of maintenance across the module.
 */

/**
 * Defines the available pricing models for tasks.
 */
export enum PricingModel {
  PER_TASK = 'PER_TASK',
  PER_ITEM = 'PER_ITEM',
  TIME_BASED = 'TIME_BASED',
  HYBRID_PERFORMANCE = 'HYBRID_PERFORMANCE',
}

/**
 * Represents the complexity level of a task.
 */
export enum TaskComplexity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXPERT = 'EXPERT',
}

/**
 * Defines the urgency of a task.
 */
export enum UrgencyLevel {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Represents different geographic tiers for pricing adjustments.
 */
export enum GeographicTier {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
  TIER_4 = 'TIER_4',
}

/**
 * The type of modification applied to a price component.
 */
export enum PriceModifierType {
  MULTIPLIER = 'MULTIPLIER',
  BONUS = 'BONUS',
  DEDUCTION = 'DEDUCTION',
  FEE = 'FEE',
}

/**
 * Standardized reason codes for price modifiers for better analytics and i18n.
 */
export const PriceModifierReasonCode = {
  // Base & Multipliers
  BASE_PRICE: 'BASE_PRICE',
  URGENCY_PREMIUM: 'URGENCY_PREMIUM',
  COMPLEXITY_MULTIPLIER: 'COMPLEXITY_MULTIPLIER',
  GEOGRAPHIC_TIER_ADJUSTMENT: 'GEOGRAPHIC_TIER_ADJUSTMENT',
  MARKET_DEMAND_SURGE: 'MARKET_DEMAND_SURGE',

  // Bonuses
  REPUTATION_BONUS: 'REPUTATION_BONUS',
  HIGH_QUALITY_BONUS: 'HIGH_QUALITY_BONUS',
  SKILL_CERTIFICATION_BONUS: 'SKILL_CERTIFICATION_BONUS',

  // Fees & Costs
  PLATFORM_FEE: 'PLATFORM_FEE',
  AI_QC_COST: 'AI_QC_COST',
  PAYMENT_PROCESSING_FEE: 'PAYMENT_PROCESSING_FEE',
} as const;

/**
 * Standardized names for cost components.
 */
export const CostComponentName = {
  WORKER_PAYOUT: 'WORKER_PAYOUT',
  QC_INSPECTOR_PAYOUT: 'QC_INSPECTOR_PAYOUT',
  AI_VALIDATION_COST: 'AI_VALIDATION_COST',
  PLATFORM_FEE: 'PLATFORM_FEE',
  OTHER: 'OTHER',
} as const;
