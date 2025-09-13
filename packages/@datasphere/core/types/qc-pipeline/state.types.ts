/**
 * @fileoverview QC Pipeline State Management - Enterprise Persistence Engine
 * Ultra-lean state system for 5-layer quality control lifecycle tracking
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer, QCPipelineStatus } from './enums';
import { RetryPolicy } from './orchestration.types';

export interface QCPipelineState {
  readonly pipelineId: UUID;
  readonly version: string;
  readonly currentState: QCPipelineStatus;
  readonly layerStates: Map<QCLayer, QCLayerState>;
  readonly lastModified: ISOTimestamp;
  readonly stateHistory: StateTransition[];
  readonly persistenceConfig: PersistenceConfig;
  readonly concurrencyControl: ConcurrencyControl;
  readonly checkpoints: Checkpoint[];
}

export interface QCLayerState {
  readonly layer: QCLayer;
  readonly status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  readonly startTime?: ISOTimestamp;
  readonly endTime?: ISOTimestamp;
  readonly processingTime?: number;
  readonly attempts: number;
  readonly lastError?: string;
  readonly checkpoints: LayerCheckpoint[];
  readonly resourceUsage: ResourceUsage;
  readonly metadata: LayerMetadata;
}

export interface LayerCheckpoint {
  readonly checkpointId: UUID;
  readonly timestamp: ISOTimestamp;
  readonly description: string;
  readonly data: Record<string, unknown>;
  readonly restorable: boolean;
  readonly size: number;
}

export interface ResourceUsage {
  readonly cpu: number;
  readonly memory: number;
  readonly network: number;
  readonly storage: number;
  readonly cost: number;
  readonly duration: number;
}

export interface LayerMetadata {
  readonly processingMode: 'SYNC' | 'ASYNC' | 'BATCH';
  readonly priority: number;
  readonly tags: string[];
  readonly customFields: Record<string, unknown>;
  readonly retryCount: number;
}

export interface StateTransition {
  readonly transitionId: UUID;
  readonly fromState: QCPipelineStatus;
  readonly toState: QCPipelineStatus;
  readonly event: StateEvent;
  readonly timestamp: ISOTimestamp;
  readonly trigger: TransitionTrigger;
  readonly metadata: TransitionMetadata;
}

export interface StateEvent {
  readonly eventType: 'USER_ACTION' | 'SYSTEM_EVENT' | 'TIMEOUT' | 'ERROR' | 'ESCALATION';
  readonly eventId: UUID;
  readonly payload: Record<string, unknown>;
  readonly source: string;
}

export interface TransitionTrigger {
  readonly type: 'MANUAL' | 'AUTOMATIC' | 'CONDITIONAL' | 'SCHEDULED';
  readonly condition?: string;
  readonly actor?: UUID;
  readonly reason: string;
}

export interface TransitionMetadata {
  readonly duration: number;
  readonly success: boolean;
  readonly rollbackCapable: boolean;
  readonly sideEffects: string[];
}

export interface PersistenceConfig {
  readonly strategy: 'MEMORY' | 'DISK' | 'DISTRIBUTED' | 'HYBRID';
  readonly durability: 'NONE' | 'EVENTUAL' | 'STRONG';
  readonly consistency: 'EVENTUAL' | 'STRONG' | 'LINEARIZABLE';
  readonly replication: ReplicationConfig;
  readonly backup: BackupConfig;
}

export interface ReplicationConfig {
  readonly enabled: boolean;
  readonly replicas: number;
  readonly strategy: 'SYNC' | 'ASYNC' | 'SEMI_SYNC';
  readonly regions: string[];
}

export interface BackupConfig {
  readonly enabled: boolean;
  readonly frequency: number;
  readonly retention: number;
  readonly compression: boolean;
  readonly encryption: boolean;
}

export interface ConcurrencyControl {
  readonly maxParallel: number;
  readonly currentExecuting: number;
  readonly queueDepth: number;
  readonly lockTimeout: number;
  readonly retryPolicy: RetryPolicy;
  readonly locks: StateLock[];
  readonly transactions: StateTransaction[];
}

export interface StateLock {
  readonly lockId: UUID;
  readonly type: 'READ' | 'WRITE' | 'EXCLUSIVE';
  readonly resource: string;
  readonly owner: UUID;
  readonly acquired: ISOTimestamp;
  readonly expires: ISOTimestamp;
}

export interface StateTransaction {
  readonly transactionId: UUID;
  readonly operations: StateOperation[];
  readonly status: 'PENDING' | 'COMMITTED' | 'ABORTED';
  readonly isolation: 'READ_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';
  readonly timeout: number;
}

export interface StateOperation {
  readonly operationId: UUID;
  readonly type: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  readonly target: string;
  readonly before?: unknown;
  readonly after?: unknown;
  readonly timestamp: ISOTimestamp;
}

export interface Checkpoint {
  readonly checkpointId: UUID;
  readonly timestamp: ISOTimestamp;
  readonly description: string;
  readonly state: PartialState;
  readonly restorable: boolean;
  readonly size: number;
  readonly compression: boolean;
}

export interface PartialState {
  readonly layerStates: Record<QCLayer, Partial<QCLayerState>>;
  readonly metadata: Record<string, unknown>;
  readonly checksum: string;
}

export interface StateSnapshot {
  readonly snapshotId: UUID;
  readonly pipelineState: QCPipelineState;
  readonly timestamp: ISOTimestamp;
  readonly reason: 'ROLLBACK' | 'DEBUG' | 'AUDIT' | 'CHECKPOINT';
  readonly compressed: boolean;
  readonly encrypted: boolean;
}

export interface StateValidation {
  readonly rules: ValidationRule[];
  readonly enforcement: 'STRICT' | 'LAX' | 'ADVISORY';
  readonly onViolation: 'BLOCK' | 'WARN' | 'LOG';
}

export interface ValidationRule {
  readonly ruleId: UUID;
  readonly name: string;
  readonly condition: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly enabled: boolean;
}

export interface StateRecovery {
  readonly enabled: boolean;
  readonly strategy: 'AUTOMATIC' | 'MANUAL' | 'HYBRID';
  readonly checkpoints: RecoveryCheckpoint[];
  readonly rollbackPolicy: RollbackPolicy;
}

export interface RecoveryCheckpoint {
  readonly checkpointId: UUID;
  readonly layer: QCLayer;
  readonly state: QCLayerState;
  readonly timestamp: ISOTimestamp;
  readonly reliability: number;
}

export interface RollbackPolicy {
  readonly maxRollbacks: number;
  readonly timeWindow: number;
  readonly conditions: RollbackCondition[];
  readonly notifications: boolean;
}

export interface RollbackCondition {
  readonly condition: string;
  readonly automatic: boolean;
  readonly approvalRequired: boolean;
  readonly impact: 'LOW' | 'MEDIUM' | 'HIGH';
}