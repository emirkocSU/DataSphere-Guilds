/**
 * @fileoverview Extends Jest's `expect` with custom matchers for this project.
 * This file is automatically loaded via `setupFilesAfterEnv` in jest.config.js.
 */

import { expect } from '@jest/globals';
import { accessibilityMatchers } from './matchers/accessibility.matchers';
import { styleMatchers } from './matchers/style.matchers';

// Combine all custom matchers and extend Jest's expect
expect.extend({
  ...accessibilityMatchers,
  ...styleMatchers,
});
