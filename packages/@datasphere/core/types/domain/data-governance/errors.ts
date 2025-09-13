/** @fileoverview Error types for Data Governance. */

export class DataGovernanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataGovernanceError';
  }
}
