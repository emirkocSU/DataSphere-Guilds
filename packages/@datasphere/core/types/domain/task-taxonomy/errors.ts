/** @fileoverview Error types for Task Taxonomy. */

export class TaskTaxonomyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskTaxonomyError';
  }
}
