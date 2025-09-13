/**
 * @fileoverview QC Pipeline Appeals & Compliance Framework - Enterprise Dispute Resolution
 * Ultra-lean appeals system for 5-layer quality control dispute management and compliance
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';
import { UnifiedQCResult } from './results.types';
import { QCLayer } from './enums';

export interface QCAppealRequest {
  readonly appealId: UUID;
  readonly originalQcResult: UnifiedQCResult;
  readonly appealReason: string;
  readonly targetLayer?: QCLayer;
  readonly evidence: AppealEvidence[];
  readonly requestedReview: ReviewRequest;
  readonly submittedAt: ISOTimestamp;
  readonly priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  readonly status: AppealStatus;
  readonly history: AppealHistory[];
  readonly stakeholders: AppealStakeholder[];
  readonly timeline: AppealTimeline;
}

export enum AppealStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  EVIDENCE_GATHERING = 'evidence_gathering',
  EXPERT_REVIEW = 'expert_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface AppealEvidence {
  readonly evidenceId: UUID;
  readonly type: 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DATA' | 'WITNESS';
  readonly content: string;
  readonly description: string;
  readonly relevanceScore: number;
  readonly verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  readonly validationStatus: ValidationStatus;
  readonly submitterId: UUID;
  readonly hash: string;
  readonly metadata: EvidenceMetadata;
}

export interface ValidationStatus {
  readonly validated: boolean;
  readonly validatedBy: UUID;
  readonly validatedAt: ISOTimestamp;
  readonly validationMethod: 'AUTOMATED' | 'MANUAL' | 'HYBRID';
  readonly confidence: number;
}

export interface EvidenceMetadata {
  readonly fileSize: number;
  readonly mimeType: string;
  readonly checksum: string;
  readonly uploadedAt: ISOTimestamp;
  readonly source: string;
  readonly chain: AppealEvidenceChain;
}

export interface AppealEvidenceChain {
  readonly previousHash?: string;
  readonly blockNumber: number;
  readonly witnesses: UUID[];
  readonly signatures: DigitalSignature[];
}

export interface DigitalSignature {
  readonly signerId: UUID;
  readonly algorithm: string;
  readonly signature: string;
  readonly timestamp: ISOTimestamp;
}

export interface ReviewRequest {
  readonly reviewType: 'FULL_REPROCESS' | 'LAYER_SPECIFIC' | 'HUMAN_ONLY' | 'EXPEDITED';
  readonly requestedLayers?: QCLayer[];
  readonly specialInstructions?: string;
  readonly timelineRequirement?: number;
  readonly expertiseRequired: ExpertiseRequirement[];
  readonly jurisdiction: string;
}

export interface ExpertiseRequirement {
  readonly domain: string;
  readonly level: 'BASIC' | 'INTERMEDIATE' | 'EXPERT' | 'SPECIALIST';
  readonly certifications: string[];
  readonly experience: number;
}

export interface AppealDecision {
  readonly decisionId: UUID;
  readonly outcome: 'UPHELD' | 'OVERTURNED' | 'MODIFIED' | 'REMANDED';
  readonly rationale: string;
  readonly decidedAt: ISOTimestamp;
  readonly reviewerId: UUID;
  readonly impactAnalysis: ImpactAnalysis;
  readonly remediationSteps: RemediationStep[];
  readonly precedent: PrecedentValue;
}

export interface ImpactAnalysis {
  readonly scope: 'SINGLE' | 'BATCH' | 'SYSTEMIC' | 'POLICY';
  readonly affectedSubmissions: number;
  readonly financialImpact: number;
  readonly reputationalImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly operationalImpact: OperationalImpact;
  readonly futureImplications: string[];
}

export interface OperationalImpact {
  readonly processChanges: boolean;
  readonly trainingRequired: boolean;
  readonly systemUpdates: boolean;
  readonly policyRevisions: boolean;
  readonly estimatedEffort: number;
}

export interface RemediationStep {
  readonly stepId: UUID;
  readonly description: string;
  readonly assignee: UUID;
  readonly deadline: ISOTimestamp;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly dependencies: UUID[];
  readonly status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
}

export interface PrecedentValue {
  readonly establishes: boolean;
  readonly precedentType: 'PROCEDURAL' | 'INTERPRETIVE' | 'POLICY' | 'TECHNICAL';
  readonly applicability: 'NARROW' | 'BROAD' | 'UNIVERSAL';
  readonly documentation: string;
}

export interface AppealHistory {
  readonly entryId: UUID;
  readonly timestamp: ISOTimestamp;
  readonly actor: ActorInfo;
  readonly action: AppealAction;
  readonly details: string;
  readonly attachments: UUID[];
}

export interface ActorInfo {
  readonly actorId: UUID;
  readonly type: 'APPELLANT' | 'REVIEWER' | 'SYSTEM' | 'ADMINISTRATOR';
  readonly name: string;
  readonly role: string;
  readonly permissions: string[];
}

export interface AppealAction {
  readonly type: 'SUBMIT' | 'REVIEW' | 'EVIDENCE_ADD' | 'STATUS_CHANGE' | 'DECISION' | 'ESCALATE';
  readonly subType?: string;
  readonly impact: 'MINOR' | 'MAJOR' | 'CRITICAL';
  readonly reversible: boolean;
}

export interface AppealStakeholder {
  readonly stakeholderId: UUID;
  readonly role: StakeholderRole;
  readonly involvement: InvolvementLevel;
  readonly permissions: StakeholderPermission[];
  readonly notifications: NotificationPreference[];
  readonly delegation: DelegationConfig;
}

export enum StakeholderRole {
  APPELLANT = 'appellant',
  REVIEWER = 'reviewer',
  EXPERT = 'expert',
  ADMINISTRATOR = 'administrator',
  OBSERVER = 'observer',
  LEGAL_COUNSEL = 'legal_counsel'
}

export enum InvolvementLevel {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ADVISORY = 'advisory',
  OBSERVER = 'observer'
}

export enum StakeholderPermission {
  VIEW = 'view',
  COMMENT = 'comment',
  SUBMIT_EVIDENCE = 'submit_evidence',
  MAKE_DECISION = 'make_decision',
  ESCALATE = 'escalate',
  CLOSE = 'close',
  DELEGATE = 'delegate'
}

export interface NotificationPreference {
  readonly channel: 'EMAIL' | 'SMS' | 'PUSH' | 'DASHBOARD' | 'WEBHOOK';
  readonly events: AppealNotificationEvent[];
  readonly frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
  readonly template: string;
}

export enum AppealNotificationEvent {
  APPEAL_SUBMITTED = 'appeal_submitted',
  REVIEW_STARTED = 'review_started',
  EVIDENCE_REQUESTED = 'evidence_requested',
  DECISION_MADE = 'decision_made',
  ESCALATED = 'escalated',
  DEADLINE_APPROACHING = 'deadline_approaching'
}

export interface DelegationConfig {
  readonly canDelegate: boolean;
  readonly delegateTo: UUID[];
  readonly delegationRules: DelegationRule[];
  readonly temporaryDelegation: boolean;
}

export interface DelegationRule {
  readonly condition: string;
  readonly autoDelegate: boolean;
  readonly requiredApproval: boolean;
  readonly notificationRequired: boolean;
}

export interface AppealTimeline {
  readonly submissionDeadline: ISOTimestamp;
  readonly reviewDeadline: ISOTimestamp;
  readonly decisionDeadline: ISOTimestamp;
  readonly milestones: TimelineMilestone[];
  readonly extensions: TimelineExtension[];
}

export interface TimelineMilestone {
  readonly milestoneId: UUID;
  readonly name: string;
  readonly targetDate: ISOTimestamp;
  readonly actualDate?: ISOTimestamp;
  readonly status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  readonly dependencies: UUID[];
}

export interface TimelineExtension {
  readonly extensionId: UUID;
  readonly requestedBy: UUID;
  readonly reason: string;
  readonly duration: number;
  readonly approved: boolean;
  readonly approvedBy?: UUID;
}

export interface AuditTrail {
  readonly trailId: UUID;
  readonly appealId: UUID;
  readonly entries: AuditEntry[];
  readonly integrity: IntegrityVerification;
  readonly retention: RetentionPolicy;
  readonly compliance: ComplianceAlignment;
}

export interface AuditEntry {
  readonly entryId: UUID;
  readonly timestamp: ISOTimestamp;
  readonly actor: ActorInfo;
  readonly action: AuditableAction;
  readonly context: AuditContext;
  readonly outcome: AuditOutcome;
  readonly evidence: AuditEvidence;
}

export interface AuditableAction {
  readonly type: 'ACCESS' | 'MODIFY' | 'DELETE' | 'EXPORT' | 'APPROVE' | 'REJECT';
  readonly resource: string;
  readonly details: string;
  readonly risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly authorization: AuthorizationInfo;
}

export interface AuthorizationInfo {
  readonly method: 'PASSWORD' | 'MFA' | 'CERTIFICATE' | 'BIOMETRIC';
  readonly strength: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly verified: boolean;
  readonly session: SessionInfo;
}

export interface SessionInfo {
  readonly sessionId: UUID;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly location?: GeolocationInfo;
  readonly duration: number;
}

export interface GeolocationInfo {
  readonly country: string;
  readonly region: string;
  readonly city: string;
  readonly coordinates?: [number, number];
}

export interface AuditContext {
  readonly requestId: UUID;
  readonly correlationId: string;
  readonly businessContext: Record<string, unknown>;
  readonly technicalContext: Record<string, unknown>;
}

export interface AuditOutcome {
  readonly success: boolean;
  readonly result: string;
  readonly errors?: string[];
  readonly warnings?: string[];
  readonly duration: number;
}

export interface AuditEvidence {
  readonly screenshots?: string[];
  readonly logs?: string[];
  readonly traces?: string[];
  readonly signatures?: DigitalSignature[];
}

export interface IntegrityVerification {
  readonly method: 'HASH' | 'SIGNATURE' | 'BLOCKCHAIN' | 'TIMESTAMP';
  readonly algorithm: string;
  readonly verified: boolean;
  readonly lastCheck: ISOTimestamp;
  readonly certificate?: string;
}

export interface RetentionPolicy {
  readonly duration: number;
  readonly archiving: ArchivingPolicy;
  readonly deletion: DeletionPolicy;
  readonly legalHold: LegalHoldPolicy;
}

export interface ArchivingPolicy {
  readonly enabled: boolean;
  readonly trigger: number;
  readonly location: 'LOCAL' | 'CLOUD' | 'HYBRID';
  readonly compression: boolean;
  readonly encryption: boolean;
}

export interface DeletionPolicy {
  readonly automatic: boolean;
  readonly trigger: number;
  readonly secure: boolean;
  readonly verification: boolean;
  readonly approval: boolean;
}

export interface LegalHoldPolicy {
  readonly active: boolean;
  readonly reason: string;
  readonly authority: string;
  readonly expires?: ISOTimestamp;
  readonly override: boolean;
}

export interface ComplianceAlignment {
  readonly frameworks: ComplianceFramework[];
  readonly violations: ComplianceViolation[];
  readonly certifications: ComplianceCertification[];
  readonly assessments: ComplianceAssessment[];
}

export interface ComplianceFramework {
  readonly name: string;
  readonly version: string;
  readonly status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'PENDING';
  readonly score: number;
  readonly lastAssessment: ISOTimestamp;
  readonly requirements: FrameworkRequirement[];
}

export interface FrameworkRequirement {
  readonly requirementId: string;
  readonly description: string;
  readonly status: 'MET' | 'NOT_MET' | 'PARTIAL' | 'NA';
  readonly evidence: UUID[];
  readonly gaps: string[];
}

export interface ComplianceViolation {
  readonly violationId: UUID;
  readonly type: 'PROCEDURAL' | 'TECHNICAL' | 'ETHICAL' | 'REGULATORY';
  readonly severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  readonly description: string;
  readonly remediation: RemediationPlan;
  readonly reportable: boolean;
}

export interface RemediationPlan {
  readonly steps: RemediationStep[];
  readonly timeline: number;
  readonly responsible: UUID;
  readonly monitoring: MonitoringRequirement[];
  readonly verification: VerificationStep[];
}

export interface MonitoringRequirement {
  readonly metric: string;
  readonly frequency: number;
  readonly threshold: number;
  readonly alerting: boolean;
}

export interface VerificationStep {
  readonly stepId: UUID;
  readonly method: 'AUDIT' | 'TEST' | 'REVIEW' | 'INSPECTION';
  readonly criteria: string;
  readonly schedule: ISOTimestamp;
}

export interface ComplianceCertification {
  readonly name: string;
  readonly issuer: string;
  readonly validFrom: ISOTimestamp;
  readonly validUntil: ISOTimestamp;
  readonly scope: string[];
  readonly status: 'VALID' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';
}

export interface ComplianceAssessment {
  readonly assessmentId: UUID;
  readonly assessor: string;
  readonly date: ISOTimestamp;
  readonly scope: string[];
  readonly methodology: string;
  readonly findings: AssessmentFinding[];
  readonly recommendations: string[];
}

export interface AssessmentFinding {
  readonly type: 'STRENGTH' | 'WEAKNESS' | 'OPPORTUNITY' | 'THREAT';
  readonly description: string;
  readonly impact: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly recommendation: string;
  readonly priority: number;
}

export interface ComplianceRecord {
  readonly recordId: UUID;
  readonly appealId: UUID;
  readonly frameworks: ApplicableFramework[];
  readonly obligations: LegalObligation[];
  readonly risks: ComplianceRisk[];
  readonly controls: ComplianceControl[];
  readonly reporting: ComplianceReporting;
}

export interface ApplicableFramework {
  readonly framework: ComplianceFramework;
  readonly applicability: 'FULL' | 'PARTIAL' | 'CONDITIONAL';
  readonly exemptions: string[];
  readonly specialConditions: string[];
}

export interface LegalObligation {
  readonly obligationId: UUID;
  readonly type: 'DISCLOSURE' | 'NOTIFICATION' | 'REPORTING' | 'RETENTION' | 'DELETION';
  readonly description: string;
  readonly deadline: ISOTimestamp;
  readonly authority: string;
  readonly penalties: string[];
}

export interface ComplianceRisk {
  readonly riskId: UUID;
  readonly category: 'REGULATORY' | 'LEGAL' | 'FINANCIAL' | 'REPUTATIONAL';
  readonly level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly probability: number;
  readonly impact: number;
  readonly mitigation: RiskMitigation[];
}

export interface RiskMitigation {
  readonly strategy: string;
  readonly effectiveness: number;
  readonly cost: number;
  readonly timeline: number;
  readonly owner: UUID;
}

export interface ComplianceControl {
  readonly controlId: UUID;
  readonly type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
  readonly description: string;
  readonly effectiveness: number;
  readonly testing: ControlTesting;
  readonly automation: boolean;
}

export interface ControlTesting {
  readonly frequency: 'CONTINUOUS' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  readonly lastTested: ISOTimestamp;
  readonly nextTest: ISOTimestamp;
  readonly results: TestResult[];
}

export interface TestResult {
  readonly testId: UUID;
  readonly date: ISOTimestamp;
  readonly result: 'PASS' | 'FAIL' | 'PARTIAL';
  readonly findings: string[];
  readonly recommendations: string[];
}

export interface ComplianceReporting {
  readonly required: boolean;
  readonly frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  readonly recipients: string[];
  readonly format: 'STRUCTURED' | 'NARRATIVE' | 'MIXED';
  readonly templates: string[];
}