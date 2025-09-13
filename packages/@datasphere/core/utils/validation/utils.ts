/**
 * @fileoverview Lean, high-performance validation utilities for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { PerformanceMonitor } from '../performance/monitor';

const monitor = new PerformanceMonitor('ValidationUtils');

export interface SanitizeConfig {
  trimStrings?: boolean;
  removeHtml?: boolean;
  maxLength?: number;
}

export interface NormalizeConfig {
  lowercase?: boolean;
  removeSpaces?: boolean;
  removeSpecialChars?: boolean;
}

export interface TransformConfig {
  validator?: (data: any) => boolean;
  transformer?: (data: any) => any;
  sanitizer?: (data: any) => any;
}

export function sanitizeInput(data: any, config: SanitizeConfig = {}): any {
  return monitor.measure('sanitizeInput', () => {
    if (typeof data === 'string') {
      let result = data;
      
      if (config.trimStrings) {
        result = result.trim();
      }
      
      if (config.removeHtml) {
        result = result.replace(/<[^>]*>/g, '');
      }
      
      if (config.maxLength && result.length > config.maxLength) {
        result = result.substring(0, config.maxLength);
      }
      
      return result;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => sanitizeInput(item, config));
    }
    
    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = sanitizeInput(value, config);
      }
      return result;
    }
    
    return data;
  });
}

export function normalizeData(data: any, config: NormalizeConfig = {}): any {
  return monitor.measure('normalizeData', () => {
    if (typeof data === 'string') {
      let result = data;
      
      if (config.lowercase) {
        result = result.toLowerCase();
      }
      
      if (config.removeSpaces) {
        result = result.replace(/\s+/g, '');
      }
      
      if (config.removeSpecialChars) {
        result = result.replace(/[^a-zA-Z0-9]/g, '');
      }
      
      return result;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => normalizeData(item, config));
    }
    
    if (typeof data === 'object' && data !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = normalizeData(value, config);
      }
      return result;
    }
    
    return data;
  });
}

export function validateAndTransform(data: any, config: TransformConfig = {}): any {
  return monitor.measure('validateAndTransform', () => {
    let result = data;
    
    if (config.sanitizer) {
      result = config.sanitizer(result);
    }
    
    if (config.validator && !config.validator(result)) {
      throw new Error('Validation failed');
    }
    
    if (config.transformer) {
      result = config.transformer(result);
    }
    
    return result;
  });
}

export async function batchValidate(dataArray: any[], validator: (data: any) => boolean): Promise<boolean[]> {
  return monitor.measure('batchValidate', async () => {
    return dataArray.map(data => validator(data));
  });
}

export async function parallelValidate(dataArray: any[], validator: (data: any) => Promise<boolean>): Promise<boolean[]> {
  return monitor.measure('parallelValidate', async () => {
    const promises = dataArray.map(data => validator(data));
    return Promise.all(promises);
  });
}