/**
 * @fileoverview Micro-optimized appeals workflow with zero-allocation state machine.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

// Ultra-lean state machine using const enums for zero runtime cost
export const enum AppealState {
  DRAFT = 0,
  SUBMITTED = 1,
  REVIEWING = 2,
  EVIDENCE = 3,
  DECISION = 4,
  APPEAL = 5,
  CLOSED = 6
}

export const enum TriggerEvent {
  SUBMIT = 0,
  START_REVIEW = 1,
  REQUEST_EVIDENCE = 2,
  SUBMIT_EVIDENCE = 3,
  APPROVE = 4,
  REJECT = 5,
  ESCALATE = 6,
  TIMEOUT = 7
}

/**
 * Minimal workflow definition - 32 bytes packed
 */
export interface AppealWorkflow {
  readonly id: UUID; // 16 bytes
  readonly state: AppealState; // 1 byte
  readonly flags: number; // 4 bytes - bit flags
  readonly timestamp: number; // 8 bytes - unix timestamp
  readonly userId: number; // 4 bytes - user ID hash
}

/**
 * Compact transition rule - 12 bytes
 */
export interface StateTransition {
  readonly from: AppealState; // 1 byte
  readonly to: AppealState; // 1 byte
  readonly trigger: TriggerEvent; // 1 byte
  readonly guard: number; // 4 bytes - guard function ID
  readonly action: number; // 4 bytes - action function ID
  readonly delay: number; // 1 byte - delay in minutes
}

/**
 * Binary context for extreme performance
 */
export interface WorkflowContext {
  readonly buffer: ArrayBuffer; // All data in binary format
  readonly view: DataView; // Fast access view
}

/**
 * Micro audit log - 24 bytes per entry
 */
export interface MicroAuditLog {
  readonly timestamp: number; // 8 bytes
  readonly actor: number; // 4 bytes - actor ID hash
  readonly action: TriggerEvent; // 1 byte
  readonly state: AppealState; // 1 byte
  readonly flags: number; // 4 bytes
  readonly checksum: number; // 4 bytes
  readonly reserved: number; // 2 bytes - for alignment
}

/**
 * Evidence validation - packed structure
 */
export interface EvidenceCheck {
  readonly type: number; // 1 byte - evidence type
  readonly status: number; // 1 byte - validation status
  readonly hash: Uint32Array; // 8 bytes - 256-bit hash as 8x32
  readonly metadata: number; // 4 bytes - packed metadata
}

/**
 * Decision matrix - ultra-compact
 */
export interface DecisionMatrix {
  readonly weights: Float32Array; // Weight matrix
  readonly thresholds: Float32Array; // Decision thresholds
  readonly bias: number; // Bias term
}

// Bit flags for workflow context (zero memory allocation)
export const enum WorkflowFlag {
  URGENT = 1 << 0,
  FINANCIAL = 1 << 1,
  LEGAL = 1 << 2,
  AUTOMATED = 1 << 3,
  ESCALATED = 1 << 4,
  EXTERNAL = 1 << 5,
  CONFIDENTIAL = 1 << 6,
  ARCHIVED = 1 << 7
}

// Evidence types as bit flags
export const enum EvidenceType {
  SCREENSHOT = 1 << 0,
  VIDEO = 1 << 1,
  AUDIO = 1 << 2,
  DOCUMENT = 1 << 3,
  SYSTEM_LOG = 1 << 4,
  FORENSIC = 1 << 5,
  WITNESS = 1 << 6,
  EXPERT = 1 << 7
}

// Validation status flags
export const enum ValidationFlag {
  PENDING = 0,
  VALID = 1,
  INVALID = 2,
  CORRUPTED = 3,
  EXPIRED = 4,
  DISPUTED = 5
}

/**
 * Memory-mapped workflow state for extreme performance
 */
export interface WorkflowMemoryMap {
  readonly buffer: SharedArrayBuffer;
  readonly stateOffset: number;
  readonly flagsOffset: number;
  readonly timestampOffset: number;
  readonly counterOffset: number;
}

/**
 * Fast hash function for compact IDs
 */
export type FastHash = (input: string) => number;

/**
 * Type aliases for maximum performance
 */
export type StateId = AppealState;
export type EventId = TriggerEvent;
export type UserId = number; // 32-bit hash of UUID
export type Timestamp = number; // Unix timestamp
export type Flags = number; // Bit flags
export type Hash = Uint32Array; // 256-bit hash as 8x32
export type Offset = number; // Memory offset

/**
 * Function registry for zero-allocation dispatch
 */
export interface FunctionRegistry {
  readonly guards: ReadonlyArray<(context: WorkflowContext) => boolean>;
  readonly actions: ReadonlyArray<(context: WorkflowContext) => void>;
}

/**
 * State machine definition - compile-time optimized
 */
export interface StateMachine {
  readonly states: ReadonlyArray<StateId>;
  readonly transitions: ReadonlyArray<StateTransition>;
  readonly registry: FunctionRegistry;
  readonly initialState: StateId;
}

/**
 * Workflow execution statistics - minimal tracking
 */
export interface WorkflowStats {
  readonly totalTransitions: number;
  readonly averageLatency: number; // microseconds
  readonly errorRate: number; // 0-1
  readonly memoryUsage: number; // bytes
}
