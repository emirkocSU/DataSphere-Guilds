/**
 * @fileoverview User Segmentation Engine
 */

import { EventEmitter } from 'events';
import { Segment, SegmentCriteria, SegmentRule, UserProfile, UserId } from './types';

export class SegmentationEngine extends EventEmitter {
  private static instance: SegmentationEngine;
  private segments = new Map<string, Segment>();
  private userProfiles = new Map<UserId, UserProfile>();
  private segmentCache = new Map<string, UserId[]>();

  private constructor() {
    super();
    setInterval(() => this.refreshSegments(), 300000); // 5 minutes
  }

  static getInstance(): SegmentationEngine {
    if (!SegmentationEngine.instance) {
      SegmentationEngine.instance = new SegmentationEngine();
    }
    return SegmentationEngine.instance;
  }

  createSegment(segment: Omit<Segment, 'id' | 'userCount' | 'createdAt' | 'updatedAt'>): Segment {
    const id = `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSegment: Segment = {
      id,
      ...segment,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.segments.set(id, newSegment);
    this.refreshSegmentUsers(id);
    this.emit('segment-created', newSegment);
    
    return newSegment;
  }

  updateSegment(segmentId: string, updates: Partial<Segment>): void {
    const segment = this.segments.get(segmentId);
    if (!segment) return;

    Object.assign(segment, updates);
    segment.updatedAt = new Date().toISOString();
    
    this.refreshSegmentUsers(segmentId);
    this.emit('segment-updated', segment);
  }

  deleteSegment(segmentId: string): void {
    const segment = this.segments.get(segmentId);
    if (segment) {
      this.segments.delete(segmentId);
      this.segmentCache.delete(segmentId);
      this.emit('segment-deleted', segment);
    }
  }

  getUsersInSegment(segmentId: string): UserId[] {
    return this.segmentCache.get(segmentId) || [];
  }

  getUserSegments(userId: UserId): Segment[] {
    const userSegments: Segment[] = [];
    
    for (const [segmentId, users] of this.segmentCache) {
      if (users.includes(userId)) {
        const segment = this.segments.get(segmentId);
        if (segment) {
          userSegments.push(segment);
        }
      }
    }
    
    return userSegments;
  }

  evaluateUserForSegment(userId: UserId, segmentId: string): boolean {
    const segment = this.segments.get(segmentId);
    const user = this.userProfiles.get(userId);
    
    if (!segment || !user) return false;
    
    return this.evaluateCriteria(user, segment.criteria);
  }

  addUserProfile(profile: UserProfile): void {
    this.userProfiles.set(profile.userId, profile);
    this.refreshUserSegments(profile.userId);
  }

  updateUserProfile(userId: UserId, updates: Partial<UserProfile>): void {
    const profile = this.userProfiles.get(userId);
    if (profile) {
      Object.assign(profile, updates);
      this.refreshUserSegments(userId);
    }
  }

  getSegmentMetrics(segmentId: string): any {
    const segment = this.segments.get(segmentId);
    const users = this.getUsersInSegment(segmentId);
    
    if (!segment) return null;

    const activeUsers = users.filter(userId => {
      const profile = this.userProfiles.get(userId);
      return profile?.analytics.lastEngagement && 
             new Date(profile.analytics.lastEngagement).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    });

    return {
      id: segmentId,
      name: segment.name,
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      avgEngagementScore: this.calculateAverageEngagement(users),
      growthRate: this.calculateGrowthRate(segmentId),
      lastUpdated: segment.updatedAt
    };
  }

  private evaluateCriteria(user: UserProfile, criteria: SegmentCriteria): boolean {
    const results = criteria.rules.map(rule => this.evaluateRule(user, rule));
    
    return criteria.operator === 'AND' 
      ? results.every(result => result)
      : results.some(result => result);
  }

  private evaluateRule(user: UserProfile, rule: SegmentRule): boolean {
    const value = this.getUserFieldValue(user, rule.field);
    
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'not_equals':
        return value !== rule.value;
      case 'contains':
        return String(value).includes(String(rule.value));
      case 'not_contains':
        return !String(value).includes(String(rule.value));
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value);
      case 'not_in':
        return Array.isArray(rule.value) && !rule.value.includes(value);
      case 'greater_than':
        return Number(value) > Number(rule.value);
      case 'less_than':
        return Number(value) < Number(rule.value);
      default:
        return false;
    }
  }

  private getUserFieldValue(user: UserProfile, field: string): unknown {
    const fields = field.split('.');
    let value: any = user;
    
    for (const f of fields) {
      if (value && typeof value === 'object' && f in value) {
        value = value[f];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  private refreshSegments(): void {
    for (const segmentId of this.segments.keys()) {
      this.refreshSegmentUsers(segmentId);
    }
  }

  private refreshSegmentUsers(segmentId: string): void {
    const segment = this.segments.get(segmentId);
    if (!segment || !segment.isActive) return;

    const matchingUsers: UserId[] = [];
    
    for (const [userId, profile] of this.userProfiles) {
      if (this.evaluateCriteria(profile, segment.criteria)) {
        matchingUsers.push(userId);
      }
    }

    this.segmentCache.set(segmentId, matchingUsers);
    segment.userCount = matchingUsers.length;
    
    this.emit('segment-refreshed', { segmentId, userCount: matchingUsers.length });
  }

  private refreshUserSegments(userId: UserId): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    const userSegments: string[] = [];
    
    for (const [segmentId, segment] of this.segments) {
      if (segment.isActive && this.evaluateCriteria(profile, segment.criteria)) {
        userSegments.push(segmentId);
      }
    }

    profile.segments = userSegments;
    
    // Update cache
    for (const [segmentId, users] of this.segmentCache) {
      const hasUser = users.includes(userId);
      const shouldHaveUser = userSegments.includes(segmentId);
      
      if (shouldHaveUser && !hasUser) {
        users.push(userId);
      } else if (!shouldHaveUser && hasUser) {
        const index = users.indexOf(userId);
        users.splice(index, 1);
      }
    }
  }

  private calculateAverageEngagement(users: UserId[]): number {
    if (users.length === 0) return 0;
    
    const scores = users.map(userId => {
      const profile = this.userProfiles.get(userId);
      return profile?.analytics.engagementScore || 0;
    });
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private calculateGrowthRate(segmentId: string): number {
    // Mock growth rate calculation
    return Math.random() * 0.1 - 0.05; // -5% to +5%
  }

  getSegments(): Segment[] {
    return Array.from(this.segments.values());
  }

  getActiveSegments(): Segment[] {
    return Array.from(this.segments.values()).filter(s => s.isActive);
  }

  searchSegments(query: string): Segment[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.segments.values()).filter(segment =>
      segment.name.toLowerCase().includes(lowerQuery) ||
      segment.description.toLowerCase().includes(lowerQuery)
    );
  }
}

export const createSegmentationEngine = (): SegmentationEngine => {
  return SegmentationEngine.getInstance();
};