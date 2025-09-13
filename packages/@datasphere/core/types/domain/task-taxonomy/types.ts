/** @fileoverview Core types for Task Taxonomy. */
import { Uuid } from '../../../types/common.types';

export type TaskCategory = 'IMAGE_ANNOTATION' | 'TEXT_TRANSCRIPTION' | 'DATA_COLLECTION';
export type TaskComplexityLevel = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';

export interface TaskType {
  typeId: Uuid;
  name: string;
  category: TaskCategory;
  complexity: TaskComplexityLevel;
  description: string;
  requiredSkills: string[];
}
