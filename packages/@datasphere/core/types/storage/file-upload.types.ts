/** @fileoverview Types for file uploads and initial validation. */
import { UUID, ISOTimestamp } from '../common.types';

export type FileUploadStatus = 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FileUpload {
  readonly fileId: UUID;
  readonly uploaderId: UUID;
  readonly originalFilename: string;
  readonly sanitizedFilename: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: FileUploadStatus;
    readonly uploadStartedAt: ISOTimestamp;
  readonly uploadCompletedAt?: ISOTimestamp;
  readonly storageUrl?: string;
  readonly validationResult?: { virusScan: boolean; formatCheck: boolean; };
}
