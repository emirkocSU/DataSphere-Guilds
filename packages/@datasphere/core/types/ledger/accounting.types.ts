/** @fileoverview Types for internal accounting and financial reporting. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export interface GeneralLedgerEntry {
  readonly entryId: Uuid;
  readonly transactionId: Uuid;
  readonly account: string; // e.g., 'ACCOUNTS_PAYABLE', 'WORKER_EARNINGS'
  readonly debit: MoneyValue;
  readonly credit: MoneyValue;
  readonly timestamp: IsoTimestamp;
  readonly description: string;
}

export interface FinancialStatement {
  readonly statementId: Uuid;
  readonly type: 'INCOME_STATEMENT' | 'BALANCE_SHEET';
  readonly period: { startDate: IsoTimestamp; endDate: IsoTimestamp };
  readonly lineItems: Record<string, MoneyValue>;
  readonly generatedAt: IsoTimestamp;
}
