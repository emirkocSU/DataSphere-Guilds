/**
 * @fileoverview QC Pipeline Unified Result Aggregation - Enterprise Decision Engine
 * Ultra-lean result system for 5-layer quality control evidence and rationale
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { QCLayer } from './enums';
import { DeviceValidationResult } from './on-device.types';
import { AiValidationResult } from './ai-validation.types';
import { PeerReview } from './peer-review.types';
import { GoldStandardResult } from './gold-standard.types';
import { HoneypotResult } from './honeypot.types';

export enum QCDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
  ESCALATED = 'escalated',
  FLAGGED_FOR_REVIEW = 'flagged_for_review'
}

export interface UnifiedQCResult {
  readonly resultId: UUID;
  readonly submissionId: UUID;
  readonly pipelineId: UUID;
  readonly finalDecision: QCDecision;
  readonly confidence: ConfidenceMetrics;
  readonly layerResults: QCLayerResultsMap;
  readonly aggregationStrategy: AggregationStrategy;
  readonly timeline: QCProcessTimeline;
  readonly evidenceChain: EvidenceChain;
  readonly decisionRationale: DecisionRationale;
  readonly appealEligibility: AppealEligibility;
  readonly qualityScore: number;
  readonly riskAssessment: RiskAssessment;
}

export interface ConfidenceMetrics {
  readonly score: number;
  readonly level: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  readonly variance: number;
  readonly stability: number;
  readonly calculationMethod: ConfidenceCalculation;
  readonly factors: ConfidenceFactor[];
}

export interface ConfidenceCalculation {
  readonly method: 'WEIGHTED' | 'BAYESIAN' | 'CONSENSUS' | 'STATISTICAL';
  readonly weights: Record<QCLayer, number>;
  readonly parameters: Record<string, number>;
  readonly calibrated: boolean;
}

export interface ConfidenceFactor {
  readonly factor: string;
  readonly impact: number;
  readonly direction: 'POSITIVE' | 'NEGATIVE';
  readonly source: QCLayer;
}

export interface QCLayerResultsMap {
  readonly onDevice?: DeviceValidationResult;
  readonly aiValidation?: AiValidationResult;
  readonly peerReview?: PeerReview[];
  readonly goldStandard?: GoldStandardResult;
  readonly honeypot?: HoneypotResult;
}

export interface QCLayerResult {
  readonly layer: QCLayer;
  readonly status: 'PENDING' | 'PASSED' | 'FAILED' | 'SKIPPED';
  readonly confidence: number;
  readonly processingTimeMs: number;
  readonly cost: CostMetrics;
  readonly flags: QualityFlag[];
  readonly recommendations: Recommendation[];
  readonly metadata: Record<string, unknown>;
  readonly timestamp: ISOTimestamp;
}

export interface CostMetrics {
  readonly totalCost: number;
  readonly computeCost: number;
  readonly humanCost: number;
  readonly currency: string;
}

export interface QualityFlag {
  readonly flagId: UUID;
  readonly type: 'WARNING' | 'ERROR' | 'INFO';
  readonly severity: number;
  readonly message: string;
  readonly actionRequired: boolean;
}

export interface Recommendation {
  readonly recommendationId: UUID;
  readonly type: 'QUALITY' | 'PERFORMANCE' | 'COST' | 'SECURITY';
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly description: string;
  readonly implementation: string;
  readonly expectedImpact: number;
}

export interface AggregationStrategy {
  readonly type: 'WEIGHTED' | 'CONSENSUS' | 'EXPERT_OVERRIDE' | 'MAJORITY_VOTE';
  readonly parameters: Record<string, number>;
  readonly fallbackStrategy: string;
}

export interface QCProcessTimeline {
  readonly initiatedAt: ISOTimestamp;
  readonly completedAt: ISOTimestamp;
  readonly totalDurationMs: number;
  readonly layerTimings: Record<QCLayer, number>;
  readonly bottlenecks: BottleneckAnalysis[];
}

export interface BottleneckAnalysis {
  readonly layer: QCLayer;
  readonly delayMs: number;
  readonly cause: string;
  readonly impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface EvidenceChain {
  readonly chainId: UUID;
  readonly rootHash: string;
  readonly entries: Evidence[];
  readonly integrity: IntegrityCheck;
  readonly traceability: TraceabilityRecord[];
}

export interface Evidence {
  readonly evidenceId: UUID;
  readonly type: 'LOG' | 'METRIC' | 'TRACE' | 'SCREENSHOT' | 'DATA_SAMPLE';
  readonly content: string | Record<string, unknown>;
  readonly timestamp: ISOTimestamp;
  readonly source: QCLayer;
  readonly hash: string;
  readonly verified: boolean;
}

export interface IntegrityCheck {
  readonly verified: boolean;
  readonly method: 'CRYPTOGRAPHIC' | 'CHECKSUM' | 'DIGITAL_SIGNATURE';
  readonly algorithm: string;
  readonly timestamp: ISOTimestamp;
}

export interface TraceabilityRecord {
  readonly recordId: UUID;
  readonly operation: string;
  readonly actor: string;
  readonly timestamp: ISOTimestamp;
  readonly inputHash: string;
  readonly outputHash: string;
}

export interface DecisionRationale {
  readonly rationaleId: UUID;
  readonly reasonCode: string;
  readonly description: string;
  readonly contributingFactors: DecisionFactor[];
  readonly reasoning: ReasoningChain;
  readonly alternatives: AlternativeDecision[];
  readonly confidence: number;
}

export interface DecisionFactor {
  readonly factorId: UUID;
  readonly name: string;
  readonly weight: number;
  readonly value: number;
  readonly impact: number;
  readonly source: QCLayer;
  readonly justification: string;
}

export interface ReasoningChain {
  readonly steps: ReasoningStep[];
  readonly logic: 'DEDUCTIVE' | 'INDUCTIVE' | 'PROBABILISTIC';
  readonly coherence: number;
  readonly completeness: number;
}

export interface ReasoningStep {
  readonly stepId: UUID;
  readonly premise: string;
  readonly inference: string;
  readonly conclusion: string;
  readonly confidence: number;
}

export interface AlternativeDecision {
  readonly decision: QCDecision;
  readonly probability: number;
  readonly reasoning: string;
  readonly tradeoffs: string[];
}

export interface AppealEligibility {
  readonly eligible: boolean;
  readonly reasons: string[];
  readonly timeWindow: number;
  readonly requirements: AppealRequirement[];
  readonly process: AppealProcess;
}

export interface AppealRequirement {
  readonly type: 'EVIDENCE' | 'JUSTIFICATION' | 'PAYMENT';
  readonly description: string;
  readonly mandatory: boolean;
  readonly deadline: number;
}

export interface AppealProcess {
  readonly steps: string[];
  readonly estimatedDuration: number;
  readonly reviewers: ReviewerType[];
  readonly outcomes: string[];
}

export enum ReviewerType {
  AUTOMATED = 'automated',
  HUMAN = 'human',
  EXPERT = 'expert',
  PANEL = 'panel'
}

export interface RiskAssessment {
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly riskFactors: RiskFactor[];
  readonly riskScore: number;
  readonly mitigation: RiskMitigation[];
}

export interface RiskFactor {
  readonly factor: string;
  readonly weight: number;
  readonly value: number;
  readonly impact: 'POSITIVE' | 'NEGATIVE';
}

export interface RiskMitigation {
  readonly strategy: string;
  readonly effectiveness: number;
  readonly cost: number;
  readonly timeline: number;
}