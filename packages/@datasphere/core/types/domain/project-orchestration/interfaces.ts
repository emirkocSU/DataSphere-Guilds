/** @fileoverview Interfaces for Project Orchestration services. */
import { Uuid } from '../../../types/common.types';
import { Project, ProjectStatus } from './types';

export interface IProjectService {
  createProject(project: Omit<Project, 'projectId' | 'startDate'>): Promise<Project>;
  getProject(projectId: Uuid): Promise<Project | null>;
  updateProjectStatus(projectId: Uuid, status: ProjectStatus): Promise<void>;
  listProjects(ownerId?: Uuid, status?: ProjectStatus): Promise<Project[]>;
}
