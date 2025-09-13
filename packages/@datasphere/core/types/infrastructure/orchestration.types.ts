/** @fileoverview Types for service orchestration and communication. */
import { Uuid } from '../../types/common.types';

export type OrchestrationStrategy = 'SAGA' | 'CHOREOGRAPHY' | 'COMMAND_PATTERN';

export interface ServiceWorkflow {
  readonly workflowId: Uuid;
  readonly name: string;
  readonly description: string;
  readonly strategy: OrchestrationStrategy;
  readonly steps: WorkflowStep[];
}

export interface WorkflowStep {
  readonly stepId: Uuid;
  readonly service: string;
  readonly action: string; // e.g., 'createUser', 'processPayment'
  readonly order: number;
  readonly compensationAction?: string; // For Sagas
}
