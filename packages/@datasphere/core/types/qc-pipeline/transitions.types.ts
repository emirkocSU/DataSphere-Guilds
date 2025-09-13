/**
 * @fileoverview QC Pipeline Layer Transition Engine - Enterprise Orchestration
 * Ultra-lean transition system for 5-layer quality control workflow management
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer } from './enums';

export interface LayerTransition {
  readonly transitionId: UUID;
  readonly fromLayer: QCLayer;
  readonly toLayer: QCLayer;
  readonly triggeredByEvent: TransitionEvent;
  readonly criteria: TransitionCriteria;
  readonly dataCarryover: LayerDataCarryover;
  readonly validationRules: TransitionValidation[];
  readonly timestamp: ISOTimestamp;
  readonly metadata: TransitionMetadata;
}

export interface TransitionEvent {
  readonly eventType: 'LAYER_COMPLETE' | 'LAYER_FAIL' | 'TIMEOUT' | 'ESCALATION' | 'MANUAL_TRIGGER';
  readonly eventId: UUID;
  readonly payload: Record<string, unknown>;
  readonly source: QCLayer | 'SYSTEM' | 'USER';
}

export interface TransitionCriteria {
  readonly confidenceRequirement: ConfidenceRequirement;
  readonly businessRules: BusinessRule[];
  readonly qualityGates: QualityGate[];
  readonly timeConstraints: TimeConstraint;
  readonly resourceRequirements: ResourceRequirement[];
}

export interface ConfidenceRequirement {
  readonly minimumConfidence: number;
  readonly calculationMethod: 'WEIGHTED' | 'CONSENSUS' | 'STATISTICAL';
  readonly requireConsensus: boolean;
  readonly fallbackAction: 'ESCALATE' | 'RETRY' | 'SKIP';
}

export interface BusinessRule {
  readonly ruleId: UUID;
  readonly name: string;
  readonly expression: string;
  readonly priority: number;
  readonly enabled: boolean;
  readonly violationAction: 'BLOCK' | 'WARN' | 'LOG';
}

export interface QualityGate {
  readonly gateId: UUID;
  readonly name: string;
  readonly type: 'ACCURACY' | 'PERFORMANCE' | 'COST' | 'COMPLIANCE' | 'SECURITY';
  readonly threshold: QualityThreshold;
  readonly enforcement: 'STRICT' | 'ADVISORY' | 'MONITORING';
  readonly bypassConditions: BypassCondition[];
}

export interface QualityThreshold {
  readonly metric: string;
  readonly operator: 'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ' | 'BETWEEN';
  readonly value: number | [number, number];
  readonly tolerance: number;
}

export interface BypassCondition {
  readonly condition: string;
  readonly approvalRequired: boolean;
  readonly approverRole: string;
  readonly reason: string;
}

export interface TimeConstraint {
  readonly maxDuration: number;
  readonly warningThreshold: number;
  readonly gracePeriod: number;
  readonly timeZone: string;
}

export interface ResourceRequirement {
  readonly resourceType: 'CPU' | 'MEMORY' | 'STORAGE' | 'NETWORK' | 'LICENSE';
  readonly amount: number;
  readonly unit: string;
  readonly availability: 'IMMEDIATE' | 'SCHEDULED' | 'BEST_EFFORT';
}

export interface LayerDataCarryover {
  readonly preservedData: PreservedData;
  readonly contextualHints: ContextualHint[];
  readonly preservedState: StatePreservation;
  readonly sharedMetrics: SharedMetric[];
  readonly carryoverPolicy: CarryoverPolicy;
}

export interface PreservedData {
  readonly dataKeys: string[];
  readonly encryption: boolean;
  readonly compression: boolean;
  readonly ttl: number;
}

export interface ContextualHint {
  readonly hintType: 'PERFORMANCE' | 'ACCURACY' | 'COST' | 'ROUTING' | 'OPTIMIZATION';
  readonly value: unknown;
  readonly confidence: number;
  readonly source: QCLayer;
  readonly applicableLayers: QCLayer[];
}

export interface StatePreservation {
  readonly preserveCheckpoints: boolean;
  readonly preserveMetrics: boolean;
  readonly preserveErrors: boolean;
  readonly preserveDuration: number;
}

export interface SharedMetric {
  readonly metricName: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: ISOTimestamp;
  readonly relevantLayers: QCLayer[];
}

export interface CarryoverPolicy {
  readonly strategy: 'ALL' | 'SELECTIVE' | 'MINIMAL' | 'CUSTOM';
  readonly maxSize: number;
  readonly priorityOrder: string[];
  readonly compression: boolean;
}

export interface TransitionValidation {
  readonly validationId: UUID;
  readonly name: string;
  readonly type: 'PRE_TRANSITION' | 'POST_TRANSITION' | 'CONTINUOUS';
  readonly validator: ValidationFunction;
  readonly severity: 'ERROR' | 'WARNING' | 'INFO';
  readonly autoCorrect: boolean;
}

export interface ValidationFunction {
  readonly functionType: 'BUILTIN' | 'CUSTOM' | 'LAMBDA';
  readonly implementation: string;
  readonly parameters: Record<string, unknown>;
  readonly timeout: number;
}

export interface TransitionMetadata {
  readonly attempts: number;
  readonly lastAttemptTime: ISOTimestamp;
  readonly averageDuration: number;
  readonly successRate: number;
  readonly commonFailures: string[];
}

export interface TransitionTrigger {
  readonly triggerId: UUID;
  readonly condition: TriggerCondition;
  readonly action: TriggerAction;
  readonly enabled: boolean;
  readonly priority: number;
}

export interface TriggerCondition {
  readonly expression: string;
  readonly evaluationFrequency: number;
  readonly dependencies: string[];
  readonly context: Record<string, unknown>;
}

export interface TriggerAction {
  readonly type: 'INITIATE_TRANSITION' | 'ESCALATE' | 'NOTIFY' | 'LOG' | 'CUSTOM';
  readonly parameters: Record<string, unknown>;
  readonly delay: number;
  readonly retryPolicy: ActionRetryPolicy;
}

export interface ActionRetryPolicy {
  readonly maxRetries: number;
  readonly backoffStrategy: 'LINEAR' | 'EXPONENTIAL' | 'FIXED';
  readonly backoffMultiplier: number;
  readonly maxBackoff: number;
}

export interface TransitionSkipCondition {
  readonly skipId: UUID;
  readonly layer: QCLayer;
  readonly condition: string;
  readonly reason: string;
  readonly requiresApproval: boolean;
  readonly approverRoles: string[];
  readonly auditRequired: boolean;
}

export interface EscalationCondition {
  readonly escalationId: UUID;
  readonly trigger: TransitionEscalationTrigger;
  readonly targetLevel: 'SUPERVISOR' | 'EXPERT' | 'COMMITTEE' | 'EXTERNAL';
  readonly timeoutAction: 'AUTO_APPROVE' | 'AUTO_REJECT' | 'HUMAN_REQUIRED';
  readonly notificationChannels: string[];
}

export interface TransitionEscalationTrigger {
  readonly type: 'CONFIDENCE_LOW' | 'DISAGREEMENT' | 'TIMEOUT' | 'ERROR_THRESHOLD' | 'COST_EXCEEDED';
  readonly threshold: number;
  readonly windowSize: number;
  readonly consecutiveCount: number;
}