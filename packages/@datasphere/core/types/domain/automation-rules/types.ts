/** @fileoverview Core types for Automation Rules. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type RuleTriggerType = 'EVENT' | 'SCHEDULE' | 'MANUAL';
export type RuleActionType = 'SEND_NOTIFICATION' | 'UPDATE_STATUS' | 'TRIGGER_WORKFLOW';

export interface AutomationRule {
  ruleId: Uuid;
  name: string;
  description: string;
  trigger: {
    type: RuleTriggerType;
    config: Record<string, any>; // e.g., { eventName: 'task.completed' }
  };
  conditions: Record<string, any>; // e.g., { 'task.status': 'COMPLETED' }
  actions: {
    type: RuleActionType;
    config: Record<string, any>;
  }[];
  isActive: boolean;
  createdAt: IsoTimestamp;
}
