import { Client } from '@elastic/elasticsearch';
import { IndexingPipeline, IndexableDocument } from './indexing-pipeline';
import { QueryParser, SearchRequest } from './query-parser';
import { RelevanceTuner, RelevanceConfig, defaultRelevanceConfig } from './relevance-tuning';

/**
 * High-level service for interacting with the search engine.
 * This class orchestrates the indexing, searching, and relevance tuning processes,
 * providing a simple and powerful API to the rest of the application.
 * @class SearchService
 */
export class SearchService {
  private readonly esClient: Client;
  private readonly indexingPipeline: IndexingPipeline;
  private readonly relevanceTuner: RelevanceTuner;

  constructor(esNode: string, relevanceConfig: RelevanceConfig = defaultRelevanceConfig) {
    this.esClient = new Client({ node: esNode });
    this.indexingPipeline = new IndexingPipeline(this.esClient);
    this.relevanceTuner = new RelevanceTuner(relevanceConfig);
  }

  /**
   * Indexes a single document.
   * @param {string} index - The index to add the document to.
   * @param {IndexableDocument} document - The document to index.
   * @returns {Promise<void>}
   */
  public async indexDocument(index: string, document: IndexableDocument): Promise<void> {
    await this.indexingPipeline.add(index, document);
    await this.indexingPipeline.flush(); // Flush immediately for single document indexing
  }

  /**
   * Indexes multiple documents in a batch.
   * @param {string} index - The index to add the documents to.
   * @param {IndexableDocument[]} documents - The documents to index.
   * @returns {Promise<void>}
   */
  public async indexBatch(index: string, documents: IndexableDocument[]): Promise<void> {
    for (const doc of documents) {
      await this.indexingPipeline.add(index, doc);
    }
    await this.indexingPipeline.flush();
  }

  /**
   * Performs a search query.
   *
   * @param {SearchRequest} request - The user's search request.
   * @returns {Promise<Record<string, any>>} The search results from Elasticsearch.
   */
  public async search(request: SearchRequest): Promise<Record<string, any>> {
    // 1. Build the base query using the parser
    const queryParser = new QueryParser(request);
    let esQuery = queryParser.build();

    // 2. Enhance the query with relevance tuning
    esQuery = this.relevanceTuner.apply(esQuery, 'en');

    console.log('Executing Elasticsearch Query:', JSON.stringify(esQuery, null, 2));

    // 3. Execute the search
    try {
      const result = await this.esClient.search(esQuery);
      return result;
    } catch (error) {
      console.error('❌ Elasticsearch search failed:', error);
      throw new Error('Search operation failed.');
    }
  }

  /**
   * Provides access to the underlying Elasticsearch client for advanced use cases.
   * @returns {Client} The Elasticsearch client instance.
   */
  public getClient(): Client {
    return this.esClient;
  }
}

// Export all underlying components for advanced customization if needed
export * from './indexing-pipeline';
export * from './query-parser';
export * from './relevance-tuning';