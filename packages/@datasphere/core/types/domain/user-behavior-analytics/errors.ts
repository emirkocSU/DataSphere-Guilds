/** @fileoverview Error types for User Behavior Analytics. */

export class UserAnalyticsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAnalyticsError';
  }
}
