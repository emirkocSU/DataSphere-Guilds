/**
 * @fileoverview Lean, high-performance currency formatting for global unicorn operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('CurrencyUtils');
const formatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new ValidationError('Amount must be a valid number');
  }
  
  return monitor.measure('formatCurrency', () => {
    const key = `${locale}-${currency}`;
    
    if (!formatters.has(key)) {
      formatters.set(key, new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }));
    }
    
    return formatters.get(key)!.format(amount);
  });
}

export function formatCryptoCurrency(
  amount: number, 
  symbol: string = 'BTC', 
  decimals: number = 8
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new ValidationError('Amount must be a valid number');
  }
  
  return monitor.measure('formatCryptoCurrency', () => {
    const formatted = amount.toFixed(decimals).replace(/\.?0+$/, '');
    return `${formatted} ${symbol}`;
  });
}

export function parseCurrency(value: string, currency: string = 'USD'): number {
  if (typeof value !== 'string') {
    throw new ValidationError('Value must be a string');
  }
  
  return monitor.measure('parseCurrency', () => {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    
    if (isNaN(parsed)) {
      throw new ValidationError('Invalid currency value');
    }
    
    return parsed;
  });
}

export function convertCurrency(
  amount: number, 
  fromRate: number, 
  toRate: number
): number {
  if (typeof amount !== 'number' || typeof fromRate !== 'number' || typeof toRate !== 'number') {
    throw new ValidationError('All parameters must be numbers');
  }
  
  if (fromRate <= 0 || toRate <= 0) {
    throw new ValidationError('Exchange rates must be positive');
  }
  
  return monitor.measure('convertCurrency', () => {
    return (amount / fromRate) * toRate;
  });
}

export { monitor as currencyUtilsMonitor };
