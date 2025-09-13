import { Asset, AssetPipeline, IAssetProcessingStep } from './asset-pipeline';
import { CacheHeaderManager, CachePolicy } from './cache-headers';
import { ImageOptimizationStep, ImageOptimizationConfig } from './image-optimization';

// Interface for a generic CDN provider
export interface ICdnProvider {
  upload(asset: Asset, headers: Record<string, string>): Promise<{ url: string; cdnId: string }>;
  getPublicUrl(cdnId: string): string;
}

/**
 * High-level service for processing and uploading assets to a CDN.
 * This class orchestrates the asset pipeline, cache header generation, and CDN provider interaction.
 * @class CdnService
 */
export class CdnService {
  private cacheManager: CacheHeaderManager;

  constructor(private cdnProvider: ICdnProvider, cachePolicies?: Record<string, CachePolicy>) {
    this.cacheManager = new CacheHeaderManager(cachePolicies);
  }

  /**
   * Creates and executes a standard image processing and uploading pipeline.
   *
   * @param {Asset} imageAsset - The initial image asset to process.
   * @param {ImageOptimizationConfig} optimizationConfig - Configuration for the optimization step.
   * @returns {Promise<{ url: string; cdnId: string }>} The URL and ID of the uploaded asset.
   */
  public async processAndUploadImage(
    imageAsset: Asset,
    optimizationConfig: ImageOptimizationConfig
  ): Promise<{ url: string; cdnId: string }> {
    if (imageAsset.type !== 'image') {
      throw new Error('This pipeline is designed for images only.');
    }

    const pipeline = new AssetPipeline([
      new ImageOptimizationStep(optimizationConfig),
      // Add other steps here in the future (e.g., watermarking)
    ]);

    return this.executePipelineAndUpload(pipeline, imageAsset);
  }

  /**
   * Executes a custom asset processing pipeline and uploads the result.
   *
   * @param {AssetPipeline} pipeline - The custom pipeline to execute.
   * @param {Asset} asset - The initial asset.
   * @returns {Promise<{ url: string; cdnId: string }>} The URL and ID of the uploaded asset.
   */
  public async executePipelineAndUpload(
    pipeline: AssetPipeline,
    asset: Asset
  ): Promise<{ url: string; cdnId: string }> {
    // 1. Process the asset through the pipeline
    const processedAsset = await pipeline.execute(asset);

    // 2. Generate cache headers for the processed asset
    const headers = this.cacheManager.getHeaders(processedAsset, new Date());

    // 3. Upload the final asset to the CDN provider
    try {
      const result = await this.cdnProvider.upload(processedAsset, headers);
      console.log(`✅ Asset uploaded to CDN: ${result.url}`);
      return result;
    } catch (error) {
      console.error(`❌ CDN upload failed for ${asset.originalFileName}:`, error);
      throw new Error('Failed to upload asset to CDN.');
    }
  }

  /**
   * Retrieves the public URL for a given CDN asset ID.
   * @param {string} cdnId - The unique identifier of the asset on the CDN.
   * @returns {string} The public URL.
   */
  public getUrl(cdnId: string): string {
    return this.cdnProvider.getPublicUrl(cdnId);
  }
}

// Export all underlying components for advanced customization
export * from './asset-pipeline';
export * from './cache-headers';
export * from './image-optimization';