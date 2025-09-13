/** @fileoverview Types for currency conversion. */
import { MoneyValue } from '../common.types';

export type CurrencyCode = 'USD' | 'EUR' | 'TRY' | 'GBP';

export interface ExchangeRate {
  readonly from: CurrencyCode;
  readonly to: CurrencyCode;
  readonly rate: number;
  readonly timestamp: number;
}

export interface CurrencyConversionResult {
  readonly originalAmount: MoneyValue;
  readonly originalCurrency: CurrencyCode;
  readonly convertedAmount: MoneyValue;
  readonly convertedCurrency: CurrencyCode;
  readonly rateUsed: number;
}
