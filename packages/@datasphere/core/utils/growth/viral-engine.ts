/**
 * @fileoverview Viral Engine
 */

import { EventEmitter } from 'events';
import { ViralLoop, ReferralSystem, UserId, ReferralId, ViralMetrics } from './types';

export class ViralEngine extends EventEmitter {
  private static instance: ViralEngine;
  private loops = new Map<string, ViralLoop>();
  private referrals = new Map<ReferralId, ReferralSystem>();
  private metrics: ViralMetrics;

  private constructor() {
    super();
    this.metrics = {
      shares: 0,
      clicks: 0,
      conversions: 0,
      viralCoefficient: 0,
      cycleTime: 0
    };
  }

  static getInstance(): ViralEngine {
    if (!ViralEngine.instance) {
      ViralEngine.instance = new ViralEngine();
    }
    return ViralEngine.instance;
  }

  createReferral(userId: UserId): ReferralSystem {
    const id = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const code = this.generateReferralCode();
    
    const referral: ReferralSystem = {
      id,
      userId,
      code,
      type: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      rewards: [],
      metrics: {
        totalReferrals: 0,
        successfulReferrals: 0,
        conversionRate: 0,
        totalRewards: 0,
        revenue: 0,
        lifetime: 0
      }
    };

    this.referrals.set(id, referral);
    this.emit('referral-created', referral);
    return referral;
  }

  async processReferral(code: string, newUserId: UserId): Promise<boolean> {
    const referral = this.findReferralByCode(code);
    if (!referral || referral.status !== 'active') return false;

    referral.metrics.totalReferrals++;
    
    // Process rewards
    for (const reward of referral.rewards) {
      if (this.checkRewardConditions(reward, newUserId)) {
        await this.grantReward(referral.userId, newUserId, reward);
        referral.metrics.successfulReferrals++;
      }
    }

    this.updateViralMetrics();
    this.emit('referral-processed', { referral, newUserId });
    return true;
  }

  addViralLoop(loop: ViralLoop): void {
    this.loops.set(loop.id, loop);
    this.emit('loop-added', loop);
  }

  async triggerViralLoop(loopId: string, userId: UserId, context: Record<string, unknown>): Promise<void> {
    const loop = this.loops.get(loopId);
    if (!loop?.isActive) return;

    if (this.shouldTrigger(loop, userId, context)) {
      await this.executeViralLoop(loop, userId, context);
      loop.metrics.shares++;
      this.emit('loop-triggered', { loop, userId });
    }
  }

  getViralCoefficient(): number {
    return this.metrics.viralCoefficient;
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private findReferralByCode(code: string): ReferralSystem | undefined {
    for (const referral of this.referrals.values()) {
      if (referral.code === code) return referral;
    }
    return undefined;
  }

  private checkRewardConditions(reward: any, userId: UserId): boolean {
    // Simple condition check
    return true;
  }

  private async grantReward(referrerId: UserId, refereeId: UserId, reward: any): Promise<void> {
    this.emit('reward-granted', { referrerId, refereeId, reward });
  }

  private shouldTrigger(loop: ViralLoop, userId: UserId, context: Record<string, unknown>): boolean {
    return loop.trigger.event in context;
  }

  private async executeViralLoop(loop: ViralLoop, userId: UserId, context: Record<string, unknown>): Promise<void> {
    // Execute viral mechanics
    this.emit('loop-executed', { loop, userId, context });
  }

  private updateViralMetrics(): void {
    const totalShares = Array.from(this.loops.values()).reduce((sum, loop) => sum + loop.metrics.shares, 0);
    const totalConversions = Array.from(this.referrals.values()).reduce((sum, ref) => sum + ref.metrics.successfulReferrals, 0);
    
    this.metrics.viralCoefficient = totalShares > 0 ? totalConversions / totalShares : 0;
  }
}

export const createViralEngine = (): ViralEngine => {
  return ViralEngine.getInstance();
};