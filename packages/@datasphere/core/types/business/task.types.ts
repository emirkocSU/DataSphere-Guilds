/** @fileoverview Types related to business tasks. */
import { Uuid, IsoTimestamp, MoneyValue } from '../../types/common.types';

export type TaskCategory = 'DATA_COLLECTION' | 'IMAGE_ANNOTATION';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

export interface Task {
  taskId: Uuid;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  reward: MoneyValue;
  currency: string;
  createdAt: IsoTimestamp;
}

export interface TaskRequirements {
  minReputation: number;
  minLevel: number;
  requiredSkills: string[];
}
