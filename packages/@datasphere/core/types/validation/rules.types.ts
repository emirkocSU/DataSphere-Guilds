/**
 * @fileoverview Enterprise-grade, extensible types for the business rule engine.
 * Defines the core structures for rules, conditions, actions, and validation results.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

export type Primitive = string | number | boolean | null | undefined;
export type FactValue = Primitive | Primitive[] | { [key: string]: FactValue };

export interface ValidationFact {
  [key: string]: FactValue;
}

export interface ValidationContext {
  facts: ValidationFact;
  userId?: UUID;
  timestamp: ISOTimestamp;
  metadata?: Record<string, any>;
}

export enum RuleOperator {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  IN = 'in',
  NOT_IN = 'notIn',
  CONTAINS = 'contains',
  REGEX_MATCH = 'regexMatch',
}

export interface RuleCondition {
  fact: string;
  operator: RuleOperator;
  value: FactValue;
  path?: string; // Optional path for nested objects
}

export type AllConditions = { all: RuleCondition[] };
export type AnyConditions = { any: RuleCondition[] };
export type NotCondition = { not: RuleCondition };
export type ConditionGroup = AllConditions | AnyConditions | NotCondition;

export enum RuleActionType {
  RETURN_RESULT = 'returnResult',
  TRIGGER_WEBHOOK = 'triggerWebhook',
  PUBLISH_EVENT = 'publishEvent',
}

export interface RuleAction {
  type: RuleActionType;
  params: Record<string, any>;
}

export interface BusinessRule {
  id: UUID;
  name: string;
  description?: string;
  priority: number;
  conditions: ConditionGroup;
  actions: RuleAction[];
  isEnabled: boolean;
  version: number;
  tags?: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  fact?: string;
  path?: string;
}

export interface ValidationResult {
  ruleId: UUID;
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
  actionsTaken: RuleAction[];
  executionTimeMs: number;
  timestamp: ISOTimestamp;
}

export interface RuleExecutionMetrics {
  ruleId: UUID;
  executionCount: number;
  successCount: number;
  failureCount: number;
  averageExecutionTimeMs: number;
} 