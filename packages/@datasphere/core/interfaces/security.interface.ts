/**
 * @fileoverview Lean, high-performance security interfaces for unicorn-scale protection
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../types/common.types';

export interface ISecurityService {
  // Threat detection
  detectThreat(request: SecurityRequest): Promise<ThreatResult>;
  
  // Access control
  checkPermission(userId: UUID, resource: string, action: string): Promise<boolean>;
  
  // Audit logging
  logSecurityEvent(event: SecurityEvent): Promise<void>;
  
  // Risk assessment
  assessRisk(context: RiskContext): Promise<RiskScore>;
}

export interface SecurityRequest {
  userId?: UUID;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
  payload?: any;
}

export interface ThreatResult {
  isThreat: boolean;
  confidence: number;
  threatType?: 'sql_injection' | 'xss' | 'ddos' | 'brute_force';
  action: 'allow' | 'block' | 'monitor';
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'access_denied' | 'threat_detected';
  userId?: UUID;
  ipAddress: string;
  timestamp: Date;
  details: Record<string, any>;
}

export interface RiskContext {
  userId?: UUID;
  ipAddress: string;
  location?: GeoLocation;
  device?: DeviceInfo;
  behavior?: UserBehavior;
}

export interface RiskScore {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  weight: number;
  description: string;
}

export interface UserBehavior {
  loginFrequency: number;
  locationChanges: number;
  deviceChanges: number;
  suspiciousActivity: boolean;
}

export interface GeoLocation {
  country: string;
  region?: string;
  city?: string;
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  fingerprint: string;
}