/** @fileoverview Error types for Quality Assurance. */

export class QAError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QAError';
  }
}
