/** @fileoverview Error types for Regulatory Compliance. */

export class RegulatoryComplianceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegulatoryComplianceError';
  }
}
