/**
 * @fileoverview QC Pipeline Orchestration Types - Enterprise Core Engine
 * Ultra-lean orchestration system for 5-layer quality control processing
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer, QCPipelineStatus } from './enums';

export interface QCPipelineOrchestrator {
  readonly pipelineId: UUID;
  readonly submissionId: UUID;
  readonly version: string;
  readonly configurationId: UUID;
  readonly activeStateSnapshotId: UUID;
  readonly status: QCPipelineStatus;
  readonly currentLayer: QCLayer | null;
  readonly layerSequence: QCLayer[];
  readonly escalationPath: EscalationPath;
  readonly executionContext: PipelineExecutionContext;
  readonly startTime: ISOTimestamp;
  readonly endTime?: ISOTimestamp;
  readonly metadata: PipelineMetadata;
}

export interface PipelineMetadata {
  readonly submissionType: 'IMAGE' | 'TEXT' | 'VIDEO' | 'AUDIO' | 'GEOSPATIAL';
  readonly priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';
  readonly ownerId: UUID;
  readonly costCenter: string;
  readonly sla: SLARequirements;
  readonly dataSensitivity: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  readonly tags: string[];
}

export interface SLARequirements {
  readonly maxProcessingTime: number;
  readonly targetAccuracy: number;
  readonly availabilityTarget: number;
  readonly escalationThreshold: number;
}

export interface EscalationStep {
  readonly stepId: UUID;
  readonly trigger: PipelineEscalationTrigger;
  readonly targetLayer: QCLayer | 'HUMAN_REVIEW' | 'EXPERT_PANEL';
  readonly resolver: ResolverConfig;
  readonly evidenceRequirements: EvidenceRequirement[];
  readonly automaticAction: AutomaticAction;
  readonly timeoutMs: number;
}

export interface PipelineEscalationTrigger {
  readonly type: 'CONFIDENCE_BELOW' | 'TIME_EXCEEDED' | 'ERROR_THRESHOLD' | 'QUALITY_DEGRADATION';
  readonly threshold: number;
  readonly duration?: number;
}

export interface ResolverConfig {
  readonly type: 'AUTOMATED' | 'HUMAN' | 'EXPERT' | 'COMMITTEE';
  readonly assigneeId?: UUID;
  readonly skillRequirements: string[];
  readonly escalationLevel: number;
}

export interface EvidenceRequirement {
  readonly type: 'LOGS' | 'METRICS' | 'SCREENSHOTS' | 'TRACES' | 'AUDIT_TRAIL';
  readonly mandatory: boolean;
  readonly retentionDays: number;
}

export interface AutomaticAction {
  readonly type: 'RETRY' | 'SKIP' | 'ABORT' | 'ESCALATE' | 'ROLLBACK';
  readonly parameters: Record<string, unknown>;
  readonly maxAttempts: number;
}

export type EscalationPath = EscalationStep[];

export interface PipelineExecutionContext {
  readonly executionId: UUID;
  readonly traceId: string;
  readonly securityContext: SecurityContext;
  readonly resourceAllocation: ResourceAllocation;
  readonly sessionData: SessionData;
  readonly parentPipelineId?: UUID;
}

export interface SecurityContext {
  readonly userId: UUID;
  readonly permissions: string[];
  readonly accessLevel: 'read' | 'write' | 'admin';
  readonly ipAddress: string;
  readonly userAgent: string;
}

export interface ResourceAllocation {
  readonly cpu: number;
  readonly memory: number;
  readonly maxConcurrency: number;
  readonly priority: number;
  readonly reservedUntil: ISOTimestamp;
}

export interface SessionData {
  readonly sessionId: UUID;
  readonly clientId: string;
  readonly correlationId: string;
  readonly customProperties: Record<string, unknown>;
}

export interface PipelineConfiguration {
  readonly configId: UUID;
  readonly version: string;
  readonly strategy: 'SEQUENTIAL' | 'PARALLEL' | 'ADAPTIVE' | 'OPTIMIZED';
  readonly layerConfigs: LayerConfiguration[];
  readonly globalSettings: GlobalSettings;
  readonly createdAt: ISOTimestamp;
  readonly lastModified: ISOTimestamp;
}

export interface LayerConfiguration {
  readonly layer: QCLayer;
  readonly enabled: boolean;
  readonly weight: number;
  readonly timeout: number;
  readonly retryPolicy: RetryPolicy;
  readonly skipConditions: SkipCondition[];
}

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly backoffMs: number;
  readonly exponential: boolean;
  readonly jitter: boolean;
}

export interface SkipCondition {
  readonly condition: string;
  readonly reason: string;
  readonly requiresApproval: boolean;
}

export interface GlobalSettings {
  readonly timeoutMs: number;
  readonly maxRetries: number;
  readonly enableCaching: boolean;
  readonly auditLevel: 'MINIMAL' | 'STANDARD' | 'DETAILED' | 'COMPREHENSIVE';
  readonly notifications: NotificationSettings;
}

export interface NotificationSettings {
  readonly enabled: boolean;
  readonly channels: ('EMAIL' | 'SLACK' | 'WEBHOOK')[];
  readonly recipients: string[];
  readonly events: NotificationEvent[];
}

export interface NotificationEvent {
  readonly event: 'START' | 'COMPLETE' | 'FAIL' | 'ESCALATE' | 'TIMEOUT';
  readonly threshold?: number;
  readonly template: string;
}