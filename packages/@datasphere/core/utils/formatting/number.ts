/**
 * @fileoverview Lean, high-performance number formatting for unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('NumberUtils');
const formatters = new Map<string, Intl.NumberFormat>();

export function formatNumber(
  num: number, 
  locale: string = 'en-US', 
  options?: Intl.NumberFormatOptions
): string {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new ValidationError('Input must be a valid number');
  }
  
  return monitor.measure('formatNumber', () => {
    const key = `${locale}-${JSON.stringify(options || {})}`;
    
    if (!formatters.has(key)) {
      formatters.set(key, new Intl.NumberFormat(locale, options));
    }
    
    return formatters.get(key)!.format(num);
  });
}

export function formatPercentage(
  num: number, 
  decimals: number = 1, 
  locale: string = 'en-US'
): string {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new ValidationError('Input must be a valid number');
  }
  
  return monitor.measure('formatPercentage', () => {
    const options: Intl.NumberFormatOptions = {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    };
    
    return new Intl.NumberFormat(locale, options).format(num);
  });
}

export function formatCompact(
  num: number, 
  locale: string = 'en-US'
): string {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new ValidationError('Input must be a valid number');
  }
  
  return monitor.measure('formatCompact', () => {
    const key = `${locale}-compact`;
    
    if (!formatters.has(key)) {
      formatters.set(key, new Intl.NumberFormat(locale, { 
        notation: 'compact',
        compactDisplay: 'short'
      }));
    }
    
    return formatters.get(key)!.format(num);
  });
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    throw new ValidationError('Bytes must be a valid number');
  }
  
  return monitor.measure('formatBytes', () => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  });
}

export function clamp(num: number, min: number, max: number): number {
  if (typeof num !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new ValidationError('All parameters must be numbers');
  }
  
  return Math.min(Math.max(num, min), max);
}

export function round(num: number, decimals: number = 0): number {
  if (typeof num !== 'number' || typeof decimals !== 'number') {
    throw new ValidationError('Parameters must be numbers');
  }
  
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function isNumeric(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export { monitor as numberUtilsMonitor };
