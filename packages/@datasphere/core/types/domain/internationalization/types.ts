/** @fileoverview Core types for Internationalization. */

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'tr';

export interface Translation {
  key: string;
  value: string;
  locale: LanguageCode;
  version: string;
}
