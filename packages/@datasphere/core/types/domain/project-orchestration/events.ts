/** @fileoverview Event types for Project Orchestration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { Project } from './types';

export interface ProjectStatusChangedEvent {
  eventId: Uuid;
  project: Project;
  oldStatus: ProjectStatus;
  newStatus: ProjectStatus;
  timestamp: IsoTimestamp;
}
