/** @fileoverview Error types for Event Schema. */

export class EventSchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventSchemaError';
  }
}
