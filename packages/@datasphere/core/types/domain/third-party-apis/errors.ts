/** @fileoverview Error types for Third-Party APIs. */

export class ThirdPartyApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThirdPartyApiError';
  }
}
