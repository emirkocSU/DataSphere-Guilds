
import { IAssetProcessingStep, Asset } from './asset-pipeline';
import { createHash } from 'crypto';
import { parse, join } from 'path';

/**
 * An asset processing step that versions an asset by embedding a content hash into its filename.
 * E.g., 'style.css' becomes 'style.a1b2c3d4.css'.
 * @class AssetVersioningStep
 * @implements {IAssetProcessingStep}
 */
export class AssetVersioningStep implements IAssetProcessingStep {
  constructor(private hashLength: number = 8) {}

  public async process(asset: Asset): Promise<Asset> {
    // 1. Generate a hash from the asset's buffer
    const hash = this.generateContentHash(asset.buffer);

    // 2. Inject the hash into the filename
    const originalPath = parse(asset.originalFileName);
    const newFileName = `${originalPath.name}.${hash}${originalPath.ext}`;

    console.log(`    - Versioned asset: ${asset.originalFileName} -> ${newFileName}`);

    return {
      ...asset,
      originalFileName: newFileName,
    };
  }

  /**
   * Generates a SHA-256 hash of the content and truncates it.
   * @private
   * @param {Buffer} content - The content of the asset.
   * @returns {string} The truncated hash.
   */
  private generateContentHash(content: Buffer): string {
    return createHash('sha256').update(content).digest('hex').slice(0, this.hashLength);
  }
}
