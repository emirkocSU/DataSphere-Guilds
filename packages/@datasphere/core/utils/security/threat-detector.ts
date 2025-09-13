/**
 * @fileoverview Real-Time Threat Detection Engine
 */

import { EventEmitter } from 'events';
import { SecurityEvent, ThreatSignature, DetectionRule, SecurityIncident, ThreatIntelligence } from './types';

export class ThreatDetector extends EventEmitter {
  private static instance: ThreatDetector;
  private rules = new Map<string, DetectionRule>();
  private signatures = new Map<string, ThreatSignature>();
  private incidents = new Map<string, SecurityIncident>();
  private eventBuffer: SecurityEvent[] = [];
  private threatIntel: ThreatIntelligence;

  private constructor() {
    super();
    this.threatIntel = { indicators: [], signatures: [], feeds: [], lastUpdated: new Date().toISOString() };
    this.initializeDefaultRules();
    this.startEventProcessor();
  }

  static getInstance(): ThreatDetector {
    if (!ThreatDetector.instance) {
      ThreatDetector.instance = new ThreatDetector();
    }
    return ThreatDetector.instance;
  }

  async processEvent(event: SecurityEvent): Promise<void> {
    this.eventBuffer.push(event);
    
    // Calculate risk score
    event.riskScore = this.calculateRiskScore(event);
    
    // Check against rules
    const triggeredRules = await this.evaluateRules(event);
    
    // Check against threat intelligence
    const threats = await this.checkThreatIntelligence(event);
    
    if (triggeredRules.length > 0 || threats.length > 0) {
      await this.createIncident(event, triggeredRules, threats);
    }

    this.emit('event-processed', event);
  }

  addRule(rule: DetectionRule): void {
    this.rules.set(rule.id, rule);
    this.emit('rule-added', rule);
  }

  addSignature(signature: ThreatSignature): void {
    this.signatures.set(signature.id, signature);
    this.emit('signature-added', signature);
  }

  async analyzePattern(events: SecurityEvent[]): Promise<any> {
    const patterns = {
      bruteForce: this.detectBruteForce(events),
      anomalousAccess: this.detectAnomalousAccess(events),
      dataExfiltration: this.detectDataExfiltration(events),
      lateralMovement: this.detectLateralMovement(events)
    };

    return patterns;
  }

  getIncidents(): SecurityIncident[] {
    return Array.from(this.incidents.values());
  }

  private async evaluateRules(event: SecurityEvent): Promise<DetectionRule[]> {
    const triggered: DetectionRule[] = [];
    
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;
      
      if (await this.evaluateRule(rule, event)) {
        triggered.push(rule);
      }
    }
    
    return triggered;
  }

  private async evaluateRule(rule: DetectionRule, event: SecurityEvent): Promise<boolean> {
    // Simple rule evaluation
    if (rule.condition.includes('severity')) {
      return event.severity === 'high' || event.severity === 'critical';
    }
    
    if (rule.condition.includes('failed_login')) {
      return event.type === 'login' && event.result === 'failure';
    }
    
    if (rule.condition.includes('admin_access')) {
      return event.action.includes('admin') || event.target.classification === 'restricted';
    }
    
    return false;
  }

  private async checkThreatIntelligence(event: SecurityEvent): Promise<ThreatSignature[]> {
    const matches: ThreatSignature[] = [];
    
    for (const signature of this.signatures.values()) {
      if (!signature.active) continue;
      
      if (this.matchesSignature(event, signature)) {
        matches.push(signature);
      }
    }
    
    return matches;
  }

  private matchesSignature(event: SecurityEvent, signature: ThreatSignature): boolean {
    for (const indicator of signature.indicators) {
      if (indicator.type === 'ip' && event.source.ip === indicator.value) {
        return true;
      }
      
      if (indicator.type === 'pattern' && event.action.includes(indicator.value)) {
        return true;
      }
    }
    
    return false;
  }

  private async createIncident(
    event: SecurityEvent,
    rules: DetectionRule[],
    threats: ThreatSignature[]
  ): Promise<void> {
    const incidentId = `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const maxSeverity = this.getMaxSeverity([...rules, ...threats]);
    
    const incident: SecurityIncident = {
      id: incidentId,
      title: `Security Incident - ${event.type}`,
      description: `Detected ${rules.length} rule violations and ${threats.length} threat matches`,
      severity: maxSeverity,
      status: 'open',
      category: event.type,
      events: [event],
      timeline: [{
        timestamp: new Date().toISOString(),
        action: 'Incident Created',
        actor: 'system',
        details: 'Automated detection',
        automated: true
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impact: {
        scope: 'single_user',
        affectedUsers: 1,
        affectedSystems: [event.target.id],
        estimatedCost: 0,
        dataCompromised: false
      },
      response: {
        actions: [],
        evidence: [],
        recommendations: [],
        lessonsLearned: []
      }
    };

    this.incidents.set(incidentId, incident);
    this.emit('incident-created', incident);
  }

  private calculateRiskScore(event: SecurityEvent): number {
    let score = 0;
    
    // Base score by severity
    switch (event.severity) {
      case 'low': score += 20; break;
      case 'medium': score += 40; break;
      case 'high': score += 60; break;
      case 'critical': score += 80; break;
    }
    
    // Additional factors
    if (event.result === 'failure') score += 10;
    if (event.target.classification === 'restricted') score += 20;
    if (event.source.type === 'external') score += 15;
    
    return Math.min(100, score);
  }

  private getMaxSeverity(items: Array<{ severity: string }>): 'low' | 'medium' | 'high' | 'critical' {
    const severities = items.map(item => item.severity);
    if (severities.includes('critical')) return 'critical';
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  }

  private detectBruteForce(events: SecurityEvent[]): any {
    const loginFailures = events.filter(e => e.type === 'login' && e.result === 'failure');
    const threshold = 5;
    const timeWindow = 300000; // 5 minutes
    
    const recentFailures = loginFailures.filter(e => 
      Date.now() - new Date(e.timestamp).getTime() < timeWindow
    );
    
    return {
      detected: recentFailures.length >= threshold,
      count: recentFailures.length,
      threshold
    };
  }

  private detectAnomalousAccess(events: SecurityEvent[]): any {
    const accessEvents = events.filter(e => e.type === 'access');
    const unusualHours = accessEvents.filter(e => {
      const hour = new Date(e.timestamp).getHours();
      return hour < 6 || hour > 22;
    });
    
    return {
      detected: unusualHours.length > 0,
      count: unusualHours.length,
      events: unusualHours
    };
  }

  private detectDataExfiltration(events: SecurityEvent[]): any {
    const dataEvents = events.filter(e => e.type === 'data_access');
    const largeTransfers = dataEvents.filter(e => 
      (e.metadata.size as number) > 1000000 // 1MB
    );
    
    return {
      detected: largeTransfers.length > 0,
      count: largeTransfers.length,
      totalSize: largeTransfers.reduce((sum, e) => sum + (e.metadata.size as number || 0), 0)
    };
  }

  private detectLateralMovement(events: SecurityEvent[]): any {
    const systemEvents = events.filter(e => e.type === 'system');
    const crossSystemAccess = systemEvents.filter(e => 
      e.source.type === 'system' && e.target.type === 'resource'
    );
    
    return {
      detected: crossSystemAccess.length > 2,
      count: crossSystemAccess.length,
      systems: [...new Set(crossSystemAccess.map(e => e.target.id))]
    };
  }

  private initializeDefaultRules(): void {
    const defaultRules: DetectionRule[] = [
      {
        id: 'brute_force_detection',
        name: 'Brute Force Detection',
        description: 'Detects multiple failed login attempts',
        category: 'authentication',
        severity: 'high',
        condition: 'failed_login >= 5',
        enabled: true,
        threshold: 5,
        timeWindow: 300000,
        actions: [{ type: 'alert', config: {}, enabled: true }],
        suppressions: [],
        metadata: {}
      },
      {
        id: 'admin_access_monitoring',
        name: 'Admin Access Monitoring',
        description: 'Monitors administrative access',
        category: 'access_control',
        severity: 'medium',
        condition: 'admin_access',
        enabled: true,
        threshold: 1,
        timeWindow: 0,
        actions: [{ type: 'log', config: {}, enabled: true }],
        suppressions: [],
        metadata: {}
      }
    ];

    defaultRules.forEach(rule => this.addRule(rule));
  }

  private startEventProcessor(): void {
    setInterval(() => {
      if (this.eventBuffer.length > 100) {
        this.eventBuffer = this.eventBuffer.slice(-100);
      }
    }, 60000);
  }
}

export const createThreatDetector = (): ThreatDetector => {
  return ThreatDetector.getInstance();
};