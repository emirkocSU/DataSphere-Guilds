/**
 * @fileoverview Growth Analytics
 */

import { EventEmitter } from 'events';
import { Cohort, ConversionFunnel, GrowthExperiment, GrowthMetrics, UserId } from './types';

export class GrowthAnalytics extends EventEmitter {
  private static instance: GrowthAnalytics;
  private cohorts = new Map<string, Cohort>();
  private funnels = new Map<string, ConversionFunnel>();
  private experiments = new Map<string, GrowthExperiment>();
  private metrics: GrowthMetrics;

  private constructor() {
    super();
    this.metrics = {
      userAcquisition: { total: 0, daily: 0, weekly: 0, monthly: 0, sources: {} },
      activation: { rate: 0, time: 0, dropoffs: {} },
      retention: { day1: 0, day7: 0, day30: 0 },
      revenue: { total: 0, recurring: 0, ltv: 0 },
      referral: { totalReferrals: 0, successfulReferrals: 0, conversionRate: 0, totalRewards: 0, revenue: 0, lifetime: 0 },
      viral: { shares: 0, clicks: 0, conversions: 0, viralCoefficient: 0, cycleTime: 0 }
    };
  }

  static getInstance(): GrowthAnalytics {
    if (!GrowthAnalytics.instance) {
      GrowthAnalytics.instance = new GrowthAnalytics();
    }
    return GrowthAnalytics.instance;
  }

  createCohort(definition: any): Cohort {
    const id = `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cohort: Cohort = {
      id,
      name: definition.name,
      definition,
      users: [],
      metrics: { size: 0, retention: {}, ltv: 0, revenue: 0, churn: 0 },
      retention: { periods: [], curve: [], prediction: [] },
      createdAt: new Date().toISOString()
    };

    this.cohorts.set(id, cohort);
    this.emit('cohort-created', cohort);
    return cohort;
  }

  createFunnel(name: string, steps: any[]): ConversionFunnel {
    const id = `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const funnel: ConversionFunnel = {
      id,
      name,
      steps,
      metrics: { totalUsers: 0, completions: 0, conversionRate: 0, dropoffRates: {}, averageTime: 0, revenue: 0 },
      segments: [],
      optimization: { recommendations: [], experiments: [], improvements: 0, priority: 'medium' }
    };

    this.funnels.set(id, funnel);
    this.emit('funnel-created', funnel);
    return funnel;
  }

  createExperiment(config: any): GrowthExperiment {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const experiment: GrowthExperiment = {
      id,
      name: config.name,
      hypothesis: config.hypothesis,
      type: config.type,
      status: 'draft',
      variants: config.variants || [],
      metrics: { totalUsers: 0, lift: 0, confidence: 0, revenue: 0, cost: 0, roi: 0 },
      duration: config.duration || 14,
      targetUsers: config.targetUsers || 1000,
      significance: config.significance || 0.95,
      createdAt: new Date().toISOString()
    };

    this.experiments.set(id, experiment);
    this.emit('experiment-created', experiment);
    return experiment;
  }

  async trackEvent(userId: UserId, event: string, data: Record<string, unknown>): Promise<void> {
    // Update cohort data
    for (const cohort of this.cohorts.values()) {
      if (this.userBelongsToCohort(userId, cohort)) {
        this.updateCohortMetrics(cohort, event, data);
      }
    }

    // Update funnel data
    for (const funnel of this.funnels.values()) {
      this.updateFunnelMetrics(funnel, userId, event, data);
    }

    this.emit('event-tracked', { userId, event, data });
  }

  calculateRetention(cohortId: string, periods: number[]): number[] {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) return [];

    return periods.map(period => {
      // Mock retention calculation
      return Math.max(0, 1 - (period * 0.1));
    });
  }

  getGrowthMetrics(): GrowthMetrics {
    return { ...this.metrics };
  }

  private userBelongsToCohort(userId: UserId, cohort: Cohort): boolean {
    return cohort.users.includes(userId);
  }

  private updateCohortMetrics(cohort: Cohort, event: string, data: Record<string, unknown>): void {
    // Update cohort metrics based on event
    this.emit('cohort-updated', cohort);
  }

  private updateFunnelMetrics(funnel: ConversionFunnel, userId: UserId, event: string, data: Record<string, unknown>): void {
    // Update funnel metrics based on event
    this.emit('funnel-updated', funnel);
  }
}

export const createGrowthAnalytics = (): GrowthAnalytics => {
  return GrowthAnalytics.getInstance();
};