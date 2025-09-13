/** @fileoverview Interfaces for Automation Rules services. */
import { Uuid } from '../../../types/common.types';
import { AutomationRule } from './types';

export interface IAutomationService {
  createRule(rule: Omit<AutomationRule, 'ruleId' | 'createdAt'>): Promise<AutomationRule>;
  getRule(ruleId: Uuid): Promise<AutomationRule | null>;
  updateRule(ruleId: Uuid, updates: Partial<AutomationRule>): Promise<AutomationRule>;
  deleteRule(ruleId: Uuid): Promise<void>;
  triggerRule(ruleId: Uuid, context: Record<string, any>): Promise<void>;
}
