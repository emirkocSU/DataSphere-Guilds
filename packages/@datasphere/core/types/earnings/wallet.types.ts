/**
 * @fileoverview Femto-optimized wallet types with bitwise balance tracking.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Nano wallet structure - 24 bytes
export interface Wallet {
  readonly id: UUID; // 16 bytes
  readonly balance: BigInt; // 8 bytes - balance in smallest unit
}

// Compressed transaction - 16 bytes
export interface WalletTx {
  readonly amount: BigInt; // 8 bytes - transaction amount
  readonly type: number; // 1 byte - transaction type
  readonly status: number; // 1 byte - transaction status
  readonly timestamp: number; // 4 bytes - unix timestamp
  readonly flags: number; // 2 bytes - transaction flags
}

// Micro balance snapshot - 12 bytes
export interface BalanceSnapshot {
  readonly balance: BigInt; // 8 bytes - balance at snapshot
  readonly timestamp: number; // 4 bytes - snapshot time
}

// Wallet metadata - 8 bytes
export interface WalletMeta {
  readonly created: number; // 4 bytes - creation timestamp
  readonly lastTx: number; // 4 bytes - last transaction time
}

// Transaction queue entry - 20 bytes
export interface TxQueueEntry {
  readonly txId: BigInt; // 8 bytes - transaction ID
  readonly priority: number; // 1 byte - processing priority
  readonly retries: number; // 1 byte - retry count
  readonly scheduled: number; // 4 bytes - scheduled execution
  readonly expires: number; // 4 bytes - expiration time
  readonly checksum: number; // 2 bytes - integrity check
}

// Balance lock for concurrent safety - 16 bytes
export interface BalanceLock {
  readonly userId: number; // 4 bytes - user hash
  readonly amount: BigInt; // 8 bytes - locked amount
  readonly expires: number; // 4 bytes - lock expiration
}

// Const enums for zero overhead
export const enum TxType {
  CREDIT = 0,
  DEBIT = 1,
  TRANSFER_IN = 2,
  TRANSFER_OUT = 3,
  FREEZE = 4,
  UNFREEZE = 5,
  FEE = 6,
  REFUND = 7
}

export const enum TxStatus {
  QUEUED = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  CANCELLED = 4,
  EXPIRED = 5
}

export const enum TxFlag {
  INSTANT = 1 << 0,
  REVERSIBLE = 1 << 1,
  RECURRING = 1 << 2,
  INTERNAL = 1 << 3,
  EXTERNAL = 1 << 4,
  FEE_EXEMPT = 1 << 5,
  HIGH_VALUE = 1 << 6,
  REQUIRES_APPROVAL = 1 << 7
}

export const enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

// Type aliases for ultra-performance
export type WalletId = UUID;
export type UserId = number;
export type Amount = BigInt;
export type Balance = BigInt;
export type Timestamp = number;
export type TxId = BigInt;
export type Checksum = number;
export type Flags = number;

// Memory-mapped wallet storage
export interface WalletStorage {
  readonly buffer: SharedArrayBuffer;
  readonly walletOffset: number;
  readonly txOffset: number;
  readonly snapshotOffset: number;
  readonly metaOffset: number;
  readonly queueOffset: number;
  readonly lockOffset: number;
}

// Atomic balance operations
export interface BalanceOps {
  readonly credit: (userId: UserId, amount: Amount) => boolean;
  readonly debit: (userId: UserId, amount: Amount) => boolean;
  readonly transfer: (from: UserId, to: UserId, amount: Amount) => boolean;
  readonly freeze: (userId: UserId, amount: Amount) => boolean;
  readonly unfreeze: (userId: UserId, amount: Amount) => boolean;
  readonly checkBalance: (userId: UserId) => Balance;
}

// High-speed transaction processor
export interface TxProcessor {
  readonly submit: (tx: WalletTx) => TxId;
  readonly execute: (txId: TxId) => TxStatus;
  readonly cancel: (txId: TxId) => boolean;
  readonly status: (txId: TxId) => TxStatus;
  readonly batch: (txs: readonly WalletTx[]) => readonly TxId[];
}

// Lock manager for concurrent access
export interface LockManager {
  readonly acquire: (userId: UserId, amount: Amount, duration: number) => boolean;
  readonly release: (userId: UserId, amount: Amount) => boolean;
  readonly extend: (userId: UserId, duration: number) => boolean;
  readonly check: (userId: UserId) => Amount; // locked amount
}

// Wallet index for fast lookups - 12 bytes per entry
export interface WalletIndex {
  readonly userId: UserId; // 4 bytes - user hash
  readonly walletOffset: number; // 4 bytes - storage offset
  readonly lastModified: Timestamp; // 4 bytes - last update
}

// Transaction log for audit - 32 bytes per entry
export interface TxLog {
  readonly timestamp: Timestamp; // 4 bytes
  readonly userId: UserId; // 4 bytes
  readonly txType: TxType; // 1 byte
  readonly amount: BigInt; // 8 bytes
  readonly balanceBefore: BigInt; // 8 bytes
  readonly balanceAfter: BigInt; // 8 bytes
  readonly checksum: number; // 4 bytes - integrity check
}

// Wallet statistics - 32 bytes
export interface WalletStats {
  readonly totalWallets: number; // 4 bytes
  readonly totalBalance: Amount; // 8 bytes
  readonly totalTxs: number; // 4 bytes
  readonly avgBalance: number; // 4 bytes
  readonly txRate: number; // 4 bytes - transactions per second
  readonly errorRate: number; // 4 bytes - error percentage
  readonly lastUpdate: Timestamp; // 4 bytes
}

// Balance history for analytics - 16 bytes per point
export interface BalanceHistory {
  readonly timestamp: Timestamp; // 4 bytes
  readonly balance: BigInt; // 8 bytes
  readonly delta: number; // 4 bytes - change from previous
}

// Wallet security context - 8 bytes
export interface SecurityContext {
  readonly accessLevel: number; // 1 byte - security level
  readonly permissions: number; // 2 bytes - permission bits
  readonly sessionId: number; // 4 bytes - session hash
  readonly expires: number; // 4 bytes - context expiration
}

// Transaction limits - 24 bytes
export interface TxLimits {
  readonly dailyLimit: Amount; // 8 bytes
  readonly txLimit: Amount; // 8 bytes
  readonly dailyUsed: Amount; // 8 bytes
}

// Wallet backup data - 20 bytes
export interface WalletBackup {
  readonly backupId: BigInt; // 8 bytes
  readonly dataHash: BigInt; // 8 bytes
  readonly timestamp: Timestamp; // 4 bytes
}

// Fast balance cache entry - 16 bytes
export interface BalanceCache {
  readonly userId: UserId; // 4 bytes
  readonly balance: Balance; // 8 bytes
  readonly lastUpdate: Timestamp; // 4 bytes
}

// Wallet event for real-time updates - 24 bytes
export interface WalletEvent {
  readonly eventId: BigInt; // 8 bytes
  readonly userId: UserId; // 4 bytes
  readonly eventType: number; // 1 byte
  readonly amount: BigInt; // 8 bytes
  readonly timestamp: Timestamp; // 4 bytes
}

// Zero-allocation wallet manager
export interface WalletManager {
  readonly create: (userId: UserId) => WalletId;
  readonly get: (userId: UserId) => Wallet | null;
  readonly update: (userId: UserId, tx: WalletTx) => boolean;
  readonly delete: (userId: UserId) => boolean;
  readonly backup: (userId: UserId) => WalletBackup;
  readonly restore: (backup: WalletBackup) => boolean;
  readonly stats: () => WalletStats;
}

// Micro transaction validator
export interface TxValidator {
  readonly validate: (tx: WalletTx, context: SecurityContext) => boolean;
  readonly checkLimits: (userId: UserId, amount: Amount) => boolean;
  readonly estimateFee: (tx: WalletTx) => Amount;
  readonly priority: (tx: WalletTx) => Priority;
}

// Balance reconciliation - 16 bytes
export interface BalanceReconciliation {
  readonly userId: UserId; // 4 bytes
  readonly expected: Balance; // 8 bytes
  readonly actual: Balance; // 8 bytes
  readonly variance: number; // 4 bytes - difference
}

// Wallet performance metrics
export interface WalletMetrics {
  readonly throughput: number; // transactions per second
  readonly latency: number; // average operation latency
  readonly memoryUsage: number; // bytes used
  readonly cacheHitRate: number; // cache efficiency
  readonly lockContention: number; // lock wait time
  readonly errorRate: number; // operation error rate
}