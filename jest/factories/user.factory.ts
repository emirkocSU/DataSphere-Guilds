/**
 * @fileoverview Factory for creating user objects for tests.
 */

// Assuming User type is defined somewhere accessible, e.g., in a shared types package
// For demonstration, we'll define a simplified version here.
interface User {
    id: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
    reputation: number;
    level: number;
}

let nextUserId = 1;

const createDefaultUser = (): User => ({
  id: `user-${nextUserId++}`,
  status: 'ACTIVE',
  reputation: 0.85,
  level: 5,
});

export const userFactory = {
  create(overrides: Partial<User> = {}): User {
    return { ...createDefaultUser(), ...overrides };
  },
  createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  },
};
