
/**
 * @file packages/@datasphere/core/business/smart-pricing/interfaces.ts
 * @version 2.0.0
 * @description Defines the service and strategy contracts (interfaces) for the Smart Pricing Engine.
 * These interfaces allow for a decoupled architecture, enabling easy extension and testing.
 */

import { SmartPricingInput, SmartPricingResult } from './types';

/**
 * Defines the contract for a pricing strategy.
 * This allows for different pricing algorithms (e.g., dynamic, fixed) to be plugged into the system.
 */
export interface IPricingStrategy {
  /**
   * The unique name of the strategy.
   */
  readonly name: string;

  /**
   * Calculates the price for a given task based on this specific strategy.
   * @param input - The comprehensive set of factors influencing the price.
   * @returns A promise that resolves to the detailed pricing result.
   */
  calculate(input: SmartPricingInput): Promise<SmartPricingResult>;
}

/**
 * Defines the contract for the main Smart Pricing Service.
 * This service orchestrates the pricing calculation using a selected strategy.
 */
export interface ISmartPricingService {
  /**
   * Calculates the price for a task using the currently configured strategy.
   * @param input - The comprehensive set of factors influencing the price.
   * @returns A promise that resolves to the detailed pricing result.
   */
  calculatePrice(input: SmartPricingInput): Promise<SmartPricingResult>;
}
