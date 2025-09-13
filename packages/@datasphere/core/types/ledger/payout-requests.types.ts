/** @fileoverview Types for worker payout requests. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export type PayoutMethodType = 'IBAN' | 'PAYPAL' | 'STRIPE' | 'CRYPTO';
export type PayoutStatus = 'REQUESTED' | 'PROCESSING' | 'SENT' | 'COMPLETED' | 'REJECTED';

export interface PayoutMethod {
  readonly methodId: Uuid;
  readonly workerId: Uuid;
  readonly type: PayoutMethodType;
  readonly isDefault: boolean;
  readonly details: Record<string, any>; // e.g., { iban: '...', walletAddress: '...' }
}

export interface PayoutRequest {
  readonly requestId: Uuid;
  readonly workerId: Uuid;
  readonly methodId: Uuid;
  readonly amount: MoneyValue;
  readonly currency: string;
  readonly status: PayoutStatus;
  readonly requestedAt: IsoTimestamp;
  readonly processedAt?: IsoTimestamp;
  readonly transactionId?: Uuid;
  readonly rejectionReason?: string;
}
