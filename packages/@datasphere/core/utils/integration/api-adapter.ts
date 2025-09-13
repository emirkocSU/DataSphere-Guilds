/**
 * @fileoverview API Adapter Engine
 */

import { EventEmitter } from 'events';
import { APIAdapter, FieldMapping, DataTransformation, AdapterId, IntegrationId } from './types';

export class APIAdapterEngine extends EventEmitter {
  private static instance: APIAdapterEngine;
  private adapters = new Map<AdapterId, APIAdapter>();
  private cache = new Map<string, { data: unknown; expires: number }>();

  private constructor() {
    super();
  }

  static getInstance(): APIAdapterEngine {
    if (!APIAdapterEngine.instance) {
      APIAdapterEngine.instance = new APIAdapterEngine();
    }
    return APIAdapterEngine.instance;
  }

  createAdapter(config: Partial<APIAdapter>): APIAdapter {
    const adapter: APIAdapter = {
      id: `adapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: config.name!,
      sourceApi: config.sourceApi!,
      targetApi: config.targetApi!,
      mappings: config.mappings || [],
      transformations: config.transformations || [],
      validation: config.validation || { rules: [], strictMode: false, errorHandling: 'log' },
      performance: config.performance || { cacheEnabled: true, cacheTtl: 300, batchSize: 100, timeout: 30000, retryAttempts: 3 },
      isActive: config.isActive ?? true
    };

    this.adapters.set(adapter.id, adapter);
    this.emit('adapter-created', adapter);
    return adapter;
  }

  async adaptData(adapterId: AdapterId, sourceData: Record<string, unknown>): Promise<Record<string, unknown>> {
    const adapter = this.adapters.get(adapterId);
    if (!adapter || !adapter.isActive) {
      throw new Error(`Adapter ${adapterId} not found or inactive`);
    }

    const cacheKey = `${adapterId}:${JSON.stringify(sourceData)}`;
    
    if (adapter.performance.cacheEnabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.data as Record<string, unknown>;
      }
    }

    let adaptedData = { ...sourceData };

    // Apply field mappings
    adaptedData = this.applyMappings(adaptedData, adapter.mappings);

    // Apply transformations
    adaptedData = await this.applyTransformations(adaptedData, adapter.transformations);

    // Validate result
    if (adapter.validation.strictMode) {
      this.validateData(adaptedData, adapter.validation.rules);
    }

    // Cache result
    if (adapter.performance.cacheEnabled) {
      this.cache.set(cacheKey, {
        data: adaptedData,
        expires: Date.now() + (adapter.performance.cacheTtl * 1000)
      });
    }

    this.emit('data-adapted', { adapterId, sourceData, adaptedData });
    return adaptedData;
  }

  private applyMappings(data: Record<string, unknown>, mappings: FieldMapping[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const mapping of mappings) {
      const sourceValue = this.getNestedValue(data, mapping.sourceField);
      
      if (sourceValue !== undefined) {
        let value = sourceValue;
        
        if (mapping.transformation) {
          value = this.applyTransformation(value, mapping.transformation);
        }
        
        this.setNestedValue(result, mapping.targetField, value);
      } else if (mapping.defaultValue !== undefined) {
        this.setNestedValue(result, mapping.targetField, mapping.defaultValue);
      } else if (mapping.required) {
        throw new Error(`Required field ${mapping.sourceField} is missing`);
      }
    }

    return result;
  }

  private async applyTransformations(data: Record<string, unknown>, transformations: DataTransformation[]): Promise<Record<string, unknown>> {
    let result = { ...data };

    for (const transformation of transformations) {
      if (!transformation.isActive) continue;

      const sourceValue = this.getNestedValue(result, transformation.sourceField);
      
      if (sourceValue !== undefined) {
        const transformedValue = await this.executeTransformation(sourceValue, transformation);
        this.setNestedValue(result, transformation.targetField, transformedValue);
      }
    }

    return result;
  }

  private executeTransformation(value: unknown, transformation: DataTransformation): unknown {
    switch (transformation.type) {
      case 'map':
        return this.executeRules(value, transformation.rules);
      case 'filter':
        return this.filterValue(value, transformation.rules);
      case 'validate':
        return this.validateValue(value, transformation.rules);
      case 'normalize':
        return this.normalizeValue(value, transformation.rules);
      default:
        return value;
    }
  }

  private executeRules(value: unknown, rules: any[]): unknown {
    for (const rule of rules) {
      if (this.evaluateCondition(value, rule.condition)) {
        return this.executeAction(value, rule.action, rule.value);
      }
    }
    return value;
  }

  private filterValue(value: unknown, rules: any[]): unknown {
    return Array.isArray(value) ? value.filter(item => 
      rules.some(rule => this.evaluateCondition(item, rule.condition))
    ) : value;
  }

  private validateValue(value: unknown, rules: any[]): unknown {
    const isValid = rules.every(rule => this.evaluateCondition(value, rule.condition));
    if (!isValid) {
      throw new Error(`Validation failed for value: ${value}`);
    }
    return value;
  }

  private normalizeValue(value: unknown, rules: any[]): unknown {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    return value;
  }

  private evaluateCondition(value: unknown, condition: string): boolean {
    // Simple condition evaluation - can be extended
    if (condition === 'exists') return value !== undefined && value !== null;
    if (condition === 'not_empty') return value !== undefined && value !== null && value !== '';
    if (condition.startsWith('equals:')) return value === condition.split(':')[1];
    return true;
  }

  private executeAction(value: unknown, action: string, actionValue?: unknown): unknown {
    switch (action) {
      case 'set':
        return actionValue;
      case 'append':
        return `${value}${actionValue}`;
      case 'prepend':
        return `${actionValue}${value}`;
      case 'multiply':
        return typeof value === 'number' ? value * (actionValue as number) : value;
      default:
        return value;
    }
  }

  private applyTransformation(value: unknown, transformation: string): unknown {
    switch (transformation) {
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'number':
        return typeof value === 'string' ? parseFloat(value) : value;
      case 'string':
        return String(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!(key in current)) current[key] = {};
      return current[key] as Record<string, unknown>;
    }, obj);
    target[lastKey] = value;
  }

  private validateData(data: Record<string, unknown>, rules: any[]): void {
    for (const rule of rules) {
      const value = this.getNestedValue(data, rule.field);
      
      if (rule.type === 'required' && (value === undefined || value === null)) {
        throw new Error(`Required field ${rule.field} is missing`);
      }
      
      if (rule.type === 'type' && typeof value !== rule.value) {
        throw new Error(`Field ${rule.field} must be of type ${rule.value}`);
      }
    }
  }
}

export const createAPIAdapterEngine = (): APIAdapterEngine => {
  return APIAdapterEngine.getInstance();
};