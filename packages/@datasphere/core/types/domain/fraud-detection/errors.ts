/** @fileoverview Error types for Fraud Detection. */

export class FraudDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FraudDetectionError';
  }
}
