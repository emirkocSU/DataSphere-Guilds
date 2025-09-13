
import { IAssetProcessingStep, Asset } from './asset-pipeline';
import { minify as minifyJs } from 'terser';
import { minify as minifyCss } from 'csso';

/**
 * An asset processing step that minifies JavaScript and CSS assets.
 * @class MinificationStep
 * @implements {IAssetProcessingStep}
 */
export class MinificationStep implements IAssetProcessingStep {
  public async process(asset: Asset): Promise<Asset> {
    const originalSize = asset.buffer.length;
    let newBuffer = asset.buffer;

    if (asset.mimeType === 'application/javascript') {
      const result = await minifyJs(asset.buffer.toString('utf8'));
      if (result.code) {
        newBuffer = Buffer.from(result.code, 'utf8');
      }
    } else if (asset.mimeType === 'text/css') {
      const result = minifyCss(asset.buffer.toString('utf8'));
      newBuffer = Buffer.from(result.css, 'utf8');
    }

    if (newBuffer.length < originalSize) {
      console.log(`    - Minified asset: ${asset.originalFileName} (Size: ${originalSize} -> ${newBuffer.length})`);
    }

    return {
      ...asset,
      buffer: newBuffer,
    };
  }
}
