/** @fileoverview Error types for AI Orchestration. */

export class AIOrchestrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIOrchestrationError';
  }
}
