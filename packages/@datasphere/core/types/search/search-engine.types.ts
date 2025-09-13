/** @fileoverview Types for the core search engine and queries. */
import { Uuid } from '../common.types';

export interface SearchQuery {
  readonly query: string;
  readonly filters?: Record<string, any>;
  readonly sortBy?: { field: string; order: 'asc' | 'desc'; };
  readonly pagination: { limit: number; offset: number; };
  readonly targetEntities: string[]; // e.g., ['tasks', 'users']
}

export interface SearchResult<T> {
  readonly id: Uuid;
  readonly entity: string;
  readonly score: number; // Relevance score
  readonly highlights?: Record<string, string>; // Field name to highlighted snippet
  readonly data: T;
}
