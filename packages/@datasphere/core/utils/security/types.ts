/**
 * @fileoverview Security Monitoring & Threat Detection Types
 */

export type ThreatId = string;
export type IncidentId = string;
export type RuleId = string;
export type AlertId = string;
export type ISOTimestamp = string;

export interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'data_access' | 'network' | 'system' | 'application';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: ISOTimestamp;
  source: EventSource;
  target: EventTarget;
  action: string;
  result: 'success' | 'failure' | 'blocked';
  metadata: Record<string, unknown>;
  riskScore: number;
  correlationId: string;
}

export interface EventSource {
  type: 'user' | 'system' | 'application' | 'network' | 'external';
  id: string;
  name: string;
  ip?: string;
  userAgent?: string;
  location?: GeoLocation;
}

export interface EventTarget {
  type: 'resource' | 'endpoint' | 'file' | 'database' | 'service';
  id: string;
  name: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ThreatSignature {
  id: string;
  name: string;
  description: string;
  category: 'malware' | 'phishing' | 'bruteforce' | 'dos' | 'injection' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: ThreatIndicator[];
  active: boolean;
  confidence: number;
}

export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'pattern' | 'behavior';
  value: string;
  weight: number;
  source: string;
  lastSeen: ISOTimestamp;
}

export interface DetectionRule {
  id: RuleId;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  condition: string;
  enabled: boolean;
  threshold: number;
  timeWindow: number;
  actions: RuleAction[];
  suppressions: RuleSuppression[];
  metadata: Record<string, unknown>;
}

export interface RuleAction {
  type: 'alert' | 'block' | 'quarantine' | 'notify' | 'log';
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface RuleSuppression {
  field: string;
  value: string;
  duration: number;
  reason: string;
}

export interface SecurityIncident {
  id: IncidentId;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: string;
  events: SecurityEvent[];
  timeline: IncidentTimeline[];
  assignedTo?: string;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  resolvedAt?: ISOTimestamp;
  impact: IncidentImpact;
  response: IncidentResponse;
}

export interface IncidentTimeline {
  timestamp: ISOTimestamp;
  action: string;
  actor: string;
  details: string;
  automated: boolean;
}

export interface IncidentImpact {
  scope: 'single_user' | 'multiple_users' | 'service' | 'organization';
  affectedUsers: number;
  affectedSystems: string[];
  estimatedCost: number;
  dataCompromised: boolean;
}

export interface IncidentResponse {
  actions: ResponseAction[];
  evidence: Evidence[];
  recommendations: string[];
  lessonsLearned: string[];
}

export interface ResponseAction {
  type: 'isolate' | 'block' | 'reset' | 'notify' | 'investigate' | 'remediate';
  description: string;
  executedAt: ISOTimestamp;
  executedBy: string;
  result: 'success' | 'failure' | 'partial';
  automated: boolean;
}

export interface Evidence {
  type: 'log' | 'network' | 'file' | 'memory' | 'registry' | 'database';
  source: string;
  data: string;
  hash: string;
  collectedAt: ISOTimestamp;
  collectedBy: string;
}

export interface Vulnerability {
  id: string;
  cve?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss: number;
  category: string;
  affectedSystems: string[];
  discoveredAt: ISOTimestamp;
  status: 'open' | 'investigating' | 'patched' | 'accepted' | 'closed';
  remediation: string;
  patchAvailable: boolean;
  exploitable: boolean;
}

export interface SecurityMetrics {
  totalEvents: number;
  threatsDetected: number;
  incidentsCreated: number;
  incidentsResolved: number;
  vulnerabilitiesFound: number;
  vulnerabilitiesFixed: number;
  meanTimeToDetect: number;
  meanTimeToResolve: number;
  falsePositiveRate: number;
  riskScore: number;
  complianceScore: number;
}

export interface ThreatIntelligence {
  indicators: ThreatIndicator[];
  signatures: ThreatSignature[];
  feeds: ThreatFeed[];
  lastUpdated: ISOTimestamp;
}

export interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  type: 'commercial' | 'open_source' | 'government' | 'private';
  enabled: boolean;
  lastSync: ISOTimestamp;
  indicatorCount: number;
  reliability: number;
}