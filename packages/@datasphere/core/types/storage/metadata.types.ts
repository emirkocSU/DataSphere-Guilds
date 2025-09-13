/**
 * @fileoverview Zepto-optimized metadata types with binary-packed indexing.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact metadata record - 32 bytes
export interface MetadataRecord {
  readonly id: UUID; // 16 bytes
  readonly fileId: UUID; // 16 bytes
  readonly type: number; // 1 byte - metadata type
  readonly format: number; // 1 byte - data format
  readonly size: number; // 4 bytes - metadata size
  readonly checksum: BigInt; // 8 bytes - integrity hash
  readonly created: number; // 4 bytes - creation time
}

// Nano metadata index - 24 bytes
export interface MetadataIndex {
  readonly fileId: UUID; // 16 bytes
  readonly nameHash: BigInt; // 8 bytes - property name hash
  readonly valueHash: BigInt; // 8 bytes - value hash
  readonly dataType: number; // 1 byte - value data type
  readonly indexed: number; // 4 bytes - index time
}

// Micro search result - 20 bytes
export interface SearchResult {
  readonly fileId: UUID; // 16 bytes
  readonly score: number; // 4 bytes - relevance score
  readonly matches: number; // 2 bytes - match count
  readonly rank: number; // 2 bytes - result rank
}

// Compact tag entry - 16 bytes
export interface TagEntry {
  readonly fileId: UUID; // 16 bytes
  readonly tagHash: BigInt; // 8 bytes - tag name hash
  readonly weight: number; // 2 bytes - tag weight
  readonly applied: number; // 4 bytes - tag application time
}

// File classification - 12 bytes
export interface FileClassification {
  readonly fileId: UUID; // 16 bytes
  readonly category: number; // 2 bytes - primary category
  readonly subcategory: number; // 2 bytes - secondary category
  readonly confidence: number; // 2 bytes - classification confidence
  readonly classifier: number; // 1 byte - classifier version
}

// Content analysis result - 28 bytes
export interface ContentAnalysis {
  readonly fileId: UUID; // 16 bytes
  readonly language: number; // 2 bytes - detected language
  readonly sentiment: number; // 2 bytes - sentiment score
  readonly complexity: number; // 2 bytes - content complexity
  readonly readability: number; // 2 bytes - readability score
  readonly keywords: BigUint64Array; // keyword hashes
  readonly analyzed: number; // 4 bytes - analysis time
}

// Const enums for zero overhead
export const enum MetadataType {
  EXIF = 0,
  IPTC = 1,
  XMP = 2,
  CUSTOM = 3,
  SYSTEM = 4,
  USER = 5,
  AUTO_GENERATED = 6,
  EXTRACTED = 7
}

export const enum DataFormat {
  STRING = 0,
  NUMBER = 1,
  BOOLEAN = 2,
  DATE = 3,
  BINARY = 4,
  JSON = 5,
  XML = 6,
  COMPRESSED = 7
}

export const enum DataType {
  TEXT = 0,
  INTEGER = 1,
  FLOAT = 2,
  DATETIME = 3,
  BOOLEAN = 4,
  ARRAY = 5,
  OBJECT = 6,
  BINARY = 7
}

export const enum FileCategory {
  DOCUMENT = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  CODE = 4,
  DATA = 5,
  ARCHIVE = 6,
  EXECUTABLE = 7
}

export const enum Language {
  UNKNOWN = 0,
  ENGLISH = 1,
  SPANISH = 2,
  FRENCH = 3,
  GERMAN = 4,
  ITALIAN = 5,
  PORTUGUESE = 6,
  RUSSIAN = 7,
  CHINESE = 8,
  JAPANESE = 9,
  KOREAN = 10,
  ARABIC = 11
}

export const enum SearchMode {
  EXACT = 0,
  FUZZY = 1,
  SEMANTIC = 2,
  PHONETIC = 3,
  REGEX = 4,
  WILDCARD = 5
}

// Type aliases for micro-optimization
export type MetadataId = UUID;
export type FileId = UUID;
export type PropertyHash = BigInt;
export type ValueHash = BigInt;
export type TagHash = BigInt;
export type KeywordHash = BigInt;
export type Timestamp = number;
export type Score = number;
export type Weight = number;
export type Confidence = number;

// Memory-mapped metadata storage
export interface MetadataStorage {
  readonly buffer: SharedArrayBuffer;
  readonly recordOffset: number;
  readonly indexOffset: number;
  readonly tagOffset: number;
  readonly classificationOffset: number;
  readonly analysisOffset: number;
}

// High-speed metadata operations
export interface MetadataOperations {
  readonly create: (record: MetadataRecord) => MetadataId;
  readonly read: (id: MetadataId) => MetadataRecord | null;
  readonly update: (id: MetadataId, changes: Partial<MetadataRecord>) => boolean;
  readonly delete: (id: MetadataId) => boolean;
  readonly search: (query: MetadataQuery) => readonly SearchResult[];
  readonly index: (fileId: FileId) => boolean;
}

// Metadata query builder - 16 bytes
export interface MetadataQuery {
  readonly queryId: BigInt; // 8 bytes
  readonly terms: readonly PropertyHash[]; // search terms
  readonly mode: SearchMode; // 1 byte - search mode
  readonly limit: number; // 2 bytes - result limit
  readonly offset: number; // 2 bytes - result offset
  readonly timeout: number; // 2 bytes - query timeout ms
}

// Auto-extraction engine
export interface MetadataExtractor {
  readonly extract: (fileId: FileId, type: MetadataType) => Promise<MetadataRecord>;
  readonly classify: (fileId: FileId) => Promise<FileClassification>;
  readonly analyze: (fileId: FileId) => Promise<ContentAnalysis>;
  readonly generateTags: (fileId: FileId) => Promise<readonly TagEntry[]>;
}

// Metadata validation result - 8 bytes
export interface ValidationResult {
  readonly recordId: MetadataId; // 16 bytes
  readonly isValid: boolean; // 1 byte - validation result
  readonly errorCode: number; // 1 byte - error type
  readonly errorCount: number; // 2 bytes - total errors
  readonly validated: Timestamp; // 4 bytes - validation time
}

// Metadata synchronization - 20 bytes
export interface MetadataSync {
  readonly syncId: BigInt; // 8 bytes
  readonly recordId: MetadataId; // 16 bytes
  readonly lastSync: Timestamp; // 4 bytes
  readonly status: number; // 1 byte - sync status
}

// Metadata cache entry - 24 bytes
export interface MetadataCache {
  readonly key: PropertyHash; // 8 bytes
  readonly data: ArrayBuffer; // cached metadata
  readonly expires: Timestamp; // 4 bytes - cache expiration
  readonly hits: number; // 4 bytes - cache hit count
  readonly lastAccess: Timestamp; // 4 bytes - last access
}

// Schema definition - 20 bytes
export interface MetadataSchema {
  readonly schemaId: BigInt; // 8 bytes
  readonly version: number; // 2 bytes - schema version
  readonly fields: readonly SchemaField[]; // field definitions
  readonly created: Timestamp; // 4 bytes - schema creation
  readonly isActive: boolean; // 1 byte - schema status
}

// Schema field definition - 12 bytes
export interface SchemaField {
  readonly fieldId: number; // 4 bytes - field identifier
  readonly nameHash: PropertyHash; // 8 bytes - field name hash
  readonly dataType: DataType; // 1 byte - field data type
  readonly required: boolean; // 1 byte - required flag
  readonly indexed: boolean; // 1 byte - indexed flag
}

// Metadata statistics
export interface MetadataStats {
  readonly totalRecords: number;
  readonly totalSize: BigInt;
  readonly indexSize: BigInt;
  readonly searchLatency: number;
  readonly hitRate: number;
  readonly errorRate: number;
}

// Full-text search index - 16 bytes per term
export interface SearchIndex {
  readonly termHash: PropertyHash; // 8 bytes
  readonly frequency: number; // 4 bytes - term frequency
  readonly documents: Uint32Array; // document IDs containing term
}

// Metadata relationship - 24 bytes
export interface MetadataRelation {
  readonly relationId: BigInt; // 8 bytes
  readonly sourceId: MetadataId; // 16 bytes
  readonly targetId: MetadataId; // 16 bytes
  readonly relationType: number; // 1 byte - relation type
  readonly strength: number; // 2 bytes - relationship strength
  readonly created: Timestamp; // 4 bytes
}

// Content fingerprint - 20 bytes
export interface ContentFingerprint {
  readonly fileId: FileId; // 16 bytes
  readonly perceptualHash: BigInt; // 8 bytes - perceptual hash
  readonly similarity: number; // 2 bytes - similarity threshold
  readonly algorithm: number; // 1 byte - hash algorithm
}

// Metadata versioning - 24 bytes
export interface MetadataVersion {
  readonly versionId: BigInt; // 8 bytes
  readonly recordId: MetadataId; // 16 bytes
  readonly version: number; // 2 bytes - version number
  readonly changes: BigInt; // 8 bytes - change summary hash
  readonly created: Timestamp; // 4 bytes
}

// Zero-allocation metadata manager
export interface MetadataManager {
  readonly store: (record: MetadataRecord) => Promise<MetadataId>;
  readonly retrieve: (id: MetadataId) => Promise<MetadataRecord>;
  readonly search: (query: MetadataQuery) => Promise<readonly SearchResult[]>;
  readonly extract: (fileId: FileId, types: readonly MetadataType[]) => Promise<readonly MetadataRecord[]>;
  readonly classify: (fileId: FileId) => Promise<FileClassification>;
  readonly index: (fileId: FileId) => Promise<boolean>;
  readonly validate: (recordId: MetadataId) => Promise<ValidationResult>;
  readonly stats: () => MetadataStats;
}