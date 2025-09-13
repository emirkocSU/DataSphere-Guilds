/** @fileoverview Error types for Geographic Distribution. */

export class GeoDistributionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeoDistributionError';
  }
}
