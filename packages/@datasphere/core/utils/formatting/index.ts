/** @fileoverview Ultra-lean formatting utilities with zero-dependency i18n support and performance optimization. */

// Core formatting exports
export * from './currency';
export * from './date';
export * from './number';
export * from './string';
export * from './bytes';
export * from './phone';
export * from './address';

// Advanced formatters
export {
  createFormatter,
  createLocaleFormatter,
  createCustomFormatter,
  formatWithCache
} from './factories';

// Performance optimized formatters
export {
  FastNumberFormatter,
  FastDateFormatter,
  FastCurrencyFormatter
} from './fast-formatters';

// Validation + formatting combo
export {
  formatAndValidate,
  sanitizeAndFormat,
  normalizeAndFormat
} from './validators';

// Internationalization
export {
  i18nFormatter,
  LocaleManager,
  CurrencyManager,
  TimeZoneManager
} from './i18n';

// High-performance utilities
export {
  memoizedFormatter,
  batchFormatter,
  streamFormatter
} from './utils';
