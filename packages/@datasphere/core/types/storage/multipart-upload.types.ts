/** @fileoverview Types for handling large file uploads in parts. */
import { UUID, ISOTimestamp } from '../common.types';

export interface MultipartUploadSession {
  readonly sessionId: UUID;
  readonly fileId: UUID;
  readonly totalChunks: number;
  readonly chunkSizeMb: number;
  readonly chunksUploaded: number[];
  readonly isCompleted: boolean;
  readonly expiresAt: ISOTimestamp;
}

export interface UploadChunk {
  readonly sessionId: UUID;
  readonly chunkNumber: number;
  readonly data: Buffer; // Or a similar binary type
  readonly checksum: string;
}
