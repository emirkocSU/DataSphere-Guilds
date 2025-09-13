
import { UUID } from '@datasphere/core/types/common.types';

/**
 * Defines the structure for a search query event.
 */
export interface SearchQueryEvent {
  query: string;
  userId?: UUID;
  sessionId?: string;
  filters?: Record<string, any>;
  totalResults: number;
  timestamp: Date;
}

/**
 * Defines the structure for a search result click event.
 */
export interface SearchClickEvent {
  query: string;
  documentId: string;
  rank: number; // The position of the clicked result
  userId?: UUID;
  sessionId?: string;
  timestamp: Date;
}

/**
 * Defines the interface for an analytics provider that can store search events.
 */
export interface ISearchAnalyticsProvider {
  trackQuery(event: SearchQueryEvent): Promise<void>;
  trackClick(event: SearchClickEvent): Promise<void>;
}

/**
 * A simple analytics provider that logs events to the console.
 * This can be replaced with a more robust provider (e.g., writing to a database or Kafka).
 * @class ConsoleAnalyticsProvider
 * @implements {ISearchAnalyticsProvider}
 */
export class ConsoleAnalyticsProvider implements ISearchAnalyticsProvider {
  public async trackQuery(event: SearchQueryEvent): Promise<void> {
    console.log('📊 [Analytics] Search Query:', JSON.stringify(event, null, 2));
  }

  public async trackClick(event: SearchClickEvent): Promise<void> {
    console.log('📊 [Analytics] Result Click:', JSON.stringify(event, null, 2));
  }
}

/**
 * Service for tracking search-related analytics events.
 * @class SearchAnalyticsService
 */
export class SearchAnalyticsService {
  constructor(private provider: ISearchAnalyticsProvider) {}

  public async trackQuery(event: SearchQueryEvent): Promise<void> {
    try {
      await this.provider.trackQuery(event);
    } catch (error) {
      console.error('❌ Failed to track search query event:', error);
      // Non-critical error, so we don't re-throw
    }
  }

  public async trackClick(event: SearchClickEvent): Promise<void> {
    try {
      await this.provider.trackClick(event);
    } catch (error) {
      console.error('❌ Failed to track search click event:', error);
      // Non-critical error, so we don't re-throw
    }
  }
}
