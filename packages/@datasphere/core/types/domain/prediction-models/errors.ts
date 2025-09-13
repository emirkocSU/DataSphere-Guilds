/** @fileoverview Error types for Prediction Models. */

export class PredictionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PredictionError';
  }
}
