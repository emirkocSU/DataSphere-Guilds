/** @fileoverview Interfaces for Internationalization services. */

import { LanguageCode, Translation } from './types';

export interface ITranslationService {
  getTranslation(key: string, locale: LanguageCode): Promise<string>;
  addTranslation(translation: Omit<Translation, 'version'>): Promise<Translation>;
  listTranslations(locale?: LanguageCode): Promise<Translation[]>;
}
