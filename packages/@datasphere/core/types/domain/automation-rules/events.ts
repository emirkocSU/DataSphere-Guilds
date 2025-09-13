/** @fileoverview Event types for Automation Rules. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { AutomationRule } from './types';

export interface RuleTriggeredEvent {
  eventId: Uuid;
  rule: AutomationRule;
  timestamp: IsoTimestamp;
  context: Record<string, any>;
}
