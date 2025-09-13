/** @fileoverview Error types for Automation Rules. */

export class AutomationRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AutomationRuleError';
  }
}
