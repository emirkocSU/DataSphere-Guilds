/** @fileoverview Error types for Resource Allocation. */

export class ResourceAllocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceAllocationError';
  }
}
