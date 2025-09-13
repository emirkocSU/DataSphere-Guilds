
import { z } from 'zod';

// Define a schema for basic search query parameters
const BaseQuerySchema = z.object({
  query: z.string(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(25),
});

// Define a schema for faceted search filters
const FacetFilterSchema = z.record(z.union([z.string(), z.array(z.string())]));

// Define the full search request schema, including multi-language support
export const SearchRequestSchema = BaseQuerySchema.extend({
  filters: FacetFilterSchema.optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  language: z.string().default('en'), // Default to English
});

// Infer the TypeScript type from the Zod schema
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

/**
 * Parses and transforms a user-facing search request into a full-fledged Elasticsearch query DSL.
 * This class is the bridge between the application's search needs and Elasticsearch's powerful query capabilities.
 * @class QueryParser
 */
export class QueryParser {
  // The request is guaranteed to be valid and have defaults applied by the service layer
  constructor(private request: SearchRequest) {}

  /**
   * Builds the complete Elasticsearch query object.
   * @returns {Record<string, any>} The Elasticsearch query DSL.
   */
  public build(): Record<string, any> {
    return {
      from: (this.request.page - 1) * this.request.pageSize,
      size: this.request.pageSize,
      query: this.buildNestableQuery(),
      sort: this.buildSortClause(),
      aggs: this.buildAggregations(),
    };
  }

  /**
   * Constructs the main query block, combining full-text search with filters.
   * @private
   */
  private buildNestableQuery(): Record<string, any> {
    const mustClauses = [
      {
        multi_match: {
          query: this.request.query,
          fields: [
            `title.${this.request.language}`,
            `description.${this.request.language}`,
            'tags', // Tags are assumed to be language-agnostic keywords
          ],
          fuzziness: 'AUTO',
        },
      },
    ];

    const filterClauses = this.buildFilterClauses();

    return {
      bool: {
        must: mustClauses,
        filter: filterClauses.length > 0 ? filterClauses : undefined,
      },
    };
  }

  /**
   * Constructs the filter part of the query for faceted search.
   * @private
   */
  private buildFilterClauses(): Record<string, any>[] {
    if (!this.request.filters) {
      return [];
    }

    return Object.entries(this.request.filters).map(([field, value]) => {
      return {
        term: { [`${field}.keyword`]: value }, // Use .keyword for exact matching on aggregatable fields
      };
    });
  }

  /**
   * Constructs the sort part of the query.
   * @private
   */
  private buildSortClause(): Record<string, any>[] {
    if (!this.request.sortBy) {
      return [{ _score: 'desc' }]; // Default to sorting by relevance
    }
    return [{ [this.request.sortBy]: this.request.sortOrder }];
  }

  /**
   * Constructs the aggregations part of the query to generate facet counts.
   * @private
   */
  private buildAggregations(): Record<string, any> | undefined {
    // We can define a list of fields that are available for faceting
    const facetableFields = ['category', 'author', 'tags']; // Example facetable fields

    const aggs = {};
    for (const field of facetableFields) {
      aggs[`${field}_facets`] = {
        terms: { field: `${field}.keyword`, size: 10 }, // Get top 10 terms for each facet
      };
    }
    return aggs;
  }
}
