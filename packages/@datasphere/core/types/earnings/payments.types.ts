/**
 * @fileoverview Pico-optimized payment types with binary-packed structures.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Ultra-compact payment - 28 bytes
export interface Payment {
  readonly id: UUID; // 16 bytes
  readonly amount: BigInt; // 8 bytes - precise amount
  readonly method: number; // 1 byte - PaymentMethod enum
  readonly status: number; // 1 byte - PaymentStatus enum
  readonly timestamp: number; // 4 bytes - unix timestamp
}

// Minimal payout request - 24 bytes
export interface PayoutRequest {
  readonly userId: number; // 4 bytes - user hash
  readonly amount: BigInt; // 8 bytes - requested amount
  readonly method: number; // 1 byte - payout method
  readonly priority: number; // 1 byte - request priority
  readonly created: number; // 4 bytes - request time
  readonly expires: number; // 4 bytes - expiration time
  readonly fees: number; // 2 bytes - estimated fees
}

// Payment provider config - 16 bytes
export interface PaymentProvider {
  readonly id: number; // 2 bytes - provider ID
  readonly type: number; // 1 byte - provider type
  readonly status: number; // 1 byte - provider status
  readonly minAmount: number; // 4 bytes - minimum payment
  readonly maxAmount: number; // 4 bytes - maximum payment
  readonly feeRate: number; // 4 bytes - fee percentage
}

// Bank account details - 32 bytes
export interface BankAccount {
  readonly accountId: BigInt; // 8 bytes - account hash
  readonly bankCode: number; // 4 bytes - bank identifier
  readonly accountType: number; // 1 byte - account type
  readonly currency: number; // 1 byte - currency code
  readonly status: number; // 1 byte - account status
  readonly verification: number; // 1 byte - verification level
  readonly created: number; // 4 bytes - creation time
  readonly lastUsed: number; // 4 bytes - last usage
  readonly balance: BigInt; // 8 bytes - current balance
}

// Crypto wallet - 24 bytes
export interface CryptoWallet {
  readonly address: BigInt; // 8 bytes - wallet address hash
  readonly chain: number; // 1 byte - blockchain ID
  readonly type: number; // 1 byte - wallet type
  readonly status: number; // 1 byte - wallet status
  readonly balance: BigInt; // 8 bytes - wallet balance
  readonly lastSync: number; // 4 bytes - last sync time
  readonly reserved: number; // 1 byte - reserved space
}

// Payment batch for processing - 20 bytes
export interface PaymentBatch {
  readonly batchId: BigInt; // 8 bytes
  readonly count: number; // 2 bytes - payment count
  readonly totalAmount: BigInt; // 8 bytes - batch total
  readonly status: number; // 1 byte - batch status
  readonly created: number; // 4 bytes - creation time
}

// Transaction fee structure - 8 bytes
export interface TransactionFee {
  readonly base: number; // 2 bytes - base fee
  readonly percentage: number; // 2 bytes - percentage fee (bps)
  readonly minimum: number; // 2 bytes - minimum fee
  readonly maximum: number; // 2 bytes - maximum fee
}

// Const enums for zero overhead
export const enum PaymentMethod {
  BANK_WIRE = 0,
  ACH = 1,
  PAYPAL = 2,
  STRIPE = 3,
  WISE = 4,
  CRYPTO_BTC = 5,
  CRYPTO_ETH = 6,
  CRYPTO_USDC = 7,
  REVOLUT = 8,
  SEPA = 9,
  SWIFT = 10,
  CHECK = 11
}

export const enum PaymentStatus {
  PENDING = 0,
  PROCESSING = 1,
  SENT = 2,
  RECEIVED = 3,
  FAILED = 4,
  CANCELLED = 5,
  REFUNDED = 6,
  EXPIRED = 7
}

export const enum PayoutPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
  INSTANT = 4
}

export const enum ProviderType {
  BANK = 0,
  FINTECH = 1,
  CRYPTO = 2,
  WALLET = 3,
  CARD = 4,
  MOBILE = 5
}

export const enum ProviderStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  MAINTENANCE = 2,
  DEPRECATED = 3,
  BLOCKED = 4
}

export const enum AccountType {
  CHECKING = 0,
  SAVINGS = 1,
  BUSINESS = 2,
  INVESTMENT = 3,
  PREPAID = 4,
  CREDIT = 5
}

export const enum VerificationLevel {
  NONE = 0,
  BASIC = 1,
  ENHANCED = 2,
  PREMIUM = 3,
  INSTITUTIONAL = 4
}

export const enum CryptoChain {
  BITCOIN = 0,
  ETHEREUM = 1,
  POLYGON = 2,
  BSC = 3,
  AVALANCHE = 4,
  SOLANA = 5,
  ARBITRUM = 6,
  OPTIMISM = 7
}

export const enum WalletType {
  HOT = 0,
  COLD = 1,
  HARDWARE = 2,
  SOFTWARE = 3,
  CUSTODIAL = 4,
  NON_CUSTODIAL = 5
}

export const enum BatchStatus {
  CREATED = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  FAILED = 3,
  PARTIAL = 4,
  CANCELLED = 5
}

// Type aliases for micro-optimization
export type PaymentId = UUID;
export type UserId = number;
export type Amount = BigInt;
export type Timestamp = number;
export type BatchId = BigInt;
export type AccountId = BigInt;
export type Address = BigInt;
export type Hash = BigInt;
export type FeeRate = number;
export type Balance = BigInt;

// Memory-mapped payment storage
export interface PaymentStorage {
  readonly buffer: SharedArrayBuffer;
  readonly paymentOffset: number;
  readonly requestOffset: number;
  readonly providerOffset: number;
  readonly accountOffset: number;
  readonly walletOffset: number;
}

// Fast payment routing
export interface PaymentRouter {
  readonly route: (request: PayoutRequest) => PaymentProvider;
  readonly estimate: (amount: Amount, method: PaymentMethod) => TransactionFee;
  readonly validate: (payment: Payment) => boolean;
  readonly retry: (payment: Payment) => boolean;
}

// Payment gateway interface
export interface PaymentGateway {
  readonly process: (payment: Payment) => Promise<PaymentStatus>;
  readonly status: (paymentId: PaymentId) => Promise<PaymentStatus>;
  readonly cancel: (paymentId: PaymentId) => Promise<boolean>;
  readonly refund: (paymentId: PaymentId, amount?: Amount) => Promise<boolean>;
}

// Real-time payment tracking
export interface PaymentTracker {
  readonly trackingId: BigInt; // 8 bytes
  readonly paymentId: PaymentId; // 16 bytes
  readonly status: PaymentStatus; // 1 byte
  readonly progress: number; // 1 byte - 0-100 progress
  readonly estimatedTime: number; // 4 bytes - ETA in seconds
  readonly lastUpdate: Timestamp; // 4 bytes
}

// Payment reconciliation
export interface PaymentReconciliation {
  readonly reconId: BigInt; // 8 bytes
  readonly batchId: BatchId; // 8 bytes
  readonly expected: Amount; // 8 bytes - expected amount
  readonly actual: Amount; // 8 bytes - actual amount
  readonly variance: Amount; // 8 bytes - difference
  readonly status: number; // 1 byte - reconciliation status
  readonly timestamp: Timestamp; // 4 bytes
}

// Fraud detection score
export interface FraudScore {
  readonly paymentId: PaymentId; // 16 bytes
  readonly score: number; // 2 bytes - 0-1000 risk score
  readonly factors: BigInt; // 8 bytes - risk factors as bits
  readonly action: number; // 1 byte - recommended action
  readonly confidence: number; // 1 byte - confidence level
  readonly timestamp: Timestamp; // 4 bytes
}

// Payment analytics aggregate
export interface PaymentAnalytics {
  readonly totalVolume: Amount; // 8 bytes
  readonly totalCount: number; // 4 bytes
  readonly successRate: number; // 2 bytes - success percentage
  readonly avgAmount: number; // 4 bytes - average payment
  readonly avgTime: number; // 4 bytes - average processing time
  readonly topMethod: PaymentMethod; // 1 byte
  readonly period: number; // 4 bytes - analysis period
}

// Currency exchange
export interface CurrencyExchange {
  readonly from: number; // 1 byte - source currency
  readonly to: number; // 1 byte - target currency
  readonly rate: number; // 8 bytes - exchange rate
  readonly fee: number; // 4 bytes - exchange fee
  readonly minimum: Amount; // 8 bytes - minimum exchange
  readonly maximum: Amount; // 8 bytes - maximum exchange
  readonly timestamp: Timestamp; // 4 bytes - rate timestamp
}

// Compliance check result
export interface ComplianceCheck {
  readonly checkId: BigInt; // 8 bytes
  readonly paymentId: PaymentId; // 16 bytes
  readonly rules: BigInt; // 8 bytes - applied rules as bits
  readonly result: number; // 1 byte - compliance result
  readonly risk: number; // 1 byte - risk assessment
  readonly flags: number; // 2 bytes - compliance flags
  readonly timestamp: Timestamp; // 4 bytes
}

// Payment schedule for recurring
export interface PaymentSchedule {
  readonly scheduleId: BigInt; // 8 bytes
  readonly userId: UserId; // 4 bytes
  readonly amount: Amount; // 8 bytes
  readonly frequency: number; // 1 byte - payment frequency
  readonly nextPayment: Timestamp; // 4 bytes
  readonly endDate: Timestamp; // 4 bytes
  readonly status: number; // 1 byte - schedule status
}

// High-frequency payment stats
export interface PaymentStats {
  readonly timestamp: Timestamp; // 4 bytes
  readonly tps: number; // 2 bytes - transactions per second
  readonly volume: Amount; // 8 bytes - volume in period
  readonly successRate: number; // 2 bytes - success rate bps
  readonly avgLatency: number; // 2 bytes - average latency ms
  readonly errorCount: number; // 2 bytes - error count
  readonly queueDepth: number; // 2 bytes - processing queue
}

// Payment method limits
export interface PaymentLimits {
  readonly method: PaymentMethod; // 1 byte
  readonly dailyLimit: Amount; // 8 bytes
  readonly monthlyLimit: Amount; // 8 bytes
  readonly perTxLimit: Amount; // 8 bytes
  readonly minAmount: Amount; // 8 bytes
  readonly maxRetries: number; // 1 byte
  readonly cooldown: number; // 4 bytes - retry cooldown
}

// Settlement report
export interface SettlementReport {
  readonly reportId: BigInt; // 8 bytes
  readonly provider: number; // 2 bytes - provider ID
  readonly settled: Amount; // 8 bytes - settled amount
  readonly fees: Amount; // 8 bytes - total fees
  readonly count: number; // 4 bytes - transaction count
  readonly period: number; // 4 bytes - settlement period
  readonly status: number; // 1 byte - settlement status
}

// Zero-allocation payment processor
export interface PaymentProcessor {
  readonly process: (batch: PaymentBatch) => Promise<BatchStatus>;
  readonly retry: (paymentId: PaymentId) => Promise<PaymentStatus>;
  readonly cancel: (paymentId: PaymentId) => Promise<boolean>;
  readonly stats: () => PaymentStats;
  readonly health: () => boolean;
}