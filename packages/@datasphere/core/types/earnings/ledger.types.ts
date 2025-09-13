/**
 * @fileoverview Nano-optimized ledger types with immutable blockchain-like structure.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact ledger entry - 32 bytes
export interface LedgerEntry {
  readonly id: UUID; // 16 bytes
  readonly amount: BigInt; // 8 bytes - precise monetary value
  readonly type: number; // 1 byte - TransactionType enum
  readonly status: number; // 1 byte - TransactionStatus enum
  readonly timestamp: number; // 4 bytes - unix timestamp
  readonly blockIndex: number; // 2 bytes - block position
}

// Minimal transaction record - 40 bytes
export interface Transaction {
  readonly txId: UUID; // 16 bytes
  readonly fromUser: number; // 4 bytes - user hash
  readonly toUser: number; // 4 bytes - user hash
  readonly amount: BigInt; // 8 bytes - amount in smallest unit
  readonly fee: number; // 4 bytes - transaction fee
  readonly nonce: number; // 4 bytes - anti-replay
}

// Compact ledger block - blockchain-inspired
export interface LedgerBlock {
  readonly index: number; // 4 bytes - block number
  readonly timestamp: number; // 4 bytes - block timestamp
  readonly prevHash: BigInt; // 8 bytes - previous block hash
  readonly merkleRoot: BigInt; // 8 bytes - merkle root of transactions
  readonly txCount: number; // 2 bytes - transaction count
  readonly dataHash: BigInt; // 8 bytes - block data hash
}

// Fast balance lookup - 24 bytes per user
export interface UserBalance {
  readonly userId: number; // 4 bytes - user hash
  readonly available: BigInt; // 8 bytes - available balance
  readonly pending: BigInt; // 8 bytes - pending transactions
  readonly lastUpdate: number; // 4 bytes - last update timestamp
}

// Earnings calculation result - 16 bytes
export interface EarningsCalc {
  readonly baseAmount: number; // 4 bytes - base earnings
  readonly qualityBonus: number; // 4 bytes - quality multiplier
  readonly penaltyAmount: number; // 4 bytes - penalties applied
  readonly netAmount: number; // 4 bytes - final net amount
}

// Payment processing - 20 bytes
export interface PaymentRecord {
  readonly paymentId: BigInt; // 8 bytes - payment identifier
  readonly method: number; // 1 byte - payment method enum
  readonly status: number; // 1 byte - payment status enum
  readonly amount: BigInt; // 8 bytes - payment amount
  readonly timestamp: number; // 4 bytes - processing time
}

// Const enums for zero runtime overhead
export const enum TransactionType {
  EARN = 0,
  SPEND = 1,
  TRANSFER = 2,
  BONUS = 3,
  PENALTY = 4,
  REFUND = 5,
  FEE = 6,
  ADJUSTMENT = 7
}

export const enum TransactionStatus {
  PENDING = 0,
  CONFIRMED = 1,
  FAILED = 2,
  CANCELLED = 3,
  EXPIRED = 4,
  DISPUTED = 5
}

export const enum PaymentMethod {
  BANK_TRANSFER = 0,
  PAYPAL = 1,
  STRIPE = 2,
  CRYPTO = 3,
  WALLET = 4,
  CHECK = 5,
  WIRE = 6,
  ACH = 7
}

export const enum PaymentStatus {
  INITIATED = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  REFUNDED = 4,
  DISPUTED = 5,
  CANCELLED = 6,
  EXPIRED = 7
}

export const enum CurrencyCode {
  USD = 0,
  EUR = 1,
  GBP = 2,
  JPY = 3,
  BTC = 4,
  ETH = 5,
  USDC = 6,
  POINTS = 7
}

// Type aliases for performance
export type TxId = UUID;
export type UserId = number;
export type Amount = BigInt;
export type Timestamp = number;
export type BlockIndex = number;
export type Hash = BigInt;
export type Nonce = number;
export type Fee = number;

// Memory-mapped ledger storage
export interface LedgerStorage {
  readonly buffer: SharedArrayBuffer;
  readonly entryOffset: number;
  readonly blockOffset: number;
  readonly balanceOffset: number;
  readonly indexOffset: number;
}

// Fast transaction index - 16 bytes per entry
export interface TxIndex {
  readonly txId: BigInt; // 8 bytes - transaction ID as bigint
  readonly blockIndex: number; // 4 bytes - block number
  readonly entryIndex: number; // 4 bytes - entry position in block
}

// Immutable state snapshot
export interface LedgerSnapshot {
  readonly height: BlockIndex; // current block height
  readonly stateRoot: Hash; // state merkle root
  readonly timestamp: Timestamp; // snapshot time
  readonly totalSupply: Amount; // total currency in circulation
  readonly userCount: number; // active users
}

// Batch operations for performance
export interface TransactionBatch {
  readonly transactions: readonly Transaction[];
  readonly batchId: BigInt;
  readonly totalAmount: Amount;
  readonly batchHash: Hash;
  readonly timestamp: Timestamp;
}

// Audit-friendly transaction log
export interface AuditLog {
  readonly logId: BigInt; // 8 bytes
  readonly action: number; // 1 byte - action type
  readonly actor: UserId; // 4 bytes - who performed action
  readonly target: TxId; // 16 bytes - transaction affected
  readonly timestamp: Timestamp; // 4 bytes
  readonly checksum: Hash; // 8 bytes - integrity check
}

// Performance metrics
export interface LedgerMetrics {
  readonly tps: number; // transactions per second
  readonly blockTime: number; // average block creation time
  readonly confirmationTime: number; // average confirmation time
  readonly memoryUsage: number; // bytes used
  readonly diskUsage: number; // bytes on disk
  readonly errorRate: number; // transaction error rate
}

// Zero-copy transaction validation
export interface TxValidator {
  readonly validate: (tx: Transaction) => boolean;
  readonly estimateFee: (tx: Transaction) => Fee;
  readonly checkBalance: (userId: UserId, amount: Amount) => boolean;
  readonly getNonce: (userId: UserId) => Nonce;
}

// Optimized balance operations
export interface BalanceOps {
  readonly credit: (userId: UserId, amount: Amount) => boolean;
  readonly debit: (userId: UserId, amount: Amount) => boolean;
  readonly transfer: (from: UserId, to: UserId, amount: Amount) => boolean;
  readonly freeze: (userId: UserId, amount: Amount) => boolean;
  readonly unfreeze: (userId: UserId, amount: Amount) => boolean;
}

// Fast merkle tree for integrity
export interface MerkleNode {
  readonly hash: Hash; // 8 bytes
  readonly left: number; // 4 bytes - left child index
  readonly right: number; // 4 bytes - right child index
  readonly level: number; // 1 byte - tree level
}

// Compact proof structure
export interface MerkleProof {
  readonly leaf: Hash; // 8 bytes - leaf hash
  readonly path: BigUint64Array; // proof path hashes
  readonly indices: Uint32Array; // path indices
  readonly root: Hash; // 8 bytes - tree root
}

// Settlement batch for payments
export interface SettlementBatch {
  readonly batchId: BigInt; // 8 bytes
  readonly payments: readonly PaymentRecord[]; // payment records
  readonly totalAmount: Amount; // total settlement amount
  readonly currency: CurrencyCode; // settlement currency
  readonly provider: string; // payment provider
  readonly status: PaymentStatus; // batch status
  readonly timestamp: Timestamp; // settlement time
}

// Exchange rate for multi-currency
export interface ExchangeRate {
  readonly from: CurrencyCode; // 1 byte
  readonly to: CurrencyCode; // 1 byte
  readonly rate: number; // 8 bytes - exchange rate
  readonly timestamp: Timestamp; // 4 bytes - rate timestamp
  readonly source: string; // rate source/provider
}

// Tax calculation result
export interface TaxCalculation {
  readonly grossAmount: Amount; // gross earnings
  readonly taxableAmount: Amount; // taxable portion
  readonly taxRate: number; // applicable tax rate
  readonly taxAmount: Amount; // tax owed
  readonly netAmount: Amount; // amount after tax
  readonly jurisdiction: string; // tax jurisdiction
}

// Financial reporting aggregate
export interface FinancialReport {
  readonly userId: UserId; // 4 bytes
  readonly period: number; // 4 bytes - reporting period
  readonly totalEarned: Amount; // 8 bytes - total earnings
  readonly totalPaid: Amount; // 8 bytes - total payments
  readonly taxesOwed: Amount; // 8 bytes - tax liability
  readonly balanceEOD: Amount; // 8 bytes - end of period balance
}

// Stream processing for real-time updates
export interface EarningsStream {
  readonly streamId: BigInt; // 8 bytes
  readonly userId: UserId; // 4 bytes
  readonly events: readonly EarningsEvent[]; // earning events
  readonly watermark: Timestamp; // processing watermark
  readonly checkpointHash: Hash; // stream checkpoint
}

// Micro earnings event - 20 bytes
export interface EarningsEvent {
  readonly eventId: BigInt; // 8 bytes
  readonly amount: Amount; // 8 bytes
  readonly source: number; // 2 bytes - earning source
  readonly timestamp: Timestamp; // 4 bytes
}

// High-frequency balance cache
export interface BalanceCache {
  readonly cache: Map<UserId, UserBalance>;
  readonly ttl: number; // cache TTL in seconds
  readonly hits: number; // cache hit count
  readonly misses: number; // cache miss count
  readonly lastFlush: Timestamp; // last cache flush
}