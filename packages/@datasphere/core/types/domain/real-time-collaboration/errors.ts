/** @fileoverview Error types for Real-Time Collaboration. */

export class CollaborationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CollaborationError';
  }
}
