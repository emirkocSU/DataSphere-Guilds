/** @fileoverview Types for detecting the current platform and its features. */

export type PlatformType = 'MOBILE_NATIVE' | 'WEB_BROWSER' | 'DESKTOP_APP' | 'SERVER';

export interface PlatformDetectionResult {
  readonly platform: PlatformType;
  readonly isFeatureEnabled: (feature: string) => boolean;
}

export interface FeatureFlag {
  readonly name: string;
  readonly isEnabled: boolean;
  readonly rolloutPercentage?: number;
}
