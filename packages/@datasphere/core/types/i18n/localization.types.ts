/** @fileoverview Types for locale configuration and number/date formatting. */

export type Locale = 'en-US' | 'es-ES' | 'zh-CN' | 'hi-IN' | 'ar-SA'; // Example locales

export interface LocaleConfig {
  readonly locale: Locale;
  readonly language: string;
  readonly country: string;
  readonly textDirection: 'ltr' | 'rtl';
}

export interface NumberFormatOptions {
  readonly style: 'decimal' | 'currency' | 'percent';
  readonly currency?: string;
}

export interface DateFormatOptions {
  readonly dateStyle: 'full' | 'long' | 'medium' | 'short';
  readonly timeStyle: 'full' | 'long' | 'medium' | 'short';
}
