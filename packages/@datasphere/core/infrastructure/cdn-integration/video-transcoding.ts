
import { IAssetProcessingStep, Asset, AssetType } from './asset-pipeline';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { join, parse } from 'path';
import { promises as fs } from 'fs';

/**
 * Configuration for a single video output format.
 */
export interface VideoOutputFormat {
  resolution: string; // e.g., '1920x1080', '1280x720'
  bitrate: string; // e.g., '5000k', '2500k'
  audioBitrate?: string; // e.g., '192k', '128k'
}

/**
 * Configuration for the video transcoding step.
 */
export interface VideoTranscodingConfig {
  formats: VideoOutputFormat[];
  outputType: 'mp4' | 'hls';
}

/**
 * An asset processing step that transcodes videos using FFmpeg.
 * This requires FFmpeg to be installed on the system where the code is running.
 * @class VideoTranscodingStep
 * @implements {IAssetProcessingStep}
 */
export class VideoTranscodingStep implements IAssetProcessingStep {
  constructor(private config: VideoTranscodingConfig) {}

  public async process(asset: Asset): Promise<Asset> {
    if (asset.type !== 'video') {
      return asset;
    }

    const tempInputPath = join(tmpdir(), `input_${asset.originalFileName}`);
    const outputDir = join(tmpdir(), `output_${parse(asset.originalFileName).name}`);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(tempInputPath, asset.buffer);

    console.log(`    - Starting video transcoding for ${asset.originalFileName}...`);

    try {
      for (const format of this.config.formats) {
        await this.runFfmpeg(tempInputPath, outputDir, format);
      }

      // For simplicity, this example returns the original buffer.
      // A real implementation would package the HLS/DASH files or return multiple MP4 assets.
      console.log(`    - Video transcoding finished for ${asset.originalFileName}.`);
      return asset;

    } finally {
      // Clean up temporary files
      await fs.unlink(tempInputPath).catch(e => console.error("Failed to delete temp input file", e));
      await fs.rm(outputDir, { recursive: true, force: true }).catch(e => console.error("Failed to delete temp output dir", e));
    }
  }

  private runFfmpeg(inputPath: string, outputDir: string, format: VideoOutputFormat): Promise<void> {
    return new Promise((resolve, reject) => {
      const outputFileName = `${parse(inputPath).name}_${format.resolution}.mp4`;
      const outputPath = join(outputDir, outputFileName);

      const args = [
        '-i', inputPath,
        '-vf', `scale=${format.resolution}`,
        '-b:v', format.bitrate,
        '-c:a', 'aac',
        '-b:a', format.audioBitrate || '128k',
        '-y', // Overwrite output file if it exists
        outputPath,
      ];

      const ffmpeg = spawn('ffmpeg', args);

      ffmpeg.stdout.on('data', data => console.log(`FFMPEG stdout: ${data}`));
      ffmpeg.stderr.on('data', data => console.error(`FFMPEG stderr: ${data}`));

      ffmpeg.on('close', code => {
        if (code === 0) {
          console.log(`    - Transcoded to ${format.resolution} successfully.`);
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });

      ffmpeg.on('error', err => {
        reject(err);
      });
    });
  }
}
