/** @fileoverview Types for financial transaction history. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export type TransactionType = 'EARNING' | 'WITHDRAWAL' | 'REFUND' | 'PENALTY' | 'ADJUSTMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface TransactionRecord {
  readonly transactionId: Uuid;
  readonly workerId: Uuid;
  readonly type: TransactionType;
  readonly status: TransactionStatus;
  readonly amount: MoneyValue;
  readonly currency: string;
  readonly description: string;
  readonly timestamp: IsoTimestamp;
  readonly relatedEntityId?: Uuid; // e.g., taskId, withdrawalId
}
