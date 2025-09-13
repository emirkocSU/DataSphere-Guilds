/** @fileoverview Error types for Compliance Framework. */

export class ComplianceFrameworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComplianceFrameworkError';
  }
}
