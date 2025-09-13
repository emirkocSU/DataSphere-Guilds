/** @fileoverview Types for abstracting different cloud storage providers. */

export type StorageProviderType = 'AWS_S3' | 'GCS' | 'AZURE_BLOB';

export interface StorageProviderConfig {
  readonly provider: StorageProviderType;
  readonly region: string;
  readonly bucket: string;
  readonly accessKeyId: string; // This would be a secret reference
}

export interface StorageProvider {
  upload(file: Buffer, destination: string): Promise<{ url: string; etag: string; }>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresInSeconds: number): Promise<string>;
}
