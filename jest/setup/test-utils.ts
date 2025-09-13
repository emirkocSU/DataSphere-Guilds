/**
 * @fileoverview Global test utilities and factories.
 */

import { userFactory } from './factories/user.factory';
import { taskFactory } from './factories/task.factory';

export const TestUtils = {
  factories: {
    user: userFactory,
    task: taskFactory,
  },
  // Other global utilities can be added here
  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
