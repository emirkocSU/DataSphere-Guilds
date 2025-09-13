/** @fileoverview Types for detecting the user's locale. */

export type LocaleSource = 'USER_PREFERENCE' | 'BROWSER_SETTINGS' | 'GEOLOCATION';

export interface DetectedLocale {
  readonly locale: string;
  readonly source: LocaleSource;
  readonly confidence: number;
}
