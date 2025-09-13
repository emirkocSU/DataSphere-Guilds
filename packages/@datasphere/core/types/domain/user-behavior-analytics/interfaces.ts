/** @fileoverview Interfaces for User Behavior Analytics services. */
import { Uuid } from '../../../types/common.types';
import { UserEvent, UserSegment } from './types';

export interface IUserAnalyticsService {
  recordEvent(event: Omit<UserEvent, 'eventId' | 'timestamp'>): Promise<void>;
  getUserSegment(userId: Uuid): Promise<UserSegment>;
  getEngagementMetrics(userId: Uuid, period: string): Promise<Record<string, number>>;
}
