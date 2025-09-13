/** @fileoverview Types for the alerting system. */
import { Uuid, IsoTimestamp } from '../common.types';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AlertRule {
  readonly ruleId: Uuid;
  readonly metric: string; // e.g., 'cpu.load', 'memory.usage'
  readonly operator: 'GT' | 'LT' | 'EQ';
  readonly threshold: number;
  readonly durationSeconds: number;
  readonly severity: AlertSeverity;
}

export interface Alert {
  readonly alertId: Uuid;
  readonly ruleId: Uuid;
  readonly status: 'FIRING' | 'RESOLVED';
  readonly triggeredAt: IsoTimestamp;
  readonly resolvedAt?: IsoTimestamp;
  readonly details: string;
}
