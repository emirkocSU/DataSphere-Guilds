/** @fileoverview API types for payment-related requests and responses. */
import { Uuid, MoneyValue } from '../../types/common.types';

export interface PaymentRequest {
  userId: Uuid;
  amount: MoneyValue;
  currency: string;
  method: string;
}

export interface PaymentResponse {
  paymentId: Uuid;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId?: Uuid;
}
