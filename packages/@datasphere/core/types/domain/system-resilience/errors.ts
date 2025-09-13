/** @fileoverview Error types for System Resilience. */

export class SystemResilienceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SystemResilienceError';
  }
}
