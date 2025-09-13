/**
 * @fileoverview Factory for creating task objects for tests.
 */

interface Task {
    id: string;
    status: 'OPEN' | 'CLAIMED' | 'COMPLETED';
    minReputation: number;
    minLevel: number;
}

let nextTaskId = 1;

const createDefaultTask = (): Task => ({
  id: `task-${nextTaskId++}`,
  status: 'OPEN',
  minReputation: 0.8,
  minLevel: 5,
});

export const taskFactory = {
  create(overrides: Partial<Task> = {}): Task {
    return { ...createDefaultTask(), ...overrides };
  },
  createMany(count: number, overrides: Partial<Task> = {}): Task[] {
    return Array.from({ length: count }, () => this.create(overrides));
  },
};
