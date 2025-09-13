/**
 * @fileoverview Enterprise-grade array manipulation utilities with performance optimization
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('ArrayUtils');

/**
 * High-performance array chunking with memory optimization
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  if (size <= 0) throw new ValidationError('Chunk size must be positive');
  
  return monitor.measure('chunk', () => {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  });
}

/**
 * Memory-efficient unique array with custom comparator support
 */
export function unique<T>(arr: T[], compareFn?: (a: T, b: T) => boolean): T[] {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  
  return monitor.measure('unique', () => {
    if (!compareFn) return [...new Set(arr)];
    
    const result: T[] = [];
    for (const item of arr) {
      if (!result.some(existing => compareFn(existing, item))) {
        result.push(item);
      }
    }
    return result;
  });
}

/**
 * Advanced array flattening with depth control
 */
export function flatten<T>(arr: (T | T[])[], depth: number = Infinity): T[] {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  
  return monitor.measure('flatten', () => {
    const result: T[] = [];
    const stack: Array<{ items: (T | T[])[]; currentDepth: number }> = [{ items: arr, currentDepth: 0 }];
    
    while (stack.length > 0) {
      const { items, currentDepth } = stack.pop()!;
      
      for (const item of items) {
        if (Array.isArray(item) && currentDepth < depth) {
          stack.push({ items: item, currentDepth: currentDepth + 1 });
        } else {
          result.push(item as T);
        }
      }
    }
    
    return result;
  });
}

/**
 * High-performance binary search
 */
export function binarySearch<T>(
  arr: T[], 
  target: T, 
  compareFn: (a: T, b: T) => number
): number {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  
  return monitor.measure('binarySearch', () => {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compareFn(arr[mid], target);
      
      if (comparison === 0) return mid;
      if (comparison < 0) left = mid + 1;
      else right = mid - 1;
    }
    
    return -1;
  });
}

/**
 * Efficient array grouping by key function
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[], 
  keyFn: (item: T) => K
): Record<K, T[]> {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  
  return monitor.measure('groupBy', () => {
    const result = {} as Record<K, T[]>;
    
    for (const item of arr) {
      const key = keyFn(item);
      if (!result[key]) result[key] = [];
      result[key].push(item);
    }
    
    return result;
  });
}

/**
 * Advanced sorting with multiple criteria
 */
export function multiSort<T>(
  arr: T[], 
  criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  if (!criteria.length) return [...arr];
  
  return monitor.measure('multiSort', () => {
    return [...arr].sort((a, b) => {
      for (const { key, direction } of criteria) {
        const aVal = a[key];
        const bVal = b[key];
        
        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        else if (aVal > bVal) comparison = 1;
        
        if (comparison !== 0) {
          return direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  });
}

/**
 * Memory-efficient array intersection
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  if (arrays.some(arr => !Array.isArray(arr))) {
    throw new ValidationError('All inputs must be arrays');
  }
  
  return monitor.measure('intersection', () => {
    const [first, ...rest] = arrays;
    const sets = rest.map(arr => new Set(arr));
    
    return first.filter(item => 
      sets.every(set => set.has(item))
    );
  });
}

/**
 * Advanced array difference calculation
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new ValidationError('Both inputs must be arrays');
  }
  
  return monitor.measure('difference', () => {
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
  });
}

/**
 * Partition array based on predicate
 */
export function partition<T>(
  arr: T[], 
  predicate: (item: T, index: number) => boolean
): [T[], T[]] {
  if (!Array.isArray(arr)) throw new ValidationError('Input must be an array');
  
  return monitor.measure('partition', () => {
    const truthy: T[] = [];
    const falsy: T[] = [];
    
    arr.forEach((item, index) => {
      if (predicate(item, index)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    });
    
    return [truthy, falsy];
  });
}

export { monitor as arrayUtilsMonitor };
