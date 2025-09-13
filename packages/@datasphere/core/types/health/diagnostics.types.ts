/** @fileoverview Types for system diagnostics and troubleshooting. */
import { Uuid } from '../common.types';

export interface DiagnosticTest {
  readonly testId: Uuid;
  readonly name: string;
  readonly description: string;
}

export interface DiagnosticResult {
  readonly testId: Uuid;
  readonly passed: boolean;
  readonly output: string;
  readonly recommendation?: string;
}
