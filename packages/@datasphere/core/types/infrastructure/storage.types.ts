/** @fileoverview Types for file storage and CDN. */
import { Uuid } from '../../types/common.types';

export type StorageProviderType = 'AWS_S3' | 'GCS' | 'AZURE_BLOB';

export interface StorageConfig {
  readonly storageId: Uuid;
  readonly name: string;
  readonly provider: StorageProviderType;
  readonly bucketName: string;
  readonly region: string;
  readonly cdnEnabled: boolean;
}

export interface FileMetadata {
  readonly fileId: Uuid;
  readonly filename: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly uploadDate: IsoTimestamp;
  readonly url: string;
}
