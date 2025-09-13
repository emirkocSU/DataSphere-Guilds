/** @fileoverview Types for translation keys and resources. */

export interface TranslationResource {
  readonly [key: string]: string | TranslationResource;
}

export interface TranslationProvider {
  load(locale: string): Promise<TranslationResource>;
  translate(key: string, options?: Record<string, any>): string;
}
