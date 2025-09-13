/**
 * @fileoverview Custom matchers for accessibility (a11y) testing.
 */

import { matcherHint, printReceived, printExpected } from 'jest-matcher-utils';

export const accessibilityMatchers = {
  toBeAccessible(received: any) {
    // This is a simplified check. A real implementation would be more robust.
    const pass = received.props.accessible !== false && !!received.props.accessibilityLabel;

    const message = pass
      ? () =>
          `${matcherHint('.not.toBeAccessible')}\n\n` +
          `Expected element not to be accessible, but it was.`
      : () =>
          `${matcherHint('.toBeAccessible')}\n\n` +
          `Expected element to be accessible (have accessible=true and an accessibilityLabel), but it was not.`;

    return { message, pass };
  },
};

// This declaration allows TypeScript to recognize the custom matcher.
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAccessible(): R;
    }
  }
}
