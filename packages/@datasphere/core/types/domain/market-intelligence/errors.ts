/** @fileoverview Error types for Market Intelligence. */

export class MarketIntelligenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MarketIntelligenceError';
  }
}
