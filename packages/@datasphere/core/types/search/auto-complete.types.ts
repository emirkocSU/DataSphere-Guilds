/** @fileoverview Types for auto-complete and search suggestions. */

export interface SuggestionQuery {
  readonly prefix: string;
  readonly targetField: string;
  readonly limit: number;
}

export interface SearchSuggestion {
  readonly text: string;
  readonly type: 'QUERY_COMPLETION' | 'ENTITY_SUGGESTION';
  readonly score: number;
  readonly metadata?: Record<string, any>;
}
