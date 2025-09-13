/**
 * @fileoverview Enterprise-grade object manipulation utilities with performance optimization
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';
import { ValidationError } from '../../types/errors';

const monitor = new PerformanceMonitor('ObjectUtils');

/**
 * High-performance deep cloning with circular reference detection
 */
export function deepClone<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item, seen)) as T;
  if (obj instanceof RegExp) return new RegExp(obj) as T;
  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((value, key) => map.set(key, deepClone(value, seen)));
    return map as T;
  }
  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach(value => set.add(deepClone(value, seen)));
    return set as T;
  }
  
  if (seen.has(obj)) {
    throw new ValidationError('Circular reference detected in object');
  }
  
  return monitor.measure('deepClone', () => {
    seen.set(obj, true);
    
    const cloned = Object.create(Object.getPrototypeOf(obj));
    Object.getOwnPropertyNames(obj).forEach(key => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key)!;
      if (descriptor.value !== undefined) {
        descriptor.value = deepClone(descriptor.value, seen);
      }
      Object.defineProperty(cloned, key, descriptor);
    });
    
    seen.delete(obj);
    return cloned;
  });
}

/**
 * Safe path-based property access with type safety
 */
export function getByPath<T = any>(
  obj: any, 
  path: string | string[], 
  defaultValue?: T
): T | undefined {
  if (!obj || (!path && path !== 0)) return defaultValue;
  
  return monitor.measure('getByPath', () => {
    const pathArray = Array.isArray(path) ? path : path.toString().split('.');
    let result = obj;
    
    for (const key of pathArray) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  });
}

/**
 * Safe path-based property setting with nested object creation
 */
export function setByPath<T extends Record<string, any>>(
  obj: T, 
  path: string | string[], 
  value: any
): T {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Target must be an object');
  }
  
  return monitor.measure('setByPath', () => {
    const pathArray = Array.isArray(path) ? path : path.toString().split('.');
    let current = obj;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      const key = pathArray[i];
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[pathArray[pathArray.length - 1]] = value;
    return obj;
  });
}

/**
 * Deep merge objects with array handling options
 */
export function deepMerge<T extends Record<string, any>>(
  target: T, 
  ...sources: Array<Partial<T>>
): T {
  if (!target || typeof target !== 'object') {
    throw new ValidationError('Target must be an object');
  }
  
  return monitor.measure('deepMerge', () => {
    const result = { ...target };
    
    for (const source of sources) {
      if (!source || typeof source !== 'object') continue;
      
      for (const key in source) {
        const sourceValue = source[key];
        const targetValue = result[key];
        
        if (Array.isArray(sourceValue)) {
          result[key] = [...sourceValue] as any;
        } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
          if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
          } else {
            result[key] = deepClone(sourceValue);
          }
        } else {
          result[key] = sourceValue;
        }
      }
    }
    
    return result;
  });
}

/**
 * Check if objects are deeply equal
 */
export function deepEqual(obj1: any, obj2: any, seen = new WeakMap()): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (seen.has(obj1)) return seen.get(obj1) === obj2;
  seen.set(obj1, obj2);
  
  return monitor.measure('deepEqual', () => {
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }
    
    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
      return obj1.toString() === obj2.toString();
    }
    
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => deepEqual(item, obj2[index], seen));
    }
    
    if (typeof obj1 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      
      if (keys1.length !== keys2.length) return false;
      
      return keys1.every(key => 
        keys2.includes(key) && deepEqual(obj1[key], obj2[key], seen)
      );
    }
    
    return false;
  });
}

/**
 * Pick specific properties from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  return monitor.measure('pick', () => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  });
}

/**
 * Omit specific properties from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  return monitor.measure('omit', () => {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result as Omit<T, K>;
  });
}

/**
 * Flatten nested object with configurable delimiter
 */
export function flatten(
  obj: Record<string, any>, 
  delimiter: string = '.', 
  prefix: string = ''
): Record<string, any> {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  return monitor.measure('flatten', () => {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      const value = obj[key];
      
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(result, flatten(value, delimiter, newKey));
      } else {
        result[newKey] = value;
      }
    }
    
    return result;
  });
}

/**
 * Unflatten object back to nested structure
 */
export function unflatten(
  obj: Record<string, any>, 
  delimiter: string = '.'
): Record<string, any> {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  return monitor.measure('unflatten', () => {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      setByPath(result, key.split(delimiter), obj[key]);
    }
    
    return result;
  });
}

/**
 * Transform object values while preserving structure
 */
export function mapValues<T extends Record<string, any>, R>(
  obj: T, 
  transform: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  if (!obj || typeof obj !== 'object') {
    throw new ValidationError('Input must be an object');
  }
  
  return monitor.measure('mapValues', () => {
    const result = {} as Record<keyof T, R>;
    
    for (const key in obj) {
      result[key] = transform(obj[key], key);
    }
    
    return result;
  });
}

/**
 * Check if object has nested property
 */
export function hasPath(obj: any, path: string | string[]): boolean {
  if (!obj) return false;
  
  const pathArray = Array.isArray(path) ? path : path.toString().split('.');
  let current = obj;
  
  for (const key of pathArray) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * Get all paths in object as array
 */
export function getAllPaths(
  obj: Record<string, any>, 
  prefix: string = '', 
  delimiter: string = '.'
): string[] {
  if (!obj || typeof obj !== 'object') return [];
  
  return monitor.measure('getAllPaths', () => {
    const paths: string[] = [];
    
    for (const key in obj) {
      const currentPath = prefix ? `${prefix}${delimiter}${key}` : key;
      paths.push(currentPath);
      
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        paths.push(...getAllPaths(value, currentPath, delimiter));
      }
    }
    
    return paths;
  });
}

export { monitor as objectUtilsMonitor };
