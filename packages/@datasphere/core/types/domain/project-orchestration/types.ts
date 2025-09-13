/** @fileoverview Core types for Project Orchestration. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Project {
  projectId: Uuid;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: Uuid;
  startDate: IsoTimestamp;
  endDate?: IsoTimestamp;
}
