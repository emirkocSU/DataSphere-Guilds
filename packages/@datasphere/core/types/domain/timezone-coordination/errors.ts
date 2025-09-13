/** @fileoverview Error types for Timezone Coordination. */

export class TimezoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimezoneError';
  }
}
