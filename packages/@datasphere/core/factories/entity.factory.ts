/** @fileoverview Factory for creating entity instances with default values. */
import { Uuid } from '../types/common.types';
import { User, Task } from '../types/business.types';

export function createUser(overrides?: Partial<User>): User {
  return {
    userId: 'user-' + Math.random().toString(36).substring(2, 15) as Uuid,
    name: 'Default User',
    ...overrides,
  };
}

export function createTask(overrides?: Partial<Task>): Task {
  return {
    taskId: 'task-' + Math.random().toString(36).substring(2, 15) as Uuid,
    title: 'Default Task',
    ...overrides,
  };
}
