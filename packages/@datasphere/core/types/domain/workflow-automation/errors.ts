/** @fileoverview Error types for Workflow Automation. */

export class WorkflowAutomationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowAutomationError';
  }
}
