/**
 * @fileoverview Micro-optimized evidence types with binary serialization.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact evidence header - 32 bytes total
export interface EvidenceHeader {
  readonly id: UUID; // 16 bytes
  readonly type: number; // 1 byte - EvidenceType enum
  readonly status: number; // 1 byte - ValidationStatus enum  
  readonly size: number; // 4 bytes - content size
  readonly hash: number; // 4 bytes - FNV-1a hash
  readonly flags: number; // 2 bytes - bit flags
  readonly userId: number; // 4 bytes - user hash
}

// Binary evidence content - zero-copy design
export interface EvidenceContent {
  readonly buffer: ArrayBuffer;
  readonly offset: number;
  readonly length: number;
  readonly checksum: number;
}

// Minimal metadata - 16 bytes
export interface EvidenceMeta {
  readonly created: number; // 4 bytes - unix timestamp
  readonly expires: number; // 4 bytes - unix timestamp
  readonly priority: number; // 1 byte
  readonly category: number; // 1 byte
  readonly encoding: number; // 1 byte
  readonly compression: number; // 1 byte
  readonly reserved: number; // 4 bytes
}

// Compact validation result - 8 bytes
export interface ValidationResult {
  readonly score: number; // 2 bytes - 0-65535 (divide by 655.35 for 0-100)
  readonly confidence: number; // 2 bytes - 0-65535 
  readonly flags: number; // 2 bytes - validation flags
  readonly validator: number; // 2 bytes - validator ID
}

// Ultra-lean chain of custody - 24 bytes per entry
export interface CustodyEntry {
  readonly timestamp: number; // 4 bytes - unix timestamp
  readonly actor: number; // 4 bytes - actor hash
  readonly action: number; // 1 byte - action enum
  readonly location: number; // 4 bytes - location hash
  readonly signature: BigInt; // 8 bytes - ed25519 signature hash
  readonly nonce: number; // 3 bytes - anti-replay
}

// Memory-mapped evidence store
export interface EvidenceStore {
  readonly sharedBuffer: SharedArrayBuffer;
  readonly headerOffset: number;
  readonly contentOffset: number;
  readonly metaOffset: number;
  readonly indexOffset: number;
}

// Fast lookup index - 16 bytes per entry
export interface EvidenceIndex {
  readonly id: BigInt; // 8 bytes - evidence ID as bigint
  readonly offset: number; // 4 bytes - buffer offset
  readonly size: number; // 4 bytes - content size
}

// Const enums for zero runtime overhead
export const enum EvidenceType {
  IMAGE = 0,
  VIDEO = 1,
  AUDIO = 2,
  DOCUMENT = 3,
  LOG = 4,
  FORENSIC = 5,
  WITNESS = 6,
  SYSTEM = 7
}

export const enum ValidationStatus {
  PENDING = 0,
  VALID = 1,
  INVALID = 2,
  CORRUPTED = 3,
  EXPIRED = 4,
  QUARANTINED = 5
}

export const enum EvidenceFlag {
  ENCRYPTED = 1 << 0,
  COMPRESSED = 1 << 1,
  SIGNED = 1 << 2,
  TIMESTAMPED = 1 << 3,
  IMMUTABLE = 1 << 4,
  VERIFIED = 1 << 5,
  SEALED = 1 << 6,
  ARCHIVED = 1 << 7
}

export const enum ActionType {
  CREATE = 0,
  ACCESS = 1,
  MODIFY = 2,
  VERIFY = 3,
  TRANSFER = 4,
  ARCHIVE = 5,
  DELETE = 6,
  SEAL = 7
}

export const enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
  CRITICAL = 4
}

export const enum Encoding {
  RAW = 0,
  UTF8 = 1,
  BASE64 = 2,
  HEX = 3,
  BINARY = 4
}

export const enum Compression {
  NONE = 0,
  GZIP = 1,
  BROTLI = 2,
  LZ4 = 3,
  ZSTD = 4
}

// Type aliases for performance
export type EvidenceId = BigInt;
export type Hash = number;
export type Timestamp = number;
export type ActorId = number;
export type LocationId = number;
export type Signature = BigInt;
export type Nonce = number;
export type Score = number;
export type Confidence = number;
export type Offset = number;
export type Size = number;

// Fast operations interface
export interface EvidenceOps {
  readonly serialize: (evidence: EvidenceHeader) => Uint8Array;
  readonly deserialize: (data: Uint8Array) => EvidenceHeader;
  readonly validate: (content: EvidenceContent) => ValidationResult;
  readonly hash: (data: ArrayBuffer) => Hash;
  readonly compress: (data: ArrayBuffer, type: Compression) => ArrayBuffer;
  readonly decompress: (data: ArrayBuffer, type: Compression) => ArrayBuffer;
}

// Batch operations for performance
export interface BatchEvidence {
  readonly headers: readonly EvidenceHeader[];
  readonly contents: readonly EvidenceContent[];
  readonly metas: readonly EvidenceMeta[];
  readonly totalSize: number;
  readonly batchHash: Hash;
}

// Stream processing for large evidence
export interface EvidenceStream {
  readonly id: EvidenceId;
  readonly chunkSize: number;
  readonly totalChunks: number;
  readonly currentChunk: number;
  readonly streamHash: Hash;
  readonly integrity: boolean;
}

// Zero-copy slice for partial access
export interface EvidenceSlice {
  readonly parent: EvidenceId;
  readonly start: Offset;
  readonly end: Offset;
  readonly view: DataView;
  readonly readonly: boolean;
}

// Performance monitoring
export interface EvidenceMetrics {
  readonly accessCount: number;
  readonly lastAccess: Timestamp;
  readonly bandwidth: number; // bytes/sec
  readonly latency: number; // microseconds
  readonly errorRate: number; // 0-1
}