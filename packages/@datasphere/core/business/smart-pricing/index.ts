
/**
 * @file packages/@datasphere/core/business/smart-pricing/index.ts
 * @version 2.0.0
 * @description Public API for the Smart Pricing module.
 * This file exports all the necessary components for other parts of the application to interact with the pricing engine.
 */

// Core Service
export { SmartPricingService } from './service';

// Strategies
export { DynamicPricingStrategy } from './strategies/dynamic.strategy';

// Interfaces (Contracts)
export { ISmartPricingService, IPricingStrategy } from './interfaces';

// Core Types and Enums
export { PriceModifierType, UrgencyLevel, TaskComplexity, GeographicTier } from './constants';
export * from './types';

// Custom Errors
export * from './errors';
