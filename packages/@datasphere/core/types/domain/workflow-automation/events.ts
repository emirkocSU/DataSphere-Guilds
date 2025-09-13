/** @fileoverview Event types for Workflow Automation. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { Workflow, WorkflowStatus } from './types';

export interface WorkflowStatusChangedEvent {
  eventId: Uuid;
  workflow: Workflow;
  oldStatus: WorkflowStatus;
  newStatus: WorkflowStatus;
  timestamp: IsoTimestamp;
}
