/**
 * @fileoverview Atto-optimized earnings calculation types with micro-precision accounting.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../common.types';

// Quantum earning record - 32 bytes
export interface EarningRecord {
  readonly id: UUID; // 16 bytes
  readonly amount: BigInt; // 8 bytes - precise earning
  readonly source: number; // 1 byte - earning source
  readonly quality: number; // 1 byte - quality score
  readonly multiplier: number; // 2 bytes - bonus multiplier
  readonly timestamp: number; // 4 bytes - earning time
}

// Micro task completion - 24 bytes
export interface TaskCompletion {
  readonly taskId: BigInt; // 8 bytes - task hash
  readonly userId: number; // 4 bytes - user hash
  readonly score: number; // 2 bytes - completion score
  readonly duration: number; // 4 bytes - time taken (ms)
  readonly difficulty: number; // 1 byte - task difficulty
  readonly bonus: number; // 1 byte - bonus flags
  readonly completed: number; // 4 bytes - completion time
}

// Performance rating - 16 bytes
export interface PerformanceRating {
  readonly accuracy: number; // 2 bytes - accuracy score
  readonly speed: number; // 2 bytes - speed score
  readonly quality: number; // 2 bytes - quality score
  readonly consistency: number; // 2 bytes - consistency score
  readonly innovation: number; // 2 bytes - innovation score
  readonly collaboration: number; // 2 bytes - teamwork score
  readonly leadership: number; // 2 bytes - leadership score
  readonly growth: number; // 2 bytes - improvement score
}

// Earning calculation - 20 bytes
export interface EarningCalc {
  readonly baseAmount: BigInt; // 8 bytes - base earning
  readonly qualityBonus: number; // 4 bytes - quality bonus
  readonly speedBonus: number; // 4 bytes - speed bonus
  readonly totalAmount: BigInt; // 8 bytes - final amount
}

// User earning stats - 32 bytes
export interface UserEarnings {
  readonly userId: number; // 4 bytes - user hash
  readonly totalEarned: BigInt; // 8 bytes - lifetime earnings
  readonly totalPaid: BigInt; // 8 bytes - total payments
  readonly pendingAmount: BigInt; // 8 bytes - pending earnings
  readonly lastEarning: number; // 4 bytes - last earning time
}

// Earning period summary - 28 bytes
export interface EarningPeriod {
  readonly periodId: number; // 4 bytes - period hash
  readonly startTime: number; // 4 bytes - period start
  readonly endTime: number; // 4 bytes - period end
  readonly totalEarned: BigInt; // 8 bytes - total earnings
  readonly userCount: number; // 4 bytes - active users
  readonly taskCount: number; // 4 bytes - completed tasks
}

// Quality score breakdown - 8 bytes
export interface QualityScore {
  readonly accuracy: number; // 1 byte - 0-255 accuracy
  readonly completeness: number; // 1 byte - 0-255 completeness
  readonly timeliness: number; // 1 byte - 0-255 timeliness
  readonly innovation: number; // 1 byte - 0-255 innovation
  readonly consistency: number; // 1 byte - 0-255 consistency
  readonly collaboration: number; // 1 byte - 0-255 teamwork
  readonly feedback: number; // 1 byte - 0-255 peer feedback
  readonly improvement: number; // 1 byte - 0-255 growth rate
}

// Const enums for zero overhead
export const enum EarningSource {
  TASK_COMPLETION = 0,
  QUALITY_BONUS = 1,
  SPEED_BONUS = 2,
  CONSISTENCY_BONUS = 3,
  INNOVATION_BONUS = 4,
  LEADERSHIP_BONUS = 5,
  REFERRAL_BONUS = 6,
  MILESTONE_BONUS = 7,
  RETENTION_BONUS = 8,
  EXCELLENCE_AWARD = 9
}

export const enum TaskDifficulty {
  TRIVIAL = 0,
  EASY = 1,
  NORMAL = 2,
  HARD = 3,
  EXPERT = 4,
  LEGENDARY = 5
}

export const enum BonusFlag {
  FIRST_COMPLETION = 1 << 0,
  PERFECT_SCORE = 1 << 1,
  SPEED_BONUS = 1 << 2,
  INNOVATION_BONUS = 1 << 3,
  COLLABORATION_BONUS = 1 << 4,
  STREAK_BONUS = 1 << 5,
  MILESTONE_BONUS = 1 << 6,
  EXCELLENCE_BONUS = 1 << 7
}

export const enum EarningStatus {
  PENDING = 0,
  CONFIRMED = 1,
  PAID = 2,
  DISPUTED = 3,
  ADJUSTED = 4,
  CANCELLED = 5
}

export const enum PaymentFrequency {
  INSTANT = 0,
  DAILY = 1,
  WEEKLY = 2,
  BIWEEKLY = 3,
  MONTHLY = 4,
  QUARTERLY = 5
}

// Type aliases for ultra-performance
export type EarningId = UUID;
export type TaskId = BigInt;
export type UserId = number;
export type Amount = BigInt;
export type Score = number;
export type Multiplier = number;
export type Timestamp = number;
export type Duration = number;
export type Flags = number;

// Memory-mapped earning storage
export interface EarningStorage {
  readonly buffer: SharedArrayBuffer;
  readonly recordOffset: number;
  readonly taskOffset: number;
  readonly ratingOffset: number;
  readonly calcOffset: number;
  readonly statsOffset: number;
  readonly periodOffset: number;
  readonly qualityOffset: number;
}

// High-speed earning calculator
export interface EarningCalculator {
  readonly calculate: (completion: TaskCompletion, rating: PerformanceRating) => EarningCalc;
  readonly applyBonuses: (base: Amount, flags: BonusFlag) => Amount;
  readonly qualityMultiplier: (score: QualityScore) => Multiplier;
  readonly difficultyMultiplier: (difficulty: TaskDifficulty) => Multiplier;
  readonly streakBonus: (userId: UserId) => Multiplier;
}

// Earning analytics engine
export interface EarningAnalytics {
  readonly userStats: (userId: UserId) => UserEarnings;
  readonly periodStats: (periodId: number) => EarningPeriod;
  readonly topEarners: (limit: number) => readonly UserId[];
  readonly earningTrends: (userId: UserId, days: number) => readonly Amount[];
  readonly qualityTrends: (userId: UserId, days: number) => readonly QualityScore[];
}

// Real-time earning tracker
export interface EarningTracker {
  readonly trackCompletion: (completion: TaskCompletion) => EarningRecord;
  readonly updateRating: (userId: UserId, rating: PerformanceRating) => boolean;
  readonly processEarning: (record: EarningRecord) => boolean;
  readonly batchProcess: (records: readonly EarningRecord[]) => number;
}

// Earning validation engine
export interface EarningValidator {
  readonly validateCompletion: (completion: TaskCompletion) => boolean;
  readonly validateRating: (rating: PerformanceRating) => boolean;
  readonly antiCheatCheck: (userId: UserId, completion: TaskCompletion) => boolean;
  readonly qualityAssurance: (record: EarningRecord) => boolean;
}

// Performance benchmark - 16 bytes
export interface PerformanceBenchmark {
  readonly userId: UserId; // 4 bytes
  readonly avgAccuracy: number; // 2 bytes - average accuracy
  readonly avgSpeed: number; // 2 bytes - average speed
  readonly avgQuality: number; // 2 bytes - average quality
  readonly completionRate: number; // 2 bytes - task completion %
  readonly streakDays: number; // 2 bytes - current streak
  readonly lastUpdate: number; // 4 bytes - last benchmark
}

// Earning milestone - 20 bytes
export interface EarningMilestone {
  readonly milestoneId: number; // 4 bytes - milestone hash
  readonly threshold: Amount; // 8 bytes - amount threshold
  readonly bonus: Amount; // 8 bytes - milestone bonus
}

// Task category stats - 24 bytes
export interface CategoryStats {
  readonly category: number; // 2 bytes - category ID
  readonly avgEarning: Amount; // 8 bytes - average earning
  readonly completionTime: Duration; // 4 bytes - avg completion
  readonly difficulty: TaskDifficulty; // 1 byte
  readonly qualityScore: number; // 2 bytes - avg quality
  readonly userCount: number; // 4 bytes - active users
  readonly taskCount: number; // 4 bytes - total tasks
}

// Earning forecast - 16 bytes
export interface EarningForecast {
  readonly userId: UserId; // 4 bytes
  readonly projectedDaily: Amount; // 8 bytes - daily projection
  readonly confidence: number; // 1 byte - forecast confidence
  readonly trend: number; // 1 byte - earning trend
  readonly lastUpdate: number; // 4 bytes - forecast time
}

// Payout schedule - 20 bytes
export interface PayoutSchedule {
  readonly scheduleId: BigInt; // 8 bytes
  readonly userId: UserId; // 4 bytes
  readonly frequency: PaymentFrequency; // 1 byte
  readonly minAmount: Amount; // 8 bytes - minimum payout
  readonly nextPayout: Timestamp; // 4 bytes - next payout time
}

// User achievement - 16 bytes
export interface Achievement {
  readonly achievementId: number; // 4 bytes - achievement hash
  readonly userId: UserId; // 4 bytes
  readonly unlockedAt: Timestamp; // 4 bytes - unlock time
  readonly bonus: Amount; // 8 bytes - achievement bonus
}

// Earning dispute - 28 bytes
export interface EarningDispute {
  readonly disputeId: BigInt; // 8 bytes
  readonly earningId: EarningId; // 16 bytes
  readonly reason: number; // 1 byte - dispute reason
  readonly status: number; // 1 byte - dispute status
  readonly filed: Timestamp; // 4 bytes - filing time
}

// Quality assurance check - 12 bytes
export interface QualityCheck {
  readonly checkId: BigInt; // 8 bytes
  readonly passed: boolean; // 1 byte - check result
  readonly score: number; // 1 byte - quality score
  readonly timestamp: Timestamp; // 4 bytes - check time
}

// Earning metrics aggregate
export interface EarningMetrics {
  readonly totalEarnings: Amount; // total platform earnings
  readonly activeUsers: number; // currently active users
  readonly completionRate: number; // task completion rate
  readonly avgQuality: number; // average quality score
  readonly payoutRate: number; // payout success rate
  readonly disputeRate: number; // dispute percentage
  readonly retentionRate: number; // user retention rate
}

// Zero-allocation earning engine
export interface EarningEngine {
  readonly processTask: (completion: TaskCompletion) => EarningRecord;
  readonly calculatePayout: (userId: UserId) => Amount;
  readonly updateBenchmark: (userId: UserId) => PerformanceBenchmark;
  readonly checkMilestones: (userId: UserId) => readonly Achievement[];
  readonly generateForecast: (userId: UserId) => EarningForecast;
  readonly metrics: () => EarningMetrics;
}