/**
 * @fileoverview Enterprise PBAC Engine - Policy-Based Access Control
 */

import { EventEmitter } from 'events';
import { 
  PBACPolicy, 
  PBACRequest, 
  PBACResponse, 
  AccessDecision, 
  PolicyEffect,
  UserId,
  PolicyId,
  ISOTimestamp 
} from './types';

interface PBACConfig {
  enabled: boolean;
  defaultDecision: AccessDecision;
  policyEngine: 'simple' | 'xacml' | 'opa';
  evaluationCache: {
    enabled: boolean;
    ttl: number;
  };
}

interface EvaluationContext {
  subject: any;
  resource: any;
  action: any;
  environment: any;
}

export class PBACEngine extends EventEmitter {
  private static instance: PBACEngine;
  private config: PBACConfig;
  private policies = new Map<PolicyId, PBACPolicy>();
  private cache = new Map<string, { decision: AccessDecision; expiresAt: number }>();

  private constructor(config: PBACConfig) {
    super();
    this.config = config;
    setInterval(() => this.cleanupCache(), 60000);
  }

  static getInstance(config?: PBACConfig): PBACEngine {
    if (!PBACEngine.instance) {
      if (!config) throw new Error('PBACEngine requires configuration');
      PBACEngine.instance = new PBACEngine(config);
    }
    return PBACEngine.instance;
  }

  async evaluate(request: PBACRequest): Promise<PBACResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache
    if (this.config.evaluationCache.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return this.createResponse(request, cached.decision, [], startTime);
      }
    }

    const context = this.buildContext(request);
    const applicablePolicies = this.findApplicablePolicies(context);
    const decision = this.evaluatePolicies(applicablePolicies, context);

    // Cache result
    if (this.config.evaluationCache.enabled) {
      this.cache.set(cacheKey, {
        decision,
        expiresAt: Date.now() + this.config.evaluationCache.ttl * 1000
      });
    }

    this.emit('evaluation-completed', { requestId: request.requestId, decision });
    return this.createResponse(request, decision, applicablePolicies.map(p => p.policyId), startTime);
  }

  addPolicy(policy: PBACPolicy): void {
    this.policies.set(policy.policyId, policy);
    this.emit('policy-added', { policyId: policy.policyId });
  }

  removePolicy(policyId: PolicyId): void {
    this.policies.delete(policyId);
    this.emit('policy-removed', { policyId });
  }

  getPolicy(policyId: PolicyId): PBACPolicy | undefined {
    return this.policies.get(policyId);
  }

  listPolicies(): PBACPolicy[] {
    return Array.from(this.policies.values());
  }

  private buildContext(request: PBACRequest): EvaluationContext {
    return {
      subject: request.subject,
      resource: request.resource,
      action: request.action,
      environment: request.environment
    };
  }

  private findApplicablePolicies(context: EvaluationContext): PBACPolicy[] {
    return Array.from(this.policies.values()).filter(policy => 
      policy.status === 'active' && this.isPolicyApplicable(policy, context)
    );
  }

  private isPolicyApplicable(policy: PBACPolicy, context: EvaluationContext): boolean {
    const target = policy.target;
    
    // Check subject match
    if (target.subject.users && !target.subject.users.includes(context.subject.userId)) {
      return false;
    }

    // Check resource match
    if (target.resource.types && !target.resource.types.includes(context.resource.type)) {
      return false;
    }

    // Check action match
    if (target.action.operations && !target.action.operations.includes(context.action.operation)) {
      return false;
    }

    return true;
  }

  private evaluatePolicies(policies: PBACPolicy[], context: EvaluationContext): AccessDecision {
    let hasPermit = false;
    let hasDeny = false;

    for (const policy of policies.sort((a, b) => b.metadata.priority - a.metadata.priority)) {
      const result = this.evaluatePolicy(policy, context);
      
      if (result === PolicyEffect.DENY) {
        hasDeny = true;
        break; // Deny overrides
      } else if (result === PolicyEffect.ALLOW) {
        hasPermit = true;
      }
    }

    if (hasDeny) return AccessDecision.DENY;
    if (hasPermit) return AccessDecision.PERMIT;
    return this.config.defaultDecision;
  }

  private evaluatePolicy(policy: PBACPolicy, context: EvaluationContext): PolicyEffect | null {
    // Evaluate conditions
    for (const condition of policy.conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return null; // Condition not met
      }
    }

    // Evaluate rules
    for (const rule of policy.rules) {
      if (this.evaluateRule(rule, context)) {
        return rule.effect;
      }
    }

    return policy.effect;
  }

  private evaluateCondition(condition: any, context: EvaluationContext): boolean {
    switch (condition.type) {
      case 'time':
        return this.evaluateTimeCondition(condition, context);
      case 'location':
        return this.evaluateLocationCondition(condition, context);
      case 'risk':
        return this.evaluateRiskCondition(condition, context);
      default:
        return true;
    }
  }

  private evaluateTimeCondition(condition: any, context: EvaluationContext): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (condition.parameters.allowedHours && !condition.parameters.allowedHours.includes(hour)) {
      return false;
    }
    
    if (condition.parameters.allowedDays && !condition.parameters.allowedDays.includes(day)) {
      return false;
    }
    
    return true;
  }

  private evaluateLocationCondition(condition: any, context: EvaluationContext): boolean {
    const userCountry = context.environment.network?.geoLocation?.country;
    
    if (condition.parameters.allowedCountries && 
        !condition.parameters.allowedCountries.includes(userCountry)) {
      return false;
    }
    
    return true;
  }

  private evaluateRiskCondition(condition: any, context: EvaluationContext): boolean {
    const riskScore = context.environment.riskScore || 0;
    const maxRisk = condition.parameters.maxRiskScore || 100;
    
    return riskScore <= maxRisk;
  }

  private evaluateRule(rule: any, context: EvaluationContext): boolean {
    // Simple expression evaluation
    return true; // Simplified for lean implementation
  }

  private createResponse(
    request: PBACRequest, 
    decision: AccessDecision, 
    appliedPolicies: PolicyId[], 
    startTime: number
  ): PBACResponse {
    return {
      requestId: request.requestId,
      decision,
      appliedPolicies,
      evaluation: {
        duration: Date.now() - startTime,
        policyCount: appliedPolicies.length,
        ruleCount: 0
      },
      timestamp: new Date().toISOString() as ISOTimestamp
    };
  }

  private generateCacheKey(request: PBACRequest): string {
    return `${request.subject.userId}:${request.resource.type}:${request.action.operation}`;
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }
}

export const createPBACEngine = (config: Partial<PBACConfig> = {}): PBACEngine => {
  const defaultConfig: PBACConfig = {
    enabled: true,
    defaultDecision: AccessDecision.DENY,
    policyEngine: 'simple',
    evaluationCache: {
      enabled: true,
      ttl: 300
    },
    ...config
  };

  return PBACEngine.getInstance(defaultConfig);
};