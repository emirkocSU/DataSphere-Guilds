/** @fileoverview Error types for Resource Scaling. */

export class ResourceScalingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceScalingError';
  }
}
