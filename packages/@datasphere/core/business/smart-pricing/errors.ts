
/**
 * @file packages/@datasphere/core/business/smart-pricing/errors.ts
 * @version 2.0.0
 * @description Defines custom error classes for the Smart Pricing Engine for robust error handling.
 */

/**
 * Base error class for all pricing-related exceptions.
 */
export class PricingError extends Error {
  public readonly context?: Record<string, any>;

  constructor(message: string, context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when the input data for a pricing calculation is invalid or missing.
 */
export class PricingValidationError extends PricingError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }
}

/**
 * Thrown when a required configuration for a pricing strategy is missing.
 */
export class PricingConfigurationError extends PricingError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }
}

/**
 * Thrown when a calculation fails for an unexpected reason within a strategy.
 */
export class CalculationStrategyError extends PricingError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, context);
  }
}
