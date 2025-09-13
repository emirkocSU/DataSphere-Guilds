
import { IAssetProcessingStep, Asset } from './asset-pipeline';
import { gzip as zlibGzip, brotliCompress as zlibBrotli } from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlibGzip);
const brotliCompress = promisify(zlibBrotli);

/**
 * Configuration for the compression step.
 */
export interface CompressionConfig {
  /** The compression algorithm to use. */
  algorithm: 'gzip' | 'brotli';
}

/**
 * An asset processing step that compresses assets using Gzip or Brotli.
 * This step should typically run after minification.
 * @class CompressionStep
 * @implements {IAssetProcessingStep}
 */
export class CompressionStep implements IAssetProcessingStep {
  constructor(private config: CompressionConfig) {}

  public async process(asset: Asset): Promise<Asset> {
    const originalSize = asset.buffer.length;
    let compressedBuffer: Buffer;

    if (this.config.algorithm === 'gzip') {
      compressedBuffer = await gzip(asset.buffer);
    } else if (this.config.algorithm === 'brotli') {
      compressedBuffer = await brotliCompress(asset.buffer);
    } else {
      // If no supported algorithm is specified, return the original asset
      return asset;
    }

    console.log(`    - Compressed asset with ${this.config.algorithm}: ${asset.originalFileName} (Size: ${originalSize} -> ${compressedBuffer.length})`);

    // Note: A real implementation would need to manage multiple compressed versions
    // of the asset and serve the correct one based on the client's Accept-Encoding header.
    // For this step, we'll just return the compressed buffer for simplicity.
    return {
      ...asset,
      buffer: compressedBuffer,
    };
  }
}
