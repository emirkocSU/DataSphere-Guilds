/** @fileoverview Error types for Network Topology. */

export class NetworkTopologyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkTopologyError';
  }
}
