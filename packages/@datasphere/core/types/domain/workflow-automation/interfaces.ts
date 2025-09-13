/** @fileoverview Interfaces for Workflow Automation services. */
import { Uuid } from '../../../types/common.types';
import { Workflow, WorkflowStatus } from './types';

export interface IWorkflowService {
  createWorkflow(workflow: Omit<Workflow, 'workflowId' | 'createdAt'>): Promise<Workflow>;
  startWorkflow(workflowId: Uuid, context: Record<string, any>): Promise<void>;
  getWorkflowStatus(workflowId: Uuid): Promise<Workflow | null>;
  listWorkflows(status?: WorkflowStatus): Promise<Workflow[]>;
}
