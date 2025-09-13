
/**
 * @file packages/@datasphere/core/business/smart-pricing/strategies/dynamic.strategy.ts
 * @version 2.0.0
 * @description Implements a dynamic pricing strategy based on a multitude of real-time factors.
 */

import { v4 as uuidv4 } from 'uuid';
import { IPricingStrategy } from '../interfaces';
import { SmartPricingInput, SmartPricingResult, PriceModifier, CostComponent } from '../types';
import { PricingConfigurationError, PricingValidationError } from '../errors';
import { CostComponentName, PriceModifierReasonCode, PriceModifierType, TaskComplexity } from '../constants';

// In a real application, this would come from a configuration service or database.
const strategyConfig = {
  baseRates: {
    [TaskComplexity.LOW]: 0.10, // per minute
    [TaskComplexity.MEDIUM]: 0.25,
    [TaskComplexity.HIGH]: 0.60,
    [TaskComplexity.EXPERT]: 1.50,
  },
  urgencyMultipliers: {
    NORMAL: 1.0,
    HIGH: 1.25,
    CRITICAL: 1.75,
  },
  reputationBonusTiers: {
    level1: { score: 0.85, bonus: 1.05 }, // 5% bonus
    level2: { score: 0.95, bonus: 1.15 }, // 15% bonus
  },
  platformFeePercentage: 0.15, // 15%
  currency: 'USD',
  quoteValidityMinutes: 60,
};

export class DynamicPricingStrategy implements IPricingStrategy {
  public readonly name = 'DynamicMarketStrategy';

  public async calculate(input: SmartPricingInput): Promise<SmartPricingResult> {
    this.validateInput(input);

    const calculationId = uuidv4();
    const timestamp = new Date();
    const auditTrail: string[] = [`[${this.name}] Starting calculation ${calculationId}`];

    // 1. Calculate Base Price
    const baseRate = strategyConfig.baseRates[input.complexity];
    const basePrice = baseRate * input.estimatedCompletionTimeMinutes * input.itemCount;
    auditTrail.push(`Calculated base price: ${basePrice.toFixed(2)}`);

    const modifiers: PriceModifier[] = [];
    let currentPrice = basePrice;

    // 2. Apply Urgency Modifier
    const urgencyMultiplier = strategyConfig.urgencyMultipliers[input.urgency];
    if (urgencyMultiplier > 1.0) {
      const urgencyPremium = currentPrice * (urgencyMultiplier - 1);
      currentPrice += urgencyPremium;
      modifiers.push({
        type: PriceModifierType.MULTIPLIER,
        value: urgencyMultiplier,
        reasonCode: PriceModifierReasonCode.URGENCY_PREMIUM,
        description: `Urgency level '${input.urgency}' applied a ${urgencyMultiplier}x multiplier.`,
        source: 'System.UrgencyPolicy',
      });
      auditTrail.push(`Applied urgency modifier. New price: ${currentPrice.toFixed(2)}`);
    }

    // 3. Apply Reputation Bonus
    if (input.worker?.reputationScore) {
        const { level2, level1 } = strategyConfig.reputationBonusTiers;
        let bonusMultiplier = 1.0;
        if(input.worker.reputationScore >= level2.score) bonusMultiplier = level2.bonus;
        else if (input.worker.reputationScore >= level1.score) bonusMultiplier = level1.bonus;

        if (bonusMultiplier > 1.0) {
            const reputationBonus = currentPrice * (bonusMultiplier - 1);
            currentPrice += reputationBonus;
            modifiers.push({
                type: PriceModifierType.BONUS,
                value: reputationBonus,
                reasonCode: PriceModifierReasonCode.REPUTATION_BONUS,
                description: `Worker reputation score of ${input.worker.reputationScore} earned a ${(bonusMultiplier-1)*100}% bonus.`,
                source: 'System.ReputationEngine',
            });
            auditTrail.push(`Applied reputation bonus. New price: ${currentPrice.toFixed(2)}`);
        }
    }

    // 4. Final Worker Payout
    const finalWorkerPayout = currentPrice;
    auditTrail.push(`Final worker payout calculated: ${finalWorkerPayout.toFixed(2)}`);

    // 5. Calculate Total Cost for the customer
    const platformFee = finalWorkerPayout * strategyConfig.platformFeePercentage;
    const aiCost = input.ai?.estimatedQcCost ?? 0;
    const totalCost = finalWorkerPayout + platformFee + aiCost;
    auditTrail.push(`Total cost calculated: ${totalCost.toFixed(2)}`);

    const totalCostBreakdown: CostComponent[] = [
      { name: CostComponentName.WORKER_PAYOUT, amount: finalWorkerPayout, currency: strategyConfig.currency },
      { name: CostComponentName.PLATFORM_FEE, amount: platformFee, currency: strategyConfig.currency },
    ];
    if (aiCost > 0) {
      totalCostBreakdown.push({ name: CostComponentName.AI_VALIDATION_COST, amount: aiCost, currency: strategyConfig.currency });
    }

    const quoteExpiresAt = new Date(timestamp.getTime() + strategyConfig.quoteValidityMinutes * 60000);

    return {
      calculationId,
      timestamp,
      currency: strategyConfig.currency,
      basePrice,
      modifiers,
      finalWorkerPayout,
      totalCostBreakdown,
      totalCost,
      explanation: this.generateExplanation(basePrice, modifiers, finalWorkerPayout),
      quoteExpiresAt,
      auditTrail,
    };
  }

  private validateInput(input: SmartPricingInput): void {
    if (!input.taskId || !input.complexity || !input.estimatedCompletionTimeMinutes) {
      throw new PricingValidationError('Missing required fields in pricing input.', { input });
    }
    if (!strategyConfig.baseRates[input.complexity]) {
      throw new PricingConfigurationError(`No base rate configured for complexity: ${input.complexity}`);
    }
  }

  private generateExplanation(base: number, mods: PriceModifier[], final: number): string {
    const explanationParts = [`Base price of ${base.toFixed(2)} ${strategyConfig.currency} was calculated.`];
    mods.forEach(mod => explanationParts.push(mod.description));
    explanationParts.push(`Resulting in a final payout of ${final.toFixed(2)} ${strategyConfig.currency}.`);
    return explanationParts.join(' ');
  }
}
