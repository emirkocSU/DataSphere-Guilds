
import sharp from 'sharp';
import { IAssetProcessingStep, Asset, AssetType } from './asset-pipeline';

/**
 * Configuration options for the image optimization step.
 */
export interface ImageOptimizationConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // For JPEG and WebP
  convertTo?: 'jpeg' | 'png' | 'webp';
}

/**
 * An asset processing step that optimizes images using the `sharp` library.
 * Handles resizing, quality adjustments, and format conversion.
 * @class ImageOptimizationStep
 * @implements {IAssetProcessingStep}
 */
export class ImageOptimizationStep implements IAssetProcessingStep {
  constructor(private config: ImageOptimizationConfig) {}

  public async process(asset: Asset): Promise<Asset> {
    // This step only applies to images
    if (asset.type !== 'image') {
      return asset;
    }

    let imageProcessor = sharp(asset.buffer);

    // 1. Resize the image if dimensions are specified
    if (this.config.maxWidth || this.config.maxHeight) {
      imageProcessor = imageProcessor.resize(this.config.maxWidth, this.config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // 2. Convert to a different format if specified
    let newMimeType = asset.mimeType;
    if (this.config.convertTo) {
      newMimeType = `image/${this.config.convertTo}`;
      imageProcessor = imageProcessor.toFormat(this.config.convertTo, {
        quality: this.config.quality,
      });
    } else if (asset.mimeType === 'image/jpeg') {
      imageProcessor = imageProcessor.jpeg({ quality: this.config.quality, progressive: true });
    } else if (asset.mimeType === 'image/png') {
      imageProcessor = imageProcessor.png({ quality: this.config.quality });
    }

    // 3. Get the processed image buffer
    const newBuffer = await imageProcessor.toBuffer();

    console.log(`    - Image optimized: ${asset.originalFileName} (Size: ${asset.buffer.length} -> ${newBuffer.length})`);

    return {
      ...asset,
      buffer: newBuffer,
      mimeType: newMimeType,
    };
  }
}
