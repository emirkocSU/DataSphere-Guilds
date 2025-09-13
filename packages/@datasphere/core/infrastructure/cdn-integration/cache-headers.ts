import { createHash } from 'crypto';
import { Asset } from './asset-pipeline';

/**
 * Defines the caching policy for a type of asset.
 */
export interface CachePolicy {
  /** The value for the Cache-Control header (e.g., 'public, max-age=31536000, immutable'). */
  cacheControl: string;
  /** Whether to generate an ETag header for validation. */
  useETag: boolean;
  /** Whether to use the Last-Modified header for validation. */
  useLastModified: boolean;
}

/**
 * A map of asset MIME types to their corresponding cache policies.
 */
export const defaultCachePolicies: Record<string, CachePolicy> = {
  'image/jpeg': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: true },
  'image/png': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: true },
  'image/webp': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: true },
  'video/mp4': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: true },
  'application/javascript': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: false },
  'text/css': { cacheControl: 'public, max-age=31536000, immutable', useETag: true, useLastModified: false },
  default: { cacheControl: 'public, max-age=3600', useETag: true, useLastModified: true }, // 1 hour for other assets
};

/**
 * Generates and manages cache-related HTTP headers for an asset.
 * @class CacheHeaderManager
 */
export class CacheHeaderManager {
  private policies: Record<string, CachePolicy>;

  constructor(policies: Record<string, CachePolicy> = defaultCachePolicies) {
    this.policies = policies;
  }

  /**
   * Generates the appropriate cache headers for a given asset.
   *
   * @param {Asset} asset - The asset for which to generate headers.
   * @param {Date} [lastModifiedDate] - The last modified date of the asset.
   * @returns {Record<string, string>} A map of HTTP header names to their values.
   */
  public getHeaders(asset: Asset, lastModifiedDate?: Date): Record<string, string> {
    const policy = this.policies[asset.mimeType] || this.policies.default;
    const headers: Record<string, string> = {};

    // 1. Set Cache-Control header
    headers['Cache-Control'] = policy.cacheControl;

    // 2. Generate and set ETag header
    if (policy.useETag) {
      headers['ETag'] = this.generateETag(asset.buffer);
    }

    // 3. Set Last-Modified header
    if (policy.useLastModified && lastModifiedDate) {
      headers['Last-Modified'] = lastModifiedDate.toUTCString();
    }

    return headers;
  }

  /**
   * Generates a strong ETag for an asset based on its content.
   * @private
   * @param {Buffer} content - The content of the asset.
   * @returns {string} The generated ETag.
   */
  private generateETag(content: Buffer): string {
        const hash = createHash('sha256').update(content).digest('hex');
    return `"${hash}"`;
  }
}