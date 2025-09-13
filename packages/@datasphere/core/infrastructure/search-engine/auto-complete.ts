
import { Client } from '@elastic/elasticsearch';

/**
 * Defines the structure for an auto-complete suggestion request.
 */
export interface AutoCompleteRequest {
  /** The partial text input by the user. */
  text: string;
  /** The name of the field to search for suggestions (must be a completion type). */
  field: string;
  /** The name of the suggester defined in the Elasticsearch mapping. */
  suggesterName: string;
  /** The maximum number of suggestions to return. */
  size?: number;
}

/**
 * Provides auto-complete/suggestion functionality using Elasticsearch's completion suggester.
 * @class AutoCompleteService
 */
export class AutoCompleteService {
  constructor(private readonly esClient: Client) {}

  /**
   * Fetches auto-complete suggestions based on user input.
   *
   * @param {string} index - The index to search for suggestions in.
   * @param {AutoCompleteRequest} request - The suggestion request details.
   * @returns {Promise<string[]>} A list of suggestion strings.
   */
  public async getSuggestions(index: string, request: AutoCompleteRequest): Promise<string[]> {
    try {
      const response = await this.esClient.search({
        index,
        body: {
          suggest: {
            [request.suggesterName]: {
              prefix: request.text,
              completion: {
                field: request.field,
                size: request.size ?? 5,
                skip_duplicates: true,
                fuzzy: {
                  fuzziness: 'AUTO',
                },
              },
            },
          },
        },
      });

      const options = response.suggest?.[request.suggesterName]?.[0]?.options;

      if (!Array.isArray(options)) {
        return [];
      }

      return options.map((option: any) => option.text);
    } catch (error) {
      console.error('❌ Error fetching auto-complete suggestions:', error);
      throw new Error('Auto-complete suggestion query failed.');
    }
  }
}
