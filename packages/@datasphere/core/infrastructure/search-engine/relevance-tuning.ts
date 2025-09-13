/**
 * Defines a decay function for relevance tuning.
 * This allows scoring to be influenced by time or numeric values (e.g., recency, popularity).
 */
interface DecayFunction {
  type: 'linear' | 'exp' | 'gauss';
  field: string;
  origin: string | number;
  scale: string;
  offset?: string;
  decay?: number;
}

/**
 * Defines the schema for relevance tuning configuration.
 * This allows for fine-grained control over how search results are scored and ranked.
 */
export interface RelevanceConfig {
  /** A map of field names to their boosting factor (e.g., { title: 3, description: 1 }). */
  fieldBoosts: Record<string, number>;
  /** An array of decay functions to apply, influencing scores based on recency, etc. */
  decayFunctions?: DecayFunction[];
  /** Boost factor for documents that match multiple query terms. */
  multiMatchBoost?: number;
  /** Configuration for synonym-based matching to improve recall. */
  synonyms?: Record<string, string[]>;
}

/**
 * Default relevance configuration.
 * Provides a solid baseline for search result ranking.
 */
export const defaultRelevanceConfig: RelevanceConfig = {
  fieldBoosts: {
    'title.english': 5, // Boost English titles heavily
    'description.english': 2,
    tags: 3,
    category: 1.5,
  },
  decayFunctions: [
    {
      type: 'exp',
      field: 'createdAt',
      origin: 'now',
      scale: '30d',
      decay: 0.5,
    },
  ],
  multiMatchBoost: 1.2,
};

/**
 * Applies relevance tuning configurations to an existing Elasticsearch query DSL.
 * This class enhances a base query with advanced scoring and ranking logic.
 * @class RelevanceTuner
 */
export class RelevanceTuner {
  constructor(private config: RelevanceConfig) {}

  /**
   * Enhances a given Elasticsearch query with the configured relevance settings for a specific language.
   *
   * @param {Record<string, any>} esQuery - The base Elasticsearch query to modify.
   * @param {string} language - The language code (e.g., 'en', 'tr') to apply settings for.
   * @returns {Record<string, any>} The enhanced Elasticsearch query.
   */
  public apply(esQuery: Record<string, any>, language: string): Record<string, any> {
    if (!esQuery.query || !esQuery.query.bool || !esQuery.query.bool.must) {
      console.warn('⚠️ Cannot apply relevance tuning to a malformed query.');
      return esQuery;
    }

    // 1. Apply field boosts to the multi_match query for the specified language
    const multiMatchQuery = esQuery.query.bool.must.find(q => q.multi_match);
    if (multiMatchQuery) {
      multiMatchQuery.multi_match.fields = this.getBoostedFields(language);
    }

    // 2. Wrap the original query in a function_score query to add decay and other functions
    const originalQuery = { ...esQuery.query };
    esQuery.query = {
      function_score: {
        query: originalQuery,
        functions: this.buildScoreFunctions(),
        score_mode: 'avg', // How to combine scores from functions
        boost_mode: 'multiply', // How to combine the function score with the query score
      },
    };

    return esQuery;
  }

  private getBoostedFields(language: string): string[] {
    return Object.entries(this.config.fieldBoosts).map(([field, boost]) => `${field}.${language}^${boost}`);
  }

  private buildScoreFunctions(): any[] {
    const functions = [];

    if (this.config.decayFunctions) {
      for (const decay of this.config.decayFunctions) {
        functions.push({
          [decay.type]: {
            [decay.field]: {
              origin: decay.origin,
              scale: decay.scale,
              offset: decay.offset,
              decay: decay.decay,
            },
          },
        });
      }
    }

    // Add other function types here in the future (e.g., field_value_factor, script_score)

    return functions;
  }
}