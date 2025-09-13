import { z } from 'zod';

// Define the types of assets we can process
export const AssetTypeSchema = z.enum(['image', 'video', 'raw']);
export type AssetType = z.infer<typeof AssetTypeSchema>;

// Define the structure of an asset to be processed
export interface Asset {
  type: AssetType;
  buffer: Buffer;
  originalFileName: string;
  mimeType: string;
}

// Define the interface for a single step in the processing pipeline
export interface IAssetProcessingStep {
  process(asset: Asset): Promise<Asset>;
}

/**
 * Manages a sequence of processing steps for a given asset.
 * This class allows for the creation of flexible and reusable asset transformation workflows.
 * @class AssetPipeline
 */
export class AssetPipeline {
  private steps: IAssetProcessingStep[] = [];

  constructor(initialSteps: IAssetProcessingStep[] = []) {
    this.steps = initialSteps;
  }

  /**
   * Adds a new processing step to the pipeline.
   * @param {IAssetProcessingStep} step - The step to add.
   * @returns {this} The pipeline instance for chaining.
   */
  public addStep(step: IAssetProcessingStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Executes the pipeline for a given asset.
   * The asset is passed through each step in the order they were added.
   * @param {Asset} initialAsset - The asset to process.
   * @returns {Promise<Asset>} The processed asset.
   */
  public async execute(initialAsset: Asset): Promise<Asset> {
    let currentAsset = initialAsset;

    console.log(`🚀 Starting asset pipeline for: ${initialAsset.originalFileName}`);

    for (const step of this.steps) {
      try {
        const stepName = step.constructor.name;
        console.log(`  -> Executing step: ${stepName}`);
        currentAsset = await step.process(currentAsset);
      } catch (error) {
        console.error(`❌ Error in pipeline step ${step.constructor.name}:`, error);
        throw new Error(`Asset processing failed at step: ${step.constructor.name}`);
      }
    }

    console.log(`✅ Asset pipeline completed for: ${initialAsset.originalFileName}`);
    return currentAsset;
  }
}