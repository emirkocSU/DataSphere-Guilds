/** @fileoverview Types related to business payments. */
import { Uuid, IsoTimestamp, MoneyValue } from '../../types/common.types';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  paymentId: Uuid;
  userId: Uuid;
  amount: MoneyValue;
  currency: string;
  status: PaymentStatus;
  createdAt: IsoTimestamp;
}

export interface Transaction {
  transactionId: Uuid;
  paymentId: Uuid;
  type: 'EARNING' | 'PAYOUT';
  amount: MoneyValue;
  currency: string;
  timestamp: IsoTimestamp;
}
