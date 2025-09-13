
import { UUID } from '@datasphere/core/types/common.types';

/**
 * Represents a user's profile and interaction history for personalization.
 */
export interface UserSearchProfile {
  userId: UUID;
  pastSearches: string[];
  clickedDocumentIds: string[];
  preferredTags: string[];
  location?: { lat: number; lon: number };
}

/**
 * Applies personalization logic to an Elasticsearch query.
 * @class SearchPersonalization
 */
export class SearchPersonalization {
  constructor(private profile: UserSearchProfile) {}

  /**
   * Enhances an Elasticsearch query with personalization features.
   *
   * @param {Record<string, any>} esQuery - The base Elasticsearch query to modify.
   * @returns {Record<string, any>} The personalized Elasticsearch query.
   */
  public apply(esQuery: Record<string, any>): Record<string, any> {
    if (!esQuery.query || !esQuery.query.function_score) {
      console.warn('⚠️ Cannot apply personalization to a malformed query. Expecting a function_score query.');
      return esQuery;
    }

    const functions = esQuery.query.function_score.functions || [];

    // Boost documents with preferred tags
    if (this.profile.preferredTags.length > 0) {
      functions.push({
        filter: { terms: { 'tags.keyword': this.profile.preferredTags } },
        weight: 1.5, // Apply a 50% boost
      });
    }

    // Boost documents that have been clicked before (re-findability)
    if (this.profile.clickedDocumentIds.length > 0) {
      functions.push({
        filter: { ids: { values: this.profile.clickedDocumentIds } },
        weight: 1.2, // Apply a 20% boost
      });
    }

    // Boost documents near the user's location
    if (this.profile.location) {
      functions.push({
        gauss: {
          location: {
            origin: this.profile.location,
            scale: '50km',
          },
        },
      });
    }

    esQuery.query.function_score.functions = functions;

    return esQuery;
  }
}
