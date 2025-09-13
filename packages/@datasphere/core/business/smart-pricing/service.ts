
/**
 * @file packages/@datasphere/core/business/smart-pricing/service.ts
 * @version 2.0.0
 * @description The main orchestration service for the Smart Pricing Engine.
 */

import { ISmartPricingService, IPricingStrategy } from './interfaces';
import { SmartPricingInput, SmartPricingResult } from './types';
import { PricingConfigurationError } from './errors';

export class SmartPricingService implements ISmartPricingService {
  private strategy: IPricingStrategy;

  /**
   * Constructs the pricing service with a specific pricing strategy.
   * @param initialStrategy - The initial pricing strategy to use.
   */
  constructor(initialStrategy: IPricingStrategy) {
    if (!initialStrategy) {
      throw new PricingConfigurationError('SmartPricingService must be initialized with a strategy.');
    }
    this.strategy = initialStrategy;
  }

  /**
   * Allows changing the pricing strategy at runtime.
   * @param newStrategy - The new strategy to implement.
   */
  public setStrategy(newStrategy: IPricingStrategy): void {
    if (!newStrategy) {
      throw new PricingConfigurationError('Cannot set a null or undefined strategy.');
    }
    console.log(`Switching pricing strategy from '${this.strategy.name}' to '${newStrategy.name}'`);
    this.strategy = newStrategy;
  }

  /**
   * Calculates the price for a task using the currently configured strategy.
   * @param input - The comprehensive set of factors influencing the price.
   * @returns A promise that resolves to the detailed pricing result.
   */
  public async calculatePrice(input: SmartPricingInput): Promise<SmartPricingResult> {
    try {
      return await this.strategy.calculate(input);
    } catch (error) {
      console.error('Error during price calculation:', error);
      // Re-throw the original error to be handled by the caller
      throw error;
    }
  }
}
