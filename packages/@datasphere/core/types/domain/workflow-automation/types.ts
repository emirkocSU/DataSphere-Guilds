/** @fileoverview Core types for Workflow Automation. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type WorkflowStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface Workflow {
  workflowId: Uuid;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: Record<string, any>; // e.g., { type: 'EVENT', eventName: 'task.created' }
  steps: WorkflowStep[];
  createdAt: IsoTimestamp;
}

export interface WorkflowStep {
  stepId: Uuid;
  name: string;
  action: string; // e.g., 'SEND_EMAIL', 'UPDATE_DB'
  configuration: Record<string, any>;
  order: number;
}
