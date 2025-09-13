/** @fileoverview Types related to business analytics. */
import { Uuid, IsoTimestamp, Percentage } from '../../types/common.types';

export type MetricPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface WorkerAnalytics {
  userId: Uuid;
  period: MetricPeriod;
  totalTasksCompleted: number;
  averageApprovalRate: Percentage;
  totalEarnings: MoneyValue;
  lastUpdated: IsoTimestamp;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  averageTaskCompletionTime: number; // in minutes
  platformRevenue: MoneyValue;
}
