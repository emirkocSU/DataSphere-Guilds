/** @fileoverview Error types for Audit Trail. */

export class AuditTrailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuditTrailError';
  }
}
