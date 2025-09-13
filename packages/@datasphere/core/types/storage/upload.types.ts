/**
 * @fileoverview Atto-optimized upload types with streaming and chunked processing.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact upload session - 36 bytes
export interface UploadSession {
  readonly sessionId: UUID; // 16 bytes
  readonly fileId: UUID; // 16 bytes
  readonly totalSize: BigInt; // 8 bytes - expected file size
  readonly chunkSize: number; // 4 bytes - chunk size bytes
  readonly status: number; // 1 byte - upload status
  readonly created: number; // 4 bytes - session start
}

// Nano chunk upload - 28 bytes
export interface ChunkUpload {
  readonly chunkId: BigInt; // 8 bytes
  readonly sessionId: UUID; // 16 bytes
  readonly index: number; // 2 bytes - chunk index
  readonly size: number; // 4 bytes - chunk size
  readonly hash: BigInt; // 8 bytes - chunk checksum
}

// Micro upload progress - 16 bytes
export interface UploadProgress {
  readonly sessionId: UUID; // 16 bytes
  readonly uploaded: BigInt; // 8 bytes - bytes uploaded
  readonly speed: number; // 4 bytes - upload speed bps
  readonly eta: number; // 4 bytes - estimated completion
}

// Upload validation result - 12 bytes
export interface UploadValidation {
  readonly sessionId: UUID; // 16 bytes
  readonly isValid: boolean; // 1 byte - validation result
  readonly errorCode: number; // 1 byte - error type
  readonly missingChunks: Uint16Array; // missing chunk indices
}

// Upload metadata - 24 bytes
export interface UploadMetadata {
  readonly sessionId: UUID; // 16 bytes
  readonly filename: BigInt; // 8 bytes - filename hash
  readonly mimeType: number; // 2 bytes - MIME type hash
  readonly encoding: number; // 1 byte - file encoding
  readonly userId: number; // 4 bytes - uploader hash
}

// Resume token - 20 bytes
export interface ResumeToken {
  readonly sessionId: UUID; // 16 bytes
  readonly offset: BigInt; // 8 bytes - resume offset
  readonly expires: number; // 4 bytes - token expiration
}

// Const enums for zero overhead
export const enum UploadStatus {
  INITIALIZING = 0,
  IN_PROGRESS = 1,
  PAUSED = 2,
  COMPLETED = 3,
  FAILED = 4,
  CANCELLED = 5,
  EXPIRED = 6,
  VALIDATING = 7
}

export const enum ChunkStatus {
  PENDING = 0,
  UPLOADING = 1,
  COMPLETED = 2,
  FAILED = 3,
  RETRYING = 4
}

export const enum UploadError {
  NONE = 0,
  SIZE_EXCEEDED = 1,
  INVALID_TYPE = 2,
  CHECKSUM_MISMATCH = 3,
  TIMEOUT = 4,
  NETWORK_ERROR = 5,
  QUOTA_EXCEEDED = 6,
  PERMISSION_DENIED = 7,
  VIRUS_DETECTED = 8,
  CORRUPT_DATA = 9
}

export const enum UploadStrategy {
  SINGLE_PART = 0,
  MULTI_PART = 1,
  RESUMABLE = 2,
  STREAMING = 3,
  PARALLEL = 4
}

export const enum CompressionMode {
  NONE = 0,
  FAST = 1,
  BALANCED = 2,
  MAXIMUM = 3,
  ADAPTIVE = 4
}

// Type aliases for micro-optimization
export type SessionId = UUID;
export type ChunkId = BigInt;
export type FileSize = BigInt;
export type UploadSpeed = number;
export type FilenameHash = BigInt;
export type Timestamp = number;
export type Offset = BigInt;
export type UserId = number;

// Memory-mapped upload storage
export interface UploadStorage {
  readonly buffer: SharedArrayBuffer;
  readonly sessionOffset: number;
  readonly chunkOffset: number;
  readonly progressOffset: number;
  readonly metadataOffset: number;
  readonly validationOffset: number;
}

// High-speed upload processor
export interface UploadProcessor {
  readonly initiate: (metadata: UploadMetadata, strategy: UploadStrategy) => SessionId;
  readonly uploadChunk: (chunk: ChunkUpload, data: ArrayBuffer) => Promise<boolean>;
  readonly finalize: (sessionId: SessionId) => Promise<UploadValidation>;
  readonly cancel: (sessionId: SessionId) => boolean;
  readonly resume: (token: ResumeToken) => UploadSession | null;
  readonly progress: (sessionId: SessionId) => UploadProgress;
}

// Upload stream handler
export interface UploadStream {
  readonly sessionId: SessionId;
  readonly write: (chunk: Uint8Array) => Promise<boolean>;
  readonly end: () => Promise<UploadValidation>;
  readonly abort: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
}

// Parallel upload coordinator
export interface ParallelUpload {
  readonly sessions: readonly SessionId[];
  readonly merge: (sessionIds: readonly SessionId[]) => Promise<UUID>;
  readonly status: () => readonly UploadProgress[];
  readonly cancel: () => Promise<boolean>;
}

// Upload queue entry - 24 bytes
export interface UploadQueueEntry {
  readonly entryId: BigInt; // 8 bytes
  readonly sessionId: SessionId; // 16 bytes
  readonly priority: number; // 1 byte - upload priority
  readonly retries: number; // 1 byte - retry count
  readonly scheduled: Timestamp; // 4 bytes - scheduled time
}

// Upload bandwidth limiter - 12 bytes
export interface BandwidthLimit {
  readonly sessionId: SessionId; // 16 bytes
  readonly maxBps: number; // 4 bytes - max bytes per second
  readonly currentBps: number; // 4 bytes - current speed
}

// Upload statistics - 32 bytes
export interface UploadStats {
  readonly totalSessions: number; // 4 bytes
  readonly activeUploads: number; // 4 bytes
  readonly completedUploads: number; // 4 bytes
  readonly failedUploads: number; // 4 bytes
  readonly totalBandwidth: BigInt; // 8 bytes - total bandwidth used
  readonly avgUploadTime: number; // 4 bytes - average upload duration
  readonly lastUpdate: Timestamp; // 4 bytes
}

// Upload security scan - 16 bytes
export interface SecurityScan {
  readonly scanId: BigInt; // 8 bytes
  readonly sessionId: SessionId; // 16 bytes
  readonly threatLevel: number; // 1 byte - threat assessment
  readonly scanResult: number; // 1 byte - scan outcome
  readonly scanned: Timestamp; // 4 bytes - scan time
}

// Upload retry policy - 8 bytes
export interface RetryPolicy {
  readonly maxRetries: number; // 1 byte - max retry attempts
  readonly baseDelay: number; // 2 bytes - base delay ms
  readonly maxDelay: number; // 2 bytes - max delay ms
  readonly backoffFactor: number; // 2 bytes - backoff multiplier
  readonly strategy: number; // 1 byte - retry strategy
}

// Upload notification - 20 bytes
export interface UploadNotification {
  readonly notificationId: BigInt; // 8 bytes
  readonly sessionId: SessionId; // 16 bytes
  readonly event: number; // 1 byte - notification event
  readonly timestamp: Timestamp; // 4 bytes
}

// Virus scan result - 20 bytes
export interface VirusScanResult {
  readonly scanId: BigInt; // 8 bytes
  readonly sessionId: SessionId; // 16 bytes
  readonly isClean: boolean; // 1 byte - scan result
  readonly engine: number; // 1 byte - scan engine
  readonly signature: number; // 2 bytes - signature version
  readonly scanned: Timestamp; // 4 bytes
}

// Upload analytics aggregate
export interface UploadAnalytics {
  readonly totalUploads: BigInt;
  readonly totalBytes: BigInt;
  readonly successRate: number;
  readonly avgUploadTime: number;
  readonly avgFileSize: number;
  readonly peakBandwidth: number;
  readonly errorDistribution: Map<UploadError, number>;
}

// Zero-allocation upload manager
export interface UploadManager {
  readonly createSession: (metadata: UploadMetadata) => Promise<UploadSession>;
  readonly uploadFile: (session: UploadSession, data: ReadableStream) => Promise<UUID>;
  readonly uploadChunks: (session: UploadSession, chunks: readonly ChunkUpload[]) => Promise<UUID>;
  readonly resumeUpload: (token: ResumeToken) => Promise<UploadSession>;
  readonly cancelUpload: (sessionId: SessionId) => Promise<boolean>;
  readonly getProgress: (sessionId: SessionId) => UploadProgress;
  readonly stats: () => UploadStats;
  readonly analytics: () => UploadAnalytics;
}