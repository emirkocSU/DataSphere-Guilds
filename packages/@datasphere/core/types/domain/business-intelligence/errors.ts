/** @fileoverview Error types for Business Intelligence. */

export class BIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BIError';
  }
}
