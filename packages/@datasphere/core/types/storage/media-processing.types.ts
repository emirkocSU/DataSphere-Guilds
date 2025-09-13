/** @fileoverview Types for server-side media processing and transformation. */
import { UUID} from '../common.types';

export type ImageFormat = 'JPEG' | 'PNG' | 'WEBP';
export type VideoFormat = 'MP4' | 'HLS' | 'DASH';

export interface MediaProcessingJob {
  readonly jobId: UUID;
  readonly sourceFileId: UUID;
  readonly operations: (ImageProcessingOperation | VideoProcessingOperation)[];
  readonly status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface ImageProcessingOperation {
  readonly type: 'RESIZE' | 'WATERMARK' | 'COMPRESS';
  readonly format: ImageFormat;
  readonly width?: number;
  readonly height?: number;
  readonly quality?: number; // 1-100
}

export interface VideoProcessingOperation {
  readonly type: 'TRANSCODE' | 'THUMBNAIL';
  readonly format: VideoFormat;
  readonly resolution?: string; // e.g., '1080p', '720p'
  readonly bitrateKbps?: number;
}
