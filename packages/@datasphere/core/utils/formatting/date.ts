/**
 * @fileoverview Lean, high-performance date/time formatting for global unicorn operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('DateUtils');
const formatters = new Map<string, Intl.DateTimeFormat>();

export function formatDate(
  date: Date | string | number, 
  locale: string = 'en-US', 
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = normalizeDate(date);
  
  return monitor.measure('formatDate', () => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    
    const opts = options || defaultOptions;
    const key = `${locale}-${JSON.stringify(opts)}`;
    
    if (!formatters.has(key)) {
      formatters.set(key, new Intl.DateTimeFormat(locale, opts));
    }
    
    return formatters.get(key)!.format(dateObj);
  });
}

export function formatTime(
  date: Date | string | number, 
  locale: string = 'en-US',
  includeSeconds: boolean = false
): string {
  const dateObj = normalizeDate(date);
  
  return monitor.measure('formatTime', () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' })
    };
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  });
}

export function formatDateTime(
  date: Date | string | number, 
  locale: string = 'en-US'
): string {
  const dateObj = normalizeDate(date);
  
  return monitor.measure('formatDateTime', () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  });
}

export function formatRelativeTime(
  date: Date | string | number, 
  locale: string = 'en-US'
): string {
  const dateObj = normalizeDate(date);
  
  return monitor.measure('formatRelativeTime', () => {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, 'second');
    if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, 'minute');
    if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, 'hour');
    if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, 'day');
    
    return formatDate(dateObj, locale);
  });
}

export function parseDate(dateStr: string): Date {
  if (typeof dateStr !== 'string') {
    throw new ValidationError('Date string must be a string');
  }
  
  return monitor.measure('parseDate', () => {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date string');
    }
    
    return date;
  });
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function addDays(date: Date | string | number, days: number): Date {
  const dateObj = normalizeDate(date);
  
  return monitor.measure('addDays', () => {
    const result = new Date(dateObj);
    result.setDate(result.getDate() + days);
    return result;
  });
}

export function diffInDays(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  
  return monitor.measure('diffInDays', () => {
    const diffTime = d2.getTime() - d1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });
}

function normalizeDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid Date object');
    }
    return date;
  }
  
  const result = new Date(date);
  if (isNaN(result.getTime())) {
    throw new ValidationError('Invalid date input');
  }
  
  return result;
}

export { monitor as dateUtilsMonitor };
