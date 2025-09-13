/**
 * DataSphere Guilds - Advanced Sensor Features & Edge Computing Types
 * Optimized for edge computing, AI/ML capabilities, and advanced sensor operations
 * 
 * Bundle Impact: ~4-5KB (vs 12KB in monolith)
 * Performance Focus: Edge processing, AI inference, advanced algorithms
 */

import { BaseSensorData, SensorId, TimestampISO, SensorStatus, SensorType } from './sensor-core';
import { EdgeNode, EdgeCapability } from './sensor-connectivity';
import { AnalyticsTimeframe, MetricType } from './sensor-analytics';

// ==================== EDGE COMPUTING ====================

export type EdgeProcessingType = 
  | 'data-filtering' | 'data-aggregation' | 'anomaly-detection' | 'ml-inference' 
  | 'image-processing' | 'signal-processing' | 'compression' | 'encryption'
  | 'protocol-conversion' | 'data-fusion';

export type ComputeResource = 'cpu' | 'gpu' | 'tpu' | 'fpga' | 'dsp' | 'neuromorphic' | 'quantum';

export interface EdgeComputingConfig {
  readonly nodeId: string;
  readonly capabilities: EdgeCapability[];
  readonly availableResources: ComputeResource[];
  readonly processingPipeline: ProcessingStage[];
  readonly resourceAllocation: ResourceAllocation;
  readonly loadBalancing: LoadBalancingConfig;
  readonly failoverStrategy: FailoverStrategy;
  readonly dataRetention: DataRetentionPolicy;
}

export interface ProcessingStage {
  readonly id: string;
  readonly type: EdgeProcessingType;
  readonly priority: 1 | 2 | 3 | 4 | 5; // 1=highest
  readonly resourceRequirements: ResourceRequirement;
  readonly inputTypes: string[];
  readonly outputTypes: string[];
  readonly processingLatency: number; // ms
  readonly accuracy: number; // 0-1
  readonly energyConsumption: number; // watts
}

export interface ResourceRequirement {
  readonly cpuCores: number;
  readonly memoryMB: number;
  readonly storageGB: number;
  readonly networkBandwidthMbps: number;
  readonly specializedHardware?: ComputeResource[];
  readonly maxLatencyMs: number;
  readonly parallelizable: boolean;
}

export interface ResourceAllocation {
  readonly cpuAllocation: number; // 0-1 of total
  readonly memoryAllocation: number; // 0-1 of total
  readonly storageAllocation: number; // 0-1 of total
  readonly networkAllocation: number; // 0-1 of total
  readonly priorityQueues: Record<string, number>; // queue -> weight
  readonly dynamicScaling: boolean;
  readonly resourceLimits: ResourceLimit[];
}

export interface ResourceLimit {
  readonly resource: ComputeResource;
  readonly maxUsage: number; // 0-1
  readonly throttleThreshold: number; // 0-1
  readonly killThreshold: number; // 0-1
  readonly cooldownPeriodMs: number;
}

export interface LoadBalancingConfig {
  readonly algorithm: 'round-robin' | 'least-connections' | 'resource-based' | 'latency-based' | 'ai-optimized';
  readonly healthCheckInterval: number; // ms
  readonly sessionAffinity: boolean;
  readonly adaptiveRouting: boolean;
  readonly predictiveScaling: boolean;
  readonly failoverTimeout: number; // ms
}

export interface FailoverStrategy {
  readonly primaryNodes: string[];
  readonly backupNodes: string[];
  readonly cloudFallback: boolean;
  readonly dataConsistency: 'eventual' | 'strong' | 'weak';
  readonly maxFailoverTime: number; // ms
  readonly automaticRecovery: boolean;
  readonly rollbackSupported: boolean;
}

export interface DataRetentionPolicy {
  readonly rawDataDays: number;
  readonly processedDataDays: number;
  readonly metadataDays: number;
  readonly compressionEnabled: boolean;
  readonly archivalStorage: boolean;
  readonly encryptionRequired: boolean;
  readonly complianceLevel: 'none' | 'gdpr' | 'hipaa' | 'sox' | 'pci';
}

// ==================== AI/ML CAPABILITIES ====================

export type MLModelType = 
  | 'classification' | 'regression' | 'clustering' | 'anomaly-detection' 
  | 'forecasting' | 'computer-vision' | 'nlp' | 'reinforcement-learning' | 'federated-learning';

export type MLFramework = 'tensorflow' | 'pytorch' | 'onnx' | 'scikit-learn' | 'xgboost' | 'lightgbm' | 'custom';

export type OptimizationTarget = 'accuracy' | 'latency' | 'energy' | 'memory' | 'bandwidth' | 'cost';

export interface MLModelConfig {
  readonly modelId: string;
  readonly name: string;
  readonly type: MLModelType;
  readonly framework: MLFramework;
  readonly version: string;
  readonly inputFeatures: FeatureDefinition[];
  readonly outputClasses: string[];
  readonly accuracy: number; // 0-1
  readonly latencyMs: number;
  readonly memorySizeMB: number;
  readonly inferenceFrequency: number; // per second
  readonly retrainingInterval: number; // hours
}

export interface FeatureDefinition {
  readonly name: string;
  readonly type: 'numeric' | 'categorical' | 'text' | 'image' | 'audio' | 'timeseries';
  readonly dimension: number[];
  readonly preprocessingSteps: string[];
  readonly scalingMethod?: 'standardization' | 'normalization' | 'min-max' | 'robust';
  readonly encodingMethod?: 'one-hot' | 'label' | 'target' | 'embedding';
  readonly importance: number; // 0-1
}

export interface FederatedLearningConfig {
  readonly enabled: boolean;
  readonly aggregationStrategy: 'fedavg' | 'fedprox' | 'fedbn' | 'scaffold';
  readonly participantNodes: string[];
  readonly minParticipants: number;
  readonly roundDuration: number; // minutes
  readonly communicationEfficiency: number; // 0-1
  readonly privacyPreservation: PrivacyConfig;
  readonly incentiveMechanism: IncentiveConfig;
}

export interface PrivacyConfig {
  readonly differentialPrivacy: boolean;
  readonly privacyBudget: number;
  readonly noiseMultiplier: number;
  readonly clippingNorm: number;
  readonly secureAggregation: boolean;
  readonly homomorphicEncryption: boolean;
  readonly multiPartyComputation: boolean;
}

export interface IncentiveConfig {
  readonly rewardMechanism: 'contribution-based' | 'accuracy-based' | 'data-quality' | 'resource-sharing';
  readonly tokenReward: number;
  readonly reputationSystem: boolean;
  readonly penaltyForDropout: number;
  readonly bonusForConsistency: number;
}

export interface AutoMLConfig {
  readonly enabled: boolean;
  readonly searchSpace: SearchSpaceConfig;
  readonly optimizationTarget: OptimizationTarget;
  readonly maxTrials: number;
  readonly maxDuration: number; // hours
  readonly earlyStoppingEnabled: boolean;
  readonly resourceBudget: ResourceBudget;
  readonly hyperparameterTuning: HyperparameterConfig;
}

export interface SearchSpaceConfig {
  readonly modelTypes: MLModelType[];
  readonly frameworks: MLFramework[];
  readonly architectures: string[];
  readonly featureEngineering: boolean;
  readonly ensembleMethods: boolean;
  readonly quantizationLevels: number[];
  readonly pruningStrategies: string[];
}

export interface ResourceBudget {
  readonly maxCpuHours: number;
  readonly maxMemoryGB: number;
  readonly maxGpuHours: number;
  readonly maxStorageGB: number;
  readonly maxCostUSD: number;
  readonly cloudResourcesAllowed: boolean;
}

export interface HyperparameterConfig {
  readonly searchStrategy: 'grid' | 'random' | 'bayesian' | 'evolutionary' | 'hyperband';
  readonly parallelTrials: number;
  readonly crossValidationFolds: number;
  readonly metricToOptimize: string;
  readonly customObjective?: string;
  readonly constraintOptimization: boolean;
}

// ==================== ADVANCED SENSOR FEATURES ====================

export interface SensorFusion {
  readonly enabled: boolean;
  readonly primarySensors: SensorId[];
  readonly auxiliarySensors: SensorId[];
  readonly fusionAlgorithm: 'kalman-filter' | 'particle-filter' | 'neural-network' | 'weighted-average' | 'bayesian';
  readonly outputFormat: string;
  readonly confidenceThreshold: number; // 0-1
  readonly latencyRequirement: number; // ms
  readonly accuracyImprovement: number; // percentage
}

export interface AdaptiveSampling {
  readonly enabled: boolean;
  readonly algorithm: 'entropy-based' | 'uncertainty-based' | 'change-detection' | 'predictive' | 'hybrid';
  readonly baseSamplingRate: number; // Hz
  readonly maxSamplingRate: number; // Hz
  readonly minSamplingRate: number; // Hz
  readonly adaptationSpeed: number; // 0-1
  readonly energySavings: number; // percentage
  readonly qualityMaintenance: number; // 0-1
}

export interface DigitalTwin {
  readonly twinId: string;
  readonly physicalSensorId: SensorId;
  readonly modelAccuracy: number; // 0-1
  readonly synchronizationInterval: number; // ms
  readonly virtualSensorCapabilities: string[];
  readonly simulationScenarios: SimulationScenario[];
  readonly predictiveCapabilities: PredictiveCapability[];
  readonly calibrationDrift: number; // percentage
}

export interface SimulationScenario {
  readonly scenarioId: string;
  readonly name: string;
  readonly description: string;
  readonly inputParameters: Record<string, any>;
  readonly expectedOutcomes: Record<string, any>;
  readonly simulationDuration: number; // seconds
  readonly confidenceLevel: number; // 0-1
  readonly resourceRequirements: ResourceRequirement;
}

export interface PredictiveCapability {
  readonly type: 'failure-prediction' | 'performance-degradation' | 'maintenance-schedule' | 'calibration-drift';
  readonly predictionHorizon: number; // hours
  readonly accuracy: number; // 0-1
  readonly updateFrequency: number; // minutes
  readonly actionRecommendations: string[];
  readonly riskAssessment: RiskAssessment;
}

export interface RiskAssessment {
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly probability: number; // 0-1
  readonly impact: 'minimal' | 'moderate' | 'significant' | 'severe';
  readonly timeToEvent: number; // hours
  readonly mitigationStrategies: string[];
  readonly costOfInaction: number; // currency units
}

// ==================== QUANTUM SENSING ====================

export interface QuantumSensor {
  readonly sensorId: SensorId;
  readonly quantumTechnology: 'superconducting' | 'trapped-ion' | 'photonic' | 'atomic' | 'spin-based';
  readonly coherenceTime: number; // microseconds
  readonly fidelity: number; // 0-1
  readonly quantumAdvantage: boolean;
  readonly errorCorrectionEnabled: boolean;
  readonly entanglementFactor: number; // 0-1
  readonly decoherenceRate: number; // Hz
}

export interface QuantumProcessing {
  readonly algorithmType: 'quantum-ml' | 'quantum-optimization' | 'quantum-simulation' | 'quantum-sensing';
  readonly quantumCircuitDepth: number;
  readonly gateCount: number;
  readonly quantumVolume: number;
  readonly classicalPreprocessing: boolean;
  readonly hybridApproach: boolean;
  readonly quantumAdvantageMetric: number;
}

// ==================== NEUROMORPHIC COMPUTING ====================

export interface NeuromorphicProcessor {
  readonly processorType: 'spiking-neural-network' | 'memristor-based' | 'photonic-neural' | 'bio-inspired';
  readonly neuronCount: number;
  readonly synapseCount: number;
  readonly powerEfficiency: number; // operations per watt
  readonly realTimeProcessing: boolean;
  readonly adaptiveLearning: boolean;
  readonly eventDriven: boolean;
  readonly plasticityEnabled: boolean;
}

export interface SpikingNeuralNetwork {
  readonly networkTopology: NetworkTopology;
  readonly neuronModel: 'leaky-integrate-fire' | 'hodgkin-huxley' | 'izhikevich' | 'adaptive-exponential';
  readonly synapsePlasticity: 'stdp' | 'homeostatic' | 'triplet-rule' | 'voltage-dependent';
  readonly encodingScheme: 'rate-coding' | 'temporal-coding' | 'population-coding' | 'sparse-coding';
  readonly learningRate: number;
  readonly memoryCapacity: number; // patterns
}

export interface NetworkTopology {
  readonly layerCount: number;
  readonly neuronsPerLayer: number[];
  readonly connectionDensity: number; // 0-1
  readonly recurrentConnections: boolean;
  readonly lateralInhibition: boolean;
  readonly delayLines: boolean;
  readonly modularStructure: boolean;
}

// ==================== BIOMETRIC & HEALTH SENSING ====================

export interface BiometricSensor {
  readonly biometricType: 'fingerprint' | 'iris' | 'face' | 'voice' | 'gait' | 'heart-rate' | 'blood-oxygen' | 'eeg' | 'emg';
  readonly accuracy: number; // 0-1
  readonly falseAcceptanceRate: number; // 0-1
  readonly falseRejectionRate: number; // 0-1
  readonly templateSize: number; // bytes
  readonly matchingSpeed: number; // ms
  readonly livenesDetection: boolean;
  readonly spoofingResistance: number; // 0-1
}

export interface HealthMonitoring {
  readonly vitalSigns: VitalSign[];
  readonly continuousMonitoring: boolean;
  readonly alertThresholds: HealthThreshold[];
  readonly medicalGradeAccuracy: boolean;
  readonly regulatoryCompliance: string[]; // FDA, CE, etc.
  readonly privacyProtection: HealthPrivacyConfig;
  readonly emergencyResponse: EmergencyConfig;
}

export interface VitalSign {
  readonly type: 'heart-rate' | 'blood-pressure' | 'temperature' | 'oxygen-saturation' | 'respiratory-rate' | 'glucose' | 'stress-level';
  readonly value: number;
  readonly unit: string;
  readonly normalRange: { min: number; max: number };
  readonly reliability: number; // 0-1
  readonly measurementMethod: string;
  readonly calibrationRequired: boolean;
}

export interface HealthThreshold {
  readonly vitalSign: string;
  readonly warningLevel: number;
  readonly criticalLevel: number;
  readonly alertDelay: number; // seconds
  readonly escalationProtocol: string[];
  readonly contactList: string[];
  readonly automaticEmergencyCall: boolean;
}

export interface HealthPrivacyConfig {
  readonly dataEncryption: boolean;
  readonly localProcessingOnly: boolean;
  readonly anonymization: boolean;
  readonly consentManagement: boolean;
  readonly dataRetentionDays: number;
  readonly shareWithHealthcare: boolean;
  readonly complianceFramework: string[]; // HIPAA, GDPR, etc.
}

export interface EmergencyConfig {
  readonly enabled: boolean;
  readonly emergencyContacts: string[];
  readonly emergencyServices: boolean;
  readonly locationSharing: boolean;
  readonly medicalInformation: boolean;
  readonly voiceActivation: boolean;
  readonly automaticDetection: boolean;
}

// ==================== REFERENCE-BASED HEAVY DATA ====================

export interface HeavyAdvancedDataRef {
  readonly dataType: 'ml-models' | 'quantum-states' | 'neuromorphic-weights' | 'simulation-data' | 'biometric-templates' | 'edge-processing-logs';
  readonly refId: string;
  readonly sizeEstimateMB: number;
  readonly lastUpdated: TimestampISO;
  readonly accessUrl?: string; // For lazy loading
  readonly securityLevel: 'public' | 'internal' | 'confidential' | 'top-secret';
  readonly specializedHardware?: ComputeResource[];
  readonly processingRequirements: ResourceRequirement;
}

// ==================== API RESPONSE TYPES ====================

export interface EdgeComputingStatus {
  readonly nodeId: string;
  readonly status: 'active' | 'idle' | 'overloaded' | 'maintenance' | 'error';
  readonly resourceUtilization: Record<ComputeResource, number>; // 0-1
  readonly activeTasks: ProcessingStage[];
  readonly queuedTasks: number;
  readonly averageLatency: number; // ms
  readonly energyEfficiency: number; // tasks per watt
  readonly lastHealthCheck: TimestampISO;
}

export interface MLModelStatus {
  readonly modelId: string;
  readonly status: 'training' | 'deployed' | 'updating' | 'error' | 'deprecated';
  readonly accuracy: number; // 0-1
  readonly inferenceLatency: number; // ms
  readonly throughput: number; // inferences per second
  readonly resourceUsage: ResourceRequirement;
  readonly lastTraining: TimestampISO;
  readonly nextRetraining: TimestampISO;
  readonly performanceDrift: number; // percentage
}

export interface AdvancedSensorCapabilities {
  readonly sensorId: SensorId;
  readonly edgeComputing: EdgeComputingConfig;
  readonly mlCapabilities: MLModelConfig[];
  readonly sensorFusion: SensorFusion;
  readonly adaptiveSampling: AdaptiveSampling;
  readonly digitalTwin?: DigitalTwin;
  readonly quantumFeatures?: QuantumSensor;
  readonly neuromorphicProcessing?: NeuromorphicProcessor;
  readonly biometricCapabilities?: BiometricSensor;
  readonly healthMonitoring?: HealthMonitoring;
  readonly heavyDataRefs: HeavyAdvancedDataRef[];
}

export interface QuantumComputingResponse {
  readonly quantumProcessors: QuantumSensor[];
  readonly availableAlgorithms: QuantumProcessing[];
  readonly coherenceMetrics: Record<string, number>;
  readonly quantumAdvantageAchieved: boolean;
  readonly classicalBenchmark: number;
  readonly quantumSpeedup: number;
  readonly errorRates: Record<string, number>;
}

export interface NeuromorphicResponse {
  readonly processors: NeuromorphicProcessor[];
  readonly networkConfigurations: SpikingNeuralNetwork[];
  readonly learningProgress: Record<string, number>;
  readonly energyEfficiency: number; // operations per joule
  readonly adaptationRate: number;
  readonly memoryUtilization: number; // 0-1
}

// ==================== EXPORTS ====================

export type {
  // Edge computing
  EdgeProcessingType, ComputeResource, EdgeComputingConfig, ProcessingStage, 
  ResourceRequirement, ResourceAllocation, LoadBalancingConfig, FailoverStrategy, DataRetentionPolicy,
  
  // AI/ML capabilities
  MLModelType, MLFramework, OptimizationTarget, MLModelConfig, FeatureDefinition,
  FederatedLearningConfig, PrivacyConfig, IncentiveConfig, AutoMLConfig,
  
  // Advanced sensor features
  SensorFusion, AdaptiveSampling, DigitalTwin, SimulationScenario, PredictiveCapability, RiskAssessment,
  
  // Quantum sensing
  QuantumSensor, QuantumProcessing,
  
  // Neuromorphic computing
  NeuromorphicProcessor, SpikingNeuralNetwork, NetworkTopology,
  
  // Biometric & health
  BiometricSensor, HealthMonitoring, VitalSign, HealthThreshold, HealthPrivacyConfig, EmergencyConfig,
  
  // References
  HeavyAdvancedDataRef,
  
  // API responses
  EdgeComputingStatus, MLModelStatus, AdvancedSensorCapabilities, QuantumComputingResponse, NeuromorphicResponse
}; 