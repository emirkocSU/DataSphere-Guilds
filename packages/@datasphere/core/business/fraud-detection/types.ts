
/**
 * @file packages/@datasphere/core/business/fraud-detection/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Real-time Fraud Detection Engine.
 */

import { AutomatedAction, FraudSignalType, RiskLevel } from './constants';

/**
 * Represents a single fraudulent signal detected by the system.
 */
export interface FraudSignal {
  signalId: string;
  signalType: FraudSignalType;
  timestamp: string; // ISO 8601
  /** The weight or contribution of this signal to the overall risk score. */
  riskContribution: number;
  details: string;
  sourceEntity: { type: string; id: string; }; // e.g., { type: 'userId', id: '...' } or { type: 'submissionId', id: '...' }
}

/**
 * Represents the result of a risk analysis for a specific event or user.
 */
export interface RiskAnalysisResult {
  analysisId: string;
  targetEntity: { type: string; id: string; };
  timestamp: string; // ISO 8601
  /** The final calculated risk score, typically from 0 to 100. */
  riskScore: number;
  riskLevel: RiskLevel;
  /** The list of signals that contributed to this risk score. */
  contributingSignals: FraudSignal[];
  /** The automated action, if any, that was triggered by this result. */
  triggeredAction?: AutomatedAction;
}

/**
 * A comprehensive risk profile for a user.
 */
export interface UserRiskProfile {
  userId: string;
  lastUpdatedAt: string; // ISO 8601
  currentRiskScore: number;
  currentRiskLevel: RiskLevel;
  /** A history of the user's risk scores over time. */
  riskHistory: Array<{ timestamp: string; score: number; }>;
  /** A list of specific fraud signals this user has been associated with. */
  associatedSignalTypes: FraudSignalType[];
  isUnderWatchlist: boolean;
}

/**
 * Defines a rule for the fraud detection engine.
 */
export interface FraudDetectionRule {
  ruleId: string;
  description: string;
  /** A machine-readable condition that triggers the rule. */
  condition: string; // e.g., "user.login_attempts > 5 && ip.is_proxy"
  /** The signal to generate if the condition is met. */
  signalToGenerate: FraudSignalType;
  /** The risk points to add if the signal is generated. */
  riskPoints: number;
}
