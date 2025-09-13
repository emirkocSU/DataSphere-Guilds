/** @fileoverview Error types for Internationalization. */

export class InternationalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternationalizationError';
  }
}
