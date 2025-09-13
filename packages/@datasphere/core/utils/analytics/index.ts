/**
 * @fileoverview Real-Time Analytics Engine - Main Exports
 */

// Core Services
export { StreamProcessor, createStreamProcessor } from './stream-processor';
export { DashboardEngine, createDashboardEngine } from './dashboard-engine';
export { AnomalyDetector, createAnomalyDetector } from './anomaly-detector';
export { AlertManager, createAlertManager } from './alert-manager';

// Types
export type * from './types';