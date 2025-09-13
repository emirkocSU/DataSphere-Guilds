/** @fileoverview Error types for Intelligent Routing. */

export class RoutingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoutingError';
  }
}
