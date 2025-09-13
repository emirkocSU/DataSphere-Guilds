/**
 * @fileoverview Nano-optimized decision types with bitwise operations.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact decision - 24 bytes
export interface Decision {
  readonly id: UUID; // 16 bytes
  readonly outcome: number; // 1 byte - DecisionOutcome enum
  readonly confidence: number; // 1 byte - 0-255
  readonly reasoning: number; // 2 bytes - reasoning code
  readonly timestamp: number; // 4 bytes - unix timestamp
}

// Minimal decision context - 16 bytes
export interface DecisionContext {
  readonly appealId: BigInt; // 8 bytes
  readonly deciderId: number; // 4 bytes - decider hash
  readonly flags: number; // 2 bytes - context flags
  readonly weight: number; // 2 bytes - decision weight
}

// Bitwise reasoning matrix - memory efficient
export interface ReasoningMatrix {
  readonly factorBits: BigInt; // 64 factors as bits
  readonly weightVector: Float32Array; // factor weights
  readonly threshold: number; // decision threshold
  readonly bias: number; // bias term
}

// Compact impact assessment - 8 bytes
export interface ImpactVector {
  readonly financial: number; // 2 bytes - scaled impact
  readonly operational: number; // 2 bytes - scaled impact  
  readonly reputational: number; // 2 bytes - scaled impact
  readonly legal: number; // 2 bytes - scaled impact
}

// Minimal remediation step - 12 bytes
export interface RemediationStep {
  readonly action: number; // 2 bytes - action code
  readonly priority: number; // 1 byte - 0-255
  readonly cost: number; // 2 bytes - scaled cost
  readonly timeline: number; // 2 bytes - days
  readonly assignee: number; // 4 bytes - assignee hash
  readonly status: number; // 1 byte - status enum
}

// Binary decision tree node - 16 bytes
export interface DecisionNode {
  readonly feature: number; // 2 bytes - feature index
  readonly threshold: number; // 4 bytes - split threshold
  readonly leftChild: number; // 2 bytes - left node index
  readonly rightChild: number; // 2 bytes - right node index
  readonly leafValue: number; // 4 bytes - prediction if leaf
  readonly samples: number; // 2 bytes - training samples
}

// Fast lookup table for decisions
export interface DecisionLUT {
  readonly table: Uint32Array; // decision lookup
  readonly mask: number; // bit mask for features
  readonly shift: number; // bit shift for indexing
  readonly default: number; // default decision
}

// Const enums for zero overhead
export const enum DecisionOutcome {
  DENIED = 0,
  APPROVED = 1,
  PARTIAL = 2,
  REMANDED = 3,
  DISMISSED = 4,
  DEFERRED = 5
}

export const enum DecisionMethod {
  AUTOMATIC = 0,
  RULE_BASED = 1,
  ML_MODEL = 2,
  HUMAN = 3,
  COMMITTEE = 4,
  ARBITRATION = 5
}

export const enum ReasoningCode {
  INSUFFICIENT_EVIDENCE = 0,
  PROCEDURAL_ERROR = 1,
  MERIT_LACKING = 2,
  POLICY_VIOLATION = 3,
  VALID_CLAIM = 4,
  TECHNICAL_ISSUE = 5,
  JURISDICTION = 6,
  PRECEDENT = 7
}

export const enum ContextFlag {
  URGENT = 1 << 0,
  COMPLEX = 1 << 1,
  PRECEDENT = 1 << 2,
  ESCALATED = 1 << 3,
  REVIEWED = 1 << 4,
  APPEALED = 1 << 5,
  FINAL = 1 << 6,
  PUBLISHED = 1 << 7
}

export const enum ActionCode {
  DISMISS = 0,
  RETRY = 1,
  ESCALATE = 2,
  COMPENSATE = 3,
  REFORM = 4,
  INVESTIGATE = 5,
  MONITOR = 6,
  ARCHIVE = 7
}

export const enum StepStatus {
  PENDING = 0,
  ACTIVE = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
  DEFERRED = 5
}

// Type aliases for micro-optimization
export type DecisionId = UUID;
export type AppealId = BigInt;
export type UserId = number;
export type ReasonCode = number;
export type ConfidenceScore = number;
export type Weight = number;
export type Threshold = number;
export type Timestamp = number;
export type ImpactScore = number;
export type CostValue = number;
export type DaysCount = number;
export type NodeIndex = number;
export type FeatureIndex = number;
export type SampleCount = number;

// Memory-mapped decision storage
export interface DecisionStorage {
  readonly buffer: SharedArrayBuffer;
  readonly decisionOffset: number;
  readonly contextOffset: number;
  readonly impactOffset: number;
  readonly remediationOffset: number;
  readonly treeOffset: number;
}

// Batch decision processing
export interface DecisionBatch {
  readonly decisions: readonly Decision[];
  readonly contexts: readonly DecisionContext[];
  readonly batchSize: number;
  readonly batchHash: number;
  readonly timestamp: Timestamp;
}

// Decision statistics - minimal tracking
export interface DecisionStats {
  readonly totalDecisions: number;
  readonly avgConfidence: ConfidenceScore;
  readonly outcomeDistribution: Uint32Array; // 6 elements for outcomes
  readonly avgProcessingTime: number; // microseconds
  readonly memoryUsage: number; // bytes
}

// Fast decision predictor interface
export interface DecisionPredictor {
  readonly predict: (features: Float32Array) => DecisionOutcome;
  readonly confidence: (features: Float32Array) => ConfidenceScore;
  readonly explain: (features: Float32Array) => ReasonCode;
  readonly modelSize: number; // bytes
}

// Zero-allocation decision engine
export interface DecisionEngine {
  readonly tree: readonly DecisionNode[];
  readonly lut: DecisionLUT;
  readonly predictor: DecisionPredictor;
  readonly stats: DecisionStats;
  readonly storage: DecisionStorage;
}

// Compact precedent reference - 8 bytes
export interface PrecedentRef {
  readonly caseId: number; // 4 bytes - case hash
  readonly similarity: number; // 2 bytes - 0-65535
  readonly outcome: number; // 1 byte - outcome enum
  readonly confidence: number; // 1 byte - confidence 0-255
}

// Minimal legal basis - 4 bytes
export interface LegalBasis {
  readonly statute: number; // 2 bytes - statute code
  readonly section: number; // 1 byte - section number
  readonly subsection: number; // 1 byte - subsection
}

// Performance optimized feature vector
export interface FeatureVector {
  readonly features: Float32Array; // feature values
  readonly mask: BigInt; // which features are set
  readonly normalized: boolean; // if features are normalized
  readonly version: number; // feature schema version
}