/** @fileoverview Types for faceted search. */

export interface SearchFacet {
  readonly field: string;
  readonly displayName: string;
  readonly buckets: FacetBucket[];
}

export interface FacetBucket {
  readonly value: any;
  readonly count: number;
  readonly isSelected: boolean;
}
