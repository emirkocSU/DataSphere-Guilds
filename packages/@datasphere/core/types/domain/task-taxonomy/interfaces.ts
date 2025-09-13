/** @fileoverview Interfaces for Task Taxonomy services. */
import { Uuid } from '../../../types/common.types';
import { TaskType } from './types';

export interface ITaskTaxonomyService {
  getTaskType(typeId: Uuid): Promise<TaskType | null>;
  listTaskTypes(category?: TaskCategory): Promise<TaskType[]>;
  createTaskType(taskType: Omit<TaskType, 'typeId'>): Promise<TaskType>;
}
