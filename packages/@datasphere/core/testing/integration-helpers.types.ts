/** @fileoverview Types for integration test helpers. */

export interface TestDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  cleanup(): Promise<void>;
  seed(data: any): Promise<void>;
}

export interface TestApi {
  start(): Promise<string>; // returns base URL
  stop(): Promise<void>;
}
