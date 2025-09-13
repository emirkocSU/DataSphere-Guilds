/**
 * @fileoverview Partner Management System
 */

import { EventEmitter } from 'events';
import { Partner, PartnerId, PartnerAnalytics, OnboardingStatus, IntegrationId } from './types';

export class PartnerManager extends EventEmitter {
  private static instance: PartnerManager;
  private partners = new Map<PartnerId, Partner>();
  private analytics = new Map<PartnerId, PartnerAnalytics>();

  private constructor() {
    super();
  }

  static getInstance(): PartnerManager {
    if (!PartnerManager.instance) {
      PartnerManager.instance = new PartnerManager();
    }
    return PartnerManager.instance;
  }

  createPartner(config: Partial<Partner>): Partner {
    const partner: Partner = {
      id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name!,
      type: config.type!,
      status: config.status || 'pending',
      tier: config.tier || 'free',
      contact: config.contact!,
      agreement: config.agreement!,
      integrations: config.integrations || [],
      analytics: config.analytics || { totalRequests: 0, successRate: 0, averageResponseTime: 0, dataVolume: 0, revenue: 0, costSavings: 0, satisfactionScore: 0, integrationHealth: 0 },
      onboarding: config.onboarding || { stage: 'initiated', completedSteps: [], nextSteps: ['documentation'], assignedTo: 'system', notes: [] },
      createdAt: new Date().toISOString()
    };

    this.partners.set(partner.id, partner);
    this.emit('partner-created', partner);
    return partner;
  }

  updateOnboardingStatus(partnerId: PartnerId, status: Partial<OnboardingStatus>): boolean {
    const partner = this.partners.get(partnerId);
    if (!partner) return false;

    partner.onboarding = { ...partner.onboarding, ...status };
    
    if (status.stage === 'completed') {
      partner.status = 'active';
      partner.onboarding.completionDate = new Date().toISOString();
      this.emit('partner-onboarded', partner);
    }

    this.emit('partner-updated', partner);
    return true;
  }

  addIntegration(partnerId: PartnerId, integrationId: IntegrationId): boolean {
    const partner = this.partners.get(partnerId);
    if (!partner) return false;

    if (!partner.integrations.includes(integrationId)) {
      partner.integrations.push(integrationId);
      this.emit('partner-integration-added', { partnerId, integrationId });
    }

    return true;
  }

  updateAnalytics(partnerId: PartnerId, metrics: Partial<PartnerAnalytics>): void {
    const partner = this.partners.get(partnerId);
    if (!partner) return;

    partner.analytics = { ...partner.analytics, ...metrics };
    this.emit('partner-analytics-updated', { partnerId, analytics: partner.analytics });
  }

  getPartner(partnerId: PartnerId): Partner | undefined {
    return this.partners.get(partnerId);
  }

  getPartnersByType(type: string): Partner[] {
    return Array.from(this.partners.values()).filter(p => p.type === type);
  }

  getActivePartners(): Partner[] {
    return Array.from(this.partners.values()).filter(p => p.status === 'active');
  }

  generatePartnerReport(partnerId: PartnerId): any {
    const partner = this.partners.get(partnerId);
    if (!partner) return null;

    return {
      partner: {
        id: partner.id,
        name: partner.name,
        type: partner.type,
        status: partner.status,
        tier: partner.tier,
        createdAt: partner.createdAt
      },
      analytics: partner.analytics,
      integrations: {
        count: partner.integrations.length,
        active: partner.integrations.length // Simplified
      },
      onboarding: {
        stage: partner.onboarding.stage,
        progress: partner.onboarding.completedSteps.length,
        completion: partner.onboarding.completionDate
      },
      health: this.calculatePartnerHealth(partner),
      recommendations: this.generateRecommendations(partner)
    };
  }

  private calculatePartnerHealth(partner: Partner): number {
    const healthFactors = [
      partner.analytics.successRate,
      partner.analytics.integrationHealth,
      partner.status === 'active' ? 1 : 0,
      partner.analytics.satisfactionScore
    ];

    return healthFactors.reduce((sum, factor) => sum + factor, 0) / healthFactors.length;
  }

  private generateRecommendations(partner: Partner): string[] {
    const recommendations: string[] = [];

    if (partner.analytics.successRate < 0.9) {
      recommendations.push('Improve integration reliability');
    }

    if (partner.analytics.averageResponseTime > 5000) {
      recommendations.push('Optimize API response times');
    }

    if (partner.analytics.satisfactionScore < 0.8) {
      recommendations.push('Enhance partner support');
    }

    return recommendations;
  }
}

export const createPartnerManager = (): PartnerManager => {
  return PartnerManager.getInstance();
};