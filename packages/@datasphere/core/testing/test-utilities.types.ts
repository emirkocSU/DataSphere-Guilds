/** @fileoverview Types for generic test utilities. */

export interface TestContext {
  testId: string;
  startTime: number;
}

export interface MockResponse<T> {
  status: number;
  data: T;
  headers?: Record<string, string>;
}
