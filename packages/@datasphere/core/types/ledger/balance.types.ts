/** @fileoverview Types related to user account balances. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export interface AccountBalance {
  readonly balanceId: Uuid;
  readonly workerId: Uuid;
  readonly currency: string;
  readonly available: MoneyValue; // Funds that can be withdrawn
  readonly pending: MoneyValue;   // Funds from tasks awaiting QC approval
  readonly frozen: MoneyValue;    // Funds held during a dispute/investigation
  readonly lastUpdated: IsoTimestamp;
}

export interface BalanceHistoryEntry {
  readonly entryId: Uuid;
  readonly balanceId: Uuid;
  readonly timestamp: IsoTimestamp;
  readonly changeAmount: MoneyValue;
  readonly reason: string; // e.g., "Task X approved", "Withdrawal Y"
  readonly newAvailable: MoneyValue;
  readonly newPending: MoneyValue;
}
