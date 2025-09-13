/** @fileoverview Types for the data indexing process. */
import { Uuid } from '../common.types';

export type IndexingStrategy = 'REAL_TIME' | 'BATCH' | 'ON_DEMAND';

export interface IndexableDocument {
  readonly id: Uuid;
  readonly entityType: string;
  readonly content: string; // The main text content to be indexed
  readonly metadata: Record<string, any>; // Fields to be used for filtering/faceting
}

export interface IndexingJob {
  readonly jobId: Uuid;
  readonly strategy: IndexingStrategy;
  readonly documents: IndexableDocument[];
  readonly status: 'QUEUED' | 'INDEXING' | 'COMPLETED' | 'FAILED';
}
