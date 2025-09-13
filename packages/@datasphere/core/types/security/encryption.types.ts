/** @fileoverview Types for encryption and key management. */

export type EncryptionAlgorithm = 'AES256' | 'RSA2048';

export interface EncryptionKey {
  readonly keyId: string;
  readonly algorithm: EncryptionAlgorithm;
  readonly publicKey?: string;
  readonly privateKey?: string;
  readonly secretKey?: string;
}

export interface EncryptedData {
  readonly data: string; // Base64 encoded encrypted data
  readonly keyId: string;
  readonly algorithm: EncryptionAlgorithm;
  readonly iv?: string; // Initialization Vector
}
