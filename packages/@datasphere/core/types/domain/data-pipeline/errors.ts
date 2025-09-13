/** @fileoverview Error types for Data Pipeline. */

export class DataPipelineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataPipelineError';
  }
}
