/** @fileoverview Error types for Project Orchestration. */

export class ProjectOrchestrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectOrchestrationError';
  }
}
