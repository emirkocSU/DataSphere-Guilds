

---

## Advanced Search Engine

This project includes a sophisticated search engine module built on Elasticsearch, located in `packages/@datasphere/core/infrastructure/search-engine`. It supports relevance tuning, faceted search, auto-complete, and multi-language search.

### Multi-Language Search Support

To enable multi-language search, you must configure your Elasticsearch index mappings to use language-specific analyzers. The search service is designed to work with fields that follow a `.<language_code>` convention (e.g., `title.en`, `title.tr`).

**Example Elasticsearch Mapping:**

```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "fields": {
          "en": {
            "type": "text",
            "analyzer": "english"
          },
          "tr": {
            "type": "text",
            "analyzer": "turkish"
          },
          "de": {
            "type": "text",
            "analyzer": "german"
          }
        }
      },
      "description": {
        "type": "text",
        "fields": {
          "en": {
            "type": "text",
            "analyzer": "english"
          },
          "tr": {
            "type": "text",
            "analyzer": "turkish"
          },
          "de": {
            "type": "text",
            "analyzer": "german"
          }
        }
      },
      "tags": {
        "type": "keyword"
      }
    }
  }
}
```

When indexing a document, you would provide content for each supported language. The search service will then automatically target the correct field based on the `language` parameter provided in the search request.