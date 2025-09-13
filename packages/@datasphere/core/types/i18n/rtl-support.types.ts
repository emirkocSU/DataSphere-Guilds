/** @fileoverview Types for Right-To-Left (RTL) language support. */

export interface RtlSupport {
  readonly isRtl: boolean;
  readonly layoutDirection: 'ltr' | 'rtl';
  readonly mirrorUI: boolean;
}
