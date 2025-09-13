/**
 * @fileoverview Custom matchers for React Native style properties.
 */

import { matcherHint } from 'jest-matcher-utils';
import { StyleSheet } from 'react-native';

export const styleMatchers = {
  toHaveStyle(received: any, expectedStyle: Record<string, any>) {
    const receivedStyle = StyleSheet.flatten(received.props.style) || {};
    const pass = Object.entries(expectedStyle).every(([key, value]) => receivedStyle[key] === value);

    const message = pass
      ? () => `${matcherHint('.not.toHaveStyle')}\n\nExpected component not to have style:\n  ${JSON.stringify(expectedStyle)}`
      : () => `${matcherHint('.toHaveStyle')}\n\nExpected component to have style:\n  ${JSON.stringify(expectedStyle)}\nReceived:\n  ${JSON.stringify(receivedStyle)}`;

    return { message, pass };
  },
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(expectedStyle: Record<string, any>): R;
    }
  }
}
