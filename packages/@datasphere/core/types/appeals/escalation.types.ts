/** @fileoverview Types for the escalation path of complex appeals. */
import { UUID } from '../common.types';

export type EscalationLevel = 'SENIOR_INSPECTOR' | 'PANEL_REVIEW' | 'EXTERNAL_ARBITRATOR';

export interface EscalationTrigger {
  readonly fromStage: string;
  readonly toLevel: EscalationLevel;
  readonly reason: 'DISAGREEMENT' | 'HIGH_VALUE_TASK' | 'SYSTEMIC_ISSUE';
}

export interface EscalationRecord {
  readonly escalationId: UUID;
  readonly appealId: UUID;
  readonly level: EscalationLevel;
  readonly assignedPanel: UUID[];
  readonly decision: string;
}
