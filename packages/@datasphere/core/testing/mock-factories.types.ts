/** @fileoverview Types for mock data factories. */

export interface Factory<T> {
  create(overrides?: Partial<T>): T;
  createMany(count: number, overrides?: Partial<T>): T[];
}

export interface UserFactory extends Factory<import('../types').UserProfile> {}
export interface TaskFactory extends Factory<import('../types').Task> {}
