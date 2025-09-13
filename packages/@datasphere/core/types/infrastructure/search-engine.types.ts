/** @fileoverview Types for advanced search engine integration. */
import { Uuid } from '../../types/common.types';

export type SearchProvider = 'ELASTICSEARCH' | 'ALGOLIA' | 'SOLR';

export interface SearchQuery {
  readonly query: string;
  readonly filters?: Record<string, any>;
  readonly sortBy?: { field: string; order: 'asc' | 'desc'; };
  readonly pagination?: { limit: number; offset: number; };
}

export interface SearchResult<T> {
  readonly id: Uuid;
  readonly score: number;
  readonly data: T;
}

export interface SearchEngineConfig {
  readonly configId: Uuid;
  readonly provider: SearchProvider;
  readonly endpoint: string;
  readonly apiKey?: string; // Managed securely
  readonly indexName: string;
}
