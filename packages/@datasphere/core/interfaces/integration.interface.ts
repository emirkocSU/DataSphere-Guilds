/**
 * @fileoverview Lean, high-performance integration interfaces for unicorn-scale connectivity
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from '../types/common.types';

export interface IIntegrationService {
  // External API integration
  callExternalAPI(config: APICallConfig): Promise<APIResponse>;
  
  // Webhook handling
  processWebhook(webhook: WebhookPayload): Promise<WebhookResult>;
  
  // Event streaming
  publishEvent(event: IntegrationEvent): Promise<void>;
  subscribeToEvents(subscription: EventSubscription): Promise<string>;
  
  // Data synchronization
  syncData(syncConfig: SyncConfig): Promise<SyncResult>;
}

export interface APICallConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface APIResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  duration: number;
}

export interface WebhookPayload {
  source: string;
  eventType: string;
  data: any;
  signature?: string;
  timestamp: Date;
}

export interface WebhookResult {
  processed: boolean;
  message?: string;
  actions?: string[];
}

export interface IntegrationEvent {
  id: UUID;
  type: string;
  source: string;
  data: any;
  timestamp: Date;
}

export interface EventSubscription {
  eventTypes: string[];
  filters?: EventFilter[];
  callback: EventCallback;
}

export interface EventFilter {
  field: string;
  operator: 'equals' | 'contains' | 'in';
  value: any;
}

export interface SyncConfig {
  sourceSystem: string;
  targetSystem: string;
  entityType: string;
  mapping: FieldMapping[];
  batchSize?: number;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: TransformFunction;
}

export interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: SyncError[];
}

export interface SyncError {
  recordId: string;
  error: string;
  field?: string;
}

export type EventCallback = (event: IntegrationEvent) => Promise<void>;
export type TransformFunction = (value: any) => any;