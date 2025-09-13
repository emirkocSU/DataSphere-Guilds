/**
 * @fileoverview QC Pipeline Intelligent Routing Engine - Enterprise Distribution System
 * Ultra-lean routing system for adaptive 5-layer quality control optimization
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer } from './enums';

export type SubmissionType = 'IMAGE' | 'AUDIO' | 'TEXT' | 'VIDEO' | 'GEOSPATIAL';
export type OptimizationTarget = 'SPEED' | 'ACCURACY' | 'COST' | 'BALANCED';

export interface QCRoutingEngine {
  readonly routingId: UUID;
  readonly submissionType: SubmissionType;
  readonly routingStrategy: RoutingStrategy;
  readonly requiredLayers: QCLayer[];
  readonly conditionalLayers: ConditionalLayer[];
  readonly bypassRules: BypassRule[];
  readonly prioritization: PriorityRule[];
  readonly loadBalancing: LoadBalancingConfig;
  readonly optimizationTarget: OptimizationTarget;
  readonly fallbackStrategy: FallbackStrategy;
  readonly layerSelection: LayerSelectionAlgorithm;
  readonly resourceAllocation: ResourceAllocationStrategy;
}

export interface RoutingStrategy {
  readonly type: 'SEQUENTIAL' | 'PARALLEL' | 'ADAPTIVE' | 'RISK_BASED' | 'COST_OPTIMIZED';
  readonly parameters: Record<string, number>;
  readonly adaptiveBehavior: boolean;
  readonly learningEnabled: boolean;
}

export interface ConditionalLayer {
  readonly layer: QCLayer;
  readonly condition: LayerCondition;
  readonly probability: number;
  readonly fallbackAction: 'SKIP' | 'ROUTE_TO_DEFAULT' | 'ESCALATE';
  readonly costBenefitAnalysis: CostBenefitAnalysis;
  readonly enablementCriteria: EnablementCriteria;
}

export interface LayerCondition {
  readonly type: 'CONFIDENCE_THRESHOLD' | 'COST_LIMIT' | 'TIME_CONSTRAINT' | 'QUALITY_TARGET';
  readonly expression: string;
  readonly parameters: Record<string, number>;
  readonly evaluation: ConditionEvaluation;
}

export interface ConditionEvaluation {
  readonly method: 'STATIC' | 'DYNAMIC' | 'ML_BASED' | 'RULE_BASED';
  readonly frequency: 'ONCE' | 'CONTINUOUS' | 'PERIODIC';
  readonly caching: boolean;
  readonly timeout: number;
}

export interface CostBenefitAnalysis {
  readonly cost: number;
  readonly benefit: number;
  readonly roi: number;
  readonly timeToValue: number;
  readonly riskAdjustment: number;
  readonly confidenceLevel: number;
}

export interface EnablementCriteria {
  readonly minConfidence: number;
  readonly maxCost: number;
  readonly timeConstraints: TimeConstraint[];
  readonly resourceAvailability: boolean;
}

export interface TimeConstraint {
  readonly type: 'MAX_DURATION' | 'DEADLINE' | 'SLA_REQUIREMENT';
  readonly value: number;
  readonly unit: 'SECONDS' | 'MINUTES' | 'HOURS';
  readonly critical: boolean;
}

export interface BypassRule {
  readonly ruleId: UUID;
  readonly condition: string;
  readonly layersToBypass: QCLayer[];
  readonly priority: number;
  readonly safetyChecks: SafetyCheck[];
  readonly auditRequirement: AuditRequirement;
  readonly approvalRequired: boolean;
}

export interface SafetyCheck {
  readonly checkType: 'CONFIDENCE' | 'QUALITY' | 'COMPLIANCE' | 'SECURITY';
  readonly threshold: number;
  readonly required: boolean;
  readonly fallback: 'BLOCK' | 'WARN' | 'LOG';
}

export interface AuditRequirement {
  readonly level: 'MINIMAL' | 'STANDARD' | 'DETAILED' | 'COMPREHENSIVE';
  readonly retention: number;
  readonly encryption: boolean;
  readonly notifications: string[];
}

export interface PriorityRule {
  readonly ruleId: UUID;
  readonly condition: string;
  readonly priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL';
  readonly bypassLayers?: QCLayer[];
  readonly fastTrack: boolean;
  readonly timeLimit?: number;
  readonly escalationPath: string[];
}

export interface LoadBalancingConfig {
  readonly strategy: 'ROUND_ROBIN' | 'WEIGHTED' | 'LEAST_CONNECTIONS' | 'ADAPTIVE';
  readonly weights?: Record<QCLayer, number>;
  readonly healthCheck: HealthCheckConfig;
  readonly failover: FailoverConfig;
  readonly capacityLimits: CapacityLimits;
}

export interface HealthCheckConfig {
  readonly enabled: boolean;
  readonly intervalMs: number;
  readonly timeoutMs: number;
  readonly failureThreshold: number;
  readonly recoveryThreshold: number;
  readonly endpoint: string;
}

export interface FailoverConfig {
  readonly enabled: boolean;
  readonly strategy: 'ACTIVE_PASSIVE' | 'ACTIVE_ACTIVE' | 'CIRCUIT_BREAKER';
  readonly threshold: number;
  readonly recovery: RecoveryConfig;
}

export interface RecoveryConfig {
  readonly automatic: boolean;
  readonly cooldown: number;
  readonly healthCheck: boolean;
  readonly gradual: boolean;
}

export interface CapacityLimits {
  readonly maxConcurrent: number;
  readonly queueLimit: number;
  readonly timeoutMs: number;
  readonly spilloverAction: 'REJECT' | 'QUEUE' | 'REDIRECT';
}

export interface FallbackStrategy {
  readonly primary: RoutingStrategy;
  readonly fallbacks: RoutingStrategy[];
  readonly triggers: FallbackTrigger[];
  readonly autoRecovery: boolean;
}

export interface FallbackTrigger {
  readonly condition: 'TIMEOUT' | 'ERROR_RATE' | 'CAPACITY' | 'QUALITY' | 'COST';
  readonly threshold: number;
  readonly windowSize: number;
  readonly action: 'SWITCH' | 'ESCALATE' | 'ABORT';
}

export interface LayerSelectionAlgorithm {
  readonly algorithmId: UUID;
  readonly type: 'GREEDY' | 'OPTIMAL' | 'HEURISTIC' | 'ML_BASED' | 'HYBRID';
  readonly criteria: SelectionCriteria;
  readonly weights: SelectionWeights;
  readonly constraints: SelectionConstraint[];
  readonly optimization: OptimizationConfig;
  readonly learning: LearningConfig;
}

export interface SelectionCriteria {
  readonly accuracy: number;
  readonly cost: number;
  readonly speed: number;
  readonly reliability: number;
  readonly capacity: number;
  readonly quality: number;
}

export interface SelectionWeights {
  readonly accuracy: number;
  readonly cost: number;
  readonly speed: number;
  readonly reliability: number;
  readonly capacity: number;
  readonly quality: number;
}

export interface SelectionConstraint {
  readonly type: 'HARD' | 'SOFT';
  readonly constraint: string;
  readonly penalty: number;
  readonly violation: 'BLOCK' | 'PENALIZE' | 'LOG';
}

export interface OptimizationConfig {
  readonly objective: 'MINIMIZE_COST' | 'MAXIMIZE_QUALITY' | 'MINIMIZE_TIME' | 'MAXIMIZE_THROUGHPUT';
  readonly algorithm: 'GENETIC' | 'SIMULATED_ANNEALING' | 'GRADIENT_DESCENT' | 'BAYESIAN';
  readonly iterations: number;
  readonly convergence: ConvergenceCriteria;
}

export interface ConvergenceCriteria {
  readonly tolerance: number;
  readonly maxIterations: number;
  readonly stagnationLimit: number;
  readonly timeLimit: number;
}

export interface LearningConfig {
  readonly enabled: boolean;
  readonly algorithm: 'REINFORCEMENT' | 'SUPERVISED' | 'UNSUPERVISED' | 'HYBRID';
  readonly learningRate: number;
  readonly adaptationFrequency: number;
  readonly feedbackSources: string[];
}

export interface ResourceAllocationStrategy {
  readonly strategyId: UUID;
  readonly type: 'STATIC' | 'DYNAMIC' | 'PREDICTIVE' | 'REACTIVE';
  readonly allocation: ResourceAllocation;
  readonly scaling: ScalingPolicy;
  readonly monitoring: ResourceMonitoring;
  readonly optimization: ResourceOptimization;
}

export interface ResourceAllocation {
  readonly cpu: AllocationRule;
  readonly memory: AllocationRule;
  readonly network: AllocationRule;
  readonly storage: AllocationRule;
  readonly licenses: AllocationRule;
}

export interface AllocationRule {
  readonly min: number;
  readonly max: number;
  readonly default: number;
  readonly burst: number;
  readonly priority: number;
  readonly reservable: boolean;
}

export interface ScalingPolicy {
  readonly enabled: boolean;
  readonly triggers: ScalingTrigger[];
  readonly actions: ScalingAction[];
  readonly cooldown: number;
  readonly limits: ScalingLimits;
  readonly predictive: boolean;
}

export interface ScalingTrigger {
  readonly metric: string;
  readonly threshold: number;
  readonly duration: number;
  readonly direction: 'UP' | 'DOWN';
  readonly sensitivity: number;
}

export interface ScalingAction {
  readonly type: 'ADD_INSTANCE' | 'REMOVE_INSTANCE' | 'ADJUST_CAPACITY' | 'REDISTRIBUTE';
  readonly amount: number;
  readonly delay: number;
  readonly conditions: string[];
}

export interface ScalingLimits {
  readonly minInstances: number;
  readonly maxInstances: number;
  readonly maxScaleUp: number;
  readonly maxScaleDown: number;
  readonly costLimit: number;
}

export interface ResourceMonitoring {
  readonly metrics: MonitoringMetric[];
  readonly sampling: SamplingConfig;
  readonly alerts: AlertConfig[];
  readonly reporting: ReportingConfig;
}

export interface MonitoringMetric {
  readonly name: string;
  readonly type: 'GAUGE' | 'COUNTER' | 'HISTOGRAM' | 'SUMMARY';
  readonly unit: string;
  readonly aggregation: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'COUNT';
}

export interface SamplingConfig {
  readonly interval: number;
  readonly retention: number;
  readonly compression: boolean;
  readonly precision: number;
}

export interface AlertConfig {
  readonly condition: string;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly threshold: number;
  readonly channels: string[];
}

export interface ReportingConfig {
  readonly frequency: 'REAL_TIME' | 'MINUTE' | 'HOUR' | 'DAY';
  readonly format: 'JSON' | 'CSV' | 'DASHBOARD';
  readonly recipients: string[];
}

export interface ResourceOptimization {
  readonly enabled: boolean;
  readonly strategy: 'COST' | 'PERFORMANCE' | 'BALANCED';
  readonly targets: OptimizationTarget[];
  readonly constraints: OptimizationConstraint[];
}

export interface OptimizationConstraint {
  readonly type: 'SLA' | 'BUDGET' | 'CAPACITY' | 'COMPLIANCE';
  readonly value: number;
  readonly enforcement: 'STRICT' | 'FLEXIBLE';
}