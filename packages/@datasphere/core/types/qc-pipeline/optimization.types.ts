/**
 * @fileoverview QC Pipeline Performance Optimization - Enterprise Tuning Engine
 * Ultra-lean optimization system for 5-layer quality control performance enhancement
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { MetricType } from './monitoring.types';

export interface QCOptimizationConfig {
  readonly optimizationId: UUID;
  readonly strategy: OptimizationStrategy;
  readonly profiles: PerformanceProfile[];
  readonly autoTuningConfig: AutoTuningConfig;
  readonly cachingStrategy: CachingStrategy;
  readonly parallelizationConfig: ParallelizationConfig;
  readonly resourceAllocation: ResourceAllocationStrategy;
  readonly adaptiveThresholds: AdaptiveThreshold[];
  readonly performanceTuning: PerformanceTuning;
  readonly mlOptimization: MLOptimizationConfig;
}

export interface OptimizationStrategy {
  readonly type: 'COST' | 'SPEED' | 'ACCURACY' | 'BALANCED' | 'CUSTOM';
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly targets: OptimizationTarget[];
  readonly constraints: OptimizationConstraint[];
  readonly enabled: boolean;
}

export interface OptimizationTarget {
  readonly metric: string;
  readonly target: number;
  readonly weight: number;
  readonly tolerance: number;
}

export interface OptimizationConstraint {
  readonly type: 'HARD' | 'SOFT';
  readonly metric: string;
  readonly operator: 'LT' | 'LE' | 'GT' | 'GE' | 'EQ';
  readonly value: number;
  readonly penalty: number;
}

export interface PerformanceProfile {
  readonly profileId: UUID;
  readonly name: string;
  readonly description: string;
  readonly scenario: ProfileScenario;
  readonly parameters: ProfileParameters;
  readonly baseline: PerformanceBaseline;
  readonly thresholds: PerformanceThresholds;
}

export interface ProfileScenario {
  readonly workloadType: 'LIGHT' | 'NORMAL' | 'HEAVY' | 'BURST' | 'CUSTOM';
  readonly duration: 'SHORT' | 'MEDIUM' | 'LONG' | 'CONTINUOUS';
  readonly pattern: 'STEADY' | 'SPIKY' | 'GRADUAL' | 'RANDOM';
  readonly characteristics: ScenarioCharacteristics;
}

export interface ScenarioCharacteristics {
  readonly throughput: number;
  readonly latency: number;
  readonly accuracy: number;
  readonly cost: number;
  readonly concurrency: number;
}

export interface ProfileParameters {
  readonly batchSize: number;
  readonly timeoutMs: number;
  readonly retryAttempts: number;
  readonly cacheSize: number;
  readonly parallelism: number;
  readonly customParams: Record<string, unknown>;
}

export interface PerformanceBaseline {
  readonly timestamp: ISOTimestamp;
  readonly metrics: BaselineMetrics;
  readonly environment: string;
  readonly version: string;
  readonly stability: number;
}

export interface BaselineMetrics {
  readonly throughput: number;
  readonly latency: number;
  readonly accuracy: number;
  readonly cost: number;
  readonly reliability: number;
}

export interface PerformanceThresholds {
  readonly warning: ThresholdSet;
  readonly critical: ThresholdSet;
  readonly target: ThresholdSet;
  readonly adaptive: boolean;
}

export interface ThresholdSet {
  readonly throughput: number;
  readonly latency: number;
  readonly accuracy: number;
  readonly cost: number;
  readonly reliability: number;
}

export interface AutoTuningConfig {
  readonly enabled: boolean;
  readonly strategy: 'GENETIC' | 'BAYESIAN' | 'GRID_SEARCH' | 'RANDOM' | 'GRADIENT';
  readonly objectives: TuningObjective[];
  readonly constraints: TuningConstraint[];
  readonly convergence: ConvergenceCriteria;
  readonly schedule: TuningSchedule;
}

export interface TuningObjective {
  readonly metric: string;
  readonly direction: 'MINIMIZE' | 'MAXIMIZE';
  readonly weight: number;
  readonly tolerance: number;
  readonly priority: number;
}

export interface TuningConstraint {
  readonly parameter: string;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly type: 'CONTINUOUS' | 'DISCRETE' | 'CATEGORICAL';
}

export interface ConvergenceCriteria {
  readonly maxIterations: number;
  readonly tolerance: number;
  readonly stagnationLimit: number;
  readonly timeLimit: number;
  readonly improvementThreshold: number;
}

export interface TuningSchedule {
  readonly frequency: 'CONTINUOUS' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'TRIGGERED';
  readonly triggers: TuningTrigger[];
  readonly maintenanceWindow: MaintenanceWindow;
  readonly rollbackPolicy: RollbackPolicy;
}

export interface TuningTrigger {
  readonly type: 'PERFORMANCE_DEGRADATION' | 'ACCURACY_DROP' | 'COST_INCREASE' | 'MANUAL';
  readonly threshold: number;
  readonly duration: number;
  readonly enabled: boolean;
}

export interface MaintenanceWindow {
  readonly start: string;
  readonly end: string;
  readonly timezone: string;
  readonly days: string[];
}

export interface RollbackPolicy {
  readonly enabled: boolean;
  readonly conditions: RollbackCondition[];
  readonly automatic: boolean;
  readonly timeoutMs: number;
}

export interface RollbackCondition {
  readonly metric: string;
  readonly threshold: number;
  readonly duration: number;
  readonly severity: 'WARNING' | 'CRITICAL';
}

export interface CachingStrategy {
  readonly enabled: boolean;
  readonly ttlSeconds: number;
  readonly strategy: 'LRU' | 'LFU' | 'FIFO' | 'ADAPTIVE';
  readonly layers: CacheLayerConfig[];
  readonly invalidation: InvalidationStrategy;
}

export interface CacheLayerConfig {
  readonly layer: string;
  readonly enabled: boolean;
  readonly size: number;
  readonly ttl: number;
  readonly compression: boolean;
}

export interface InvalidationStrategy {
  readonly type: 'TIME_BASED' | 'EVENT_BASED' | 'MANUAL' | 'HYBRID';
  readonly triggers: InvalidationTrigger[];
  readonly batch: boolean;
}

export interface InvalidationTrigger {
  readonly event: string;
  readonly condition: string;
  readonly delay: number;
  readonly cascading: boolean;
}

export interface ParallelizationConfig {
  readonly enabled: boolean;
  readonly maxConcurrency: number;
  readonly strategy: 'LAYER_PARALLEL' | 'TASK_PARALLEL' | 'DATA_PARALLEL' | 'HYBRID';
  readonly loadBalancing: LoadBalancingConfig;
  readonly resourceSharing: ResourceSharingConfig;
}

export interface LoadBalancingConfig {
  readonly algorithm: 'ROUND_ROBIN' | 'LEAST_LOADED' | 'WEIGHTED' | 'ADAPTIVE';
  readonly weights: Record<string, number>;
  readonly healthChecks: boolean;
}

export interface ResourceSharingConfig {
  readonly shareMemory: boolean;
  readonly shareConnections: boolean;
  readonly isolationLevel: 'NONE' | 'BASIC' | 'STRONG';
  readonly limits: ResourceLimits;
}

export interface ResourceLimits {
  readonly cpu: number;
  readonly memory: number;
  readonly network: number;
  readonly storage: number;
}

export interface ResourceAllocationStrategy {
  readonly strategy: 'STATIC' | 'DYNAMIC' | 'PREDICTIVE';
  readonly allocation: ResourceAllocation;
  readonly scaling: ScalingConfig;
  readonly monitoring: OptimizationResourceMonitoring;
}

export interface ResourceAllocation {
  readonly cpu: AllocationRule;
  readonly memory: AllocationRule;
  readonly network: AllocationRule;
  readonly storage: AllocationRule;
}

export interface AllocationRule {
  readonly min: number;
  readonly max: number;
  readonly default: number;
  readonly burst: number;
  readonly priority: number;
}

export interface ScalingConfig {
  readonly enabled: boolean;
  readonly minInstances: number;
  readonly maxInstances: number;
  readonly triggers: ScalingTrigger[];
  readonly cooldown: number;
}

export interface ScalingTrigger {
  readonly metric: string;
  readonly threshold: number;
  readonly direction: 'UP' | 'DOWN';
  readonly duration: number;
}

export interface OptimizationResourceMonitoring {
  readonly enabled: boolean;
  readonly interval: number;
  readonly metrics: string[];
  readonly alerts: MonitoringAlert[];
}

export interface MonitoringAlert {
  readonly condition: string;
  readonly severity: 'INFO' | 'WARNING' | 'CRITICAL';
  readonly action: 'LOG' | 'NOTIFY' | 'SCALE' | 'OPTIMIZE';
}

export interface AdaptiveThreshold {
  readonly metric: MetricType;
  readonly currentValue: number;
  readonly adjustmentRange: { min: number; max: number };
  readonly learningRate: number;
  readonly history: ThresholdHistory[];
  readonly sensitivity: number;
  readonly adaptation: AdaptationConfig;
}

export interface ThresholdHistory {
  readonly timestamp: ISOTimestamp;
  readonly value: number;
  readonly performance: number;
  readonly context: Record<string, unknown>;
  readonly confidence: number;
}

export interface AdaptationConfig {
  readonly algorithm: 'GRADIENT' | 'MOMENTUM' | 'ADAPTIVE' | 'BAYESIAN';
  readonly window: number;
  readonly momentum: number;
  readonly exploration: number;
}

export interface PerformanceTuning {
  readonly batchSize: number;
  readonly timeoutMs: number;
  readonly retryAttempts: number;
  readonly connectionPooling: ConnectionPoolConfig;
  readonly memoryManagement: MemoryConfig;
}

export interface ConnectionPoolConfig {
  readonly enabled: boolean;
  readonly minConnections: number;
  readonly maxConnections: number;
  readonly idleTimeout: number;
  readonly validation: boolean;
}

export interface MemoryConfig {
  readonly heapSize: number;
  readonly gcStrategy: 'SERIAL' | 'PARALLEL' | 'G1' | 'ZGC';
  readonly cacheSize: number;
  readonly bufferSize: number;
}

export interface MLOptimizationConfig {
  readonly enabled: boolean;
  readonly models: MLModel[];
  readonly training: TrainingConfig;
  readonly inference: InferenceConfig;
  readonly feedback: FeedbackLoop;
}

export interface MLModel {
  readonly modelId: UUID;
  readonly type: 'REGRESSION' | 'CLASSIFICATION' | 'CLUSTERING' | 'REINFORCEMENT';
  readonly algorithm: 'LINEAR' | 'TREE' | 'NEURAL' | 'ENSEMBLE';
  readonly features: FeatureConfig[];
  readonly performance: ModelPerformance;
}

export interface FeatureConfig {
  readonly name: string;
  readonly type: 'NUMERICAL' | 'CATEGORICAL' | 'TEXT' | 'TIME_SERIES';
  readonly preprocessing: PreprocessingStep[];
  readonly importance: number;
}

export interface PreprocessingStep {
  readonly type: 'NORMALIZE' | 'ENCODE' | 'TRANSFORM' | 'SELECT';
  readonly parameters: Record<string, unknown>;
  readonly order: number;
}

export interface ModelPerformance {
  readonly accuracy: number;
  readonly precision: number;
  readonly recall: number;
  readonly f1Score: number;
  readonly latency: number;
}

export interface TrainingConfig {
  readonly strategy: 'BATCH' | 'ONLINE' | 'FEDERATED';
  readonly schedule: TrainingSchedule;
  readonly validation: ValidationConfig;
  readonly hyperparameters: HyperparameterConfig;
}

export interface TrainingSchedule {
  readonly frequency: 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'TRIGGERED';
  readonly triggers: TrainingTrigger[];
  readonly resources: ResourceRequirement;
}

export interface TrainingTrigger {
  readonly type: 'DATA_DRIFT' | 'PERFORMANCE_DROP' | 'SCHEDULE' | 'MANUAL';
  readonly threshold: number;
  readonly enabled: boolean;
}

export interface ResourceRequirement {
  readonly cpu: number;
  readonly memory: number;
  readonly gpu?: number;
  readonly duration: number;
}

export interface ValidationConfig {
  readonly method: 'HOLDOUT' | 'CROSS_VALIDATION' | 'BOOTSTRAP';
  readonly split: number;
  readonly folds?: number;
  readonly stratified: boolean;
}

export interface HyperparameterConfig {
  readonly optimization: 'GRID' | 'RANDOM' | 'BAYESIAN' | 'GENETIC';
  readonly budget: number;
  readonly parameters: HyperparameterSpace[];
}

export interface HyperparameterSpace {
  readonly name: string;
  readonly type: 'CONTINUOUS' | 'DISCRETE' | 'CATEGORICAL';
  readonly range: [number, number] | number[] | string[];
  readonly distribution?: 'UNIFORM' | 'LOG_UNIFORM' | 'NORMAL';
}

export interface InferenceConfig {
  readonly serving: ServingConfig;
  readonly caching: InferenceCaching;
  readonly batching: BatchingConfig;
  readonly monitoring: InferenceMonitoring;
}

export interface ServingConfig {
  readonly endpoint: string;
  readonly concurrency: number;
  readonly timeout: number;
  readonly retries: number;
  readonly loadBalancing: boolean;
}

export interface InferenceCaching {
  readonly enabled: boolean;
  readonly ttl: number;
  readonly strategy: 'RESULT' | 'FEATURE' | 'BOTH';
  readonly invalidation: boolean;
}

export interface BatchingConfig {
  readonly enabled: boolean;
  readonly maxSize: number;
  readonly timeout: number;
  readonly dynamic: boolean;
}

export interface InferenceMonitoring {
  readonly latency: boolean;
  readonly throughput: boolean;
  readonly accuracy: boolean;
  readonly drift: DriftDetection;
}

export interface DriftDetection {
  readonly enabled: boolean;
  readonly method: 'STATISTICAL' | 'DISTANCE' | 'ADVERSARIAL';
  readonly threshold: number;
  readonly window: number;
}

export interface FeedbackLoop {
  readonly enabled: boolean;
  readonly sources: FeedbackSource[];
  readonly processing: FeedbackProcessing;
  readonly integration: FeedbackIntegration;
}

export interface FeedbackSource {
  readonly type: 'PERFORMANCE' | 'ACCURACY' | 'USER' | 'SYSTEM';
  readonly weight: number;
  readonly frequency: number;
  readonly validation: boolean;
}

export interface FeedbackProcessing {
  readonly aggregation: 'WEIGHTED' | 'AVERAGE' | 'CONSENSUS';
  readonly filtering: boolean;
  readonly validation: boolean;
  readonly storage: string;
}

export interface FeedbackIntegration {
  readonly realTime: boolean;
  readonly batch: boolean;
  readonly threshold: number;
  readonly adaptation: boolean;
}