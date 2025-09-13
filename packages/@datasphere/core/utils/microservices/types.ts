/**
 * @fileoverview Microservices Communication Types
 */

export type ServiceId = string;
export type MessageId = string;
export type TraceId = string;
export type ISOTimestamp = string;

export enum ServiceStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded'
}

export enum MessageType {
  COMMAND = 'command',
  EVENT = 'event',
  QUERY = 'query',
  RESPONSE = 'response'
}

export interface ServiceDefinition {
  id: ServiceId;
  name: string;
  version: string;
  endpoints: ServiceEndpoint[];
  healthCheck: HealthCheck;
  authentication: AuthConfig;
  rateLimit: RateLimitConfig;
  createdAt: ISOTimestamp;
}

export interface ServiceEndpoint {
  name: string;
  path: string;
  method: string;
  input: EndpointSchema;
  output: EndpointSchema;
  timeout?: number;
  cached?: boolean;
}

export interface EndpointSchema {
  type: string;
  schema: Record<string, unknown>;
}

export interface HealthCheck {
  path: string;
  interval: number;
  timeout: number;
  retries: number;
}

export interface AuthConfig {
  type: 'jwt' | 'api_key' | 'oauth2';
  issuer?: string;
  audience?: string;
  scopes?: string[];
}

export interface RateLimitConfig {
  requests: number;
  window: number;
  strategy: 'fixed' | 'sliding';
}

export interface ServiceInstance {
  id: string;
  serviceId: ServiceId;
  host: string;
  port: number;
  status: ServiceStatus;
  registeredAt: ISOTimestamp;
  lastHeartbeat: ISOTimestamp;
  metrics: ServiceMetrics;
}

export interface ServiceMetrics {
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface Message {
  id: MessageId;
  type: MessageType;
  source: ServiceId;
  destination: ServiceId;
  topic: string;
  payload: Record<string, unknown>;
  headers: Record<string, string>;
  traceId: TraceId;
  timestamp: ISOTimestamp;
  ttl?: number;
  retryCount?: number;
}

export interface EventBusConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
  maxRetries: number;
  retryDelay: number;
  batchSize: number;
}

export interface EventHandler {
  topic: string;
  handler: (message: Message) => Promise<void>;
  options: EventHandlerOptions;
}

export interface EventHandlerOptions {
  concurrency: number;
  retryPolicy: RetryPolicy;
  acknowledgment: 'auto' | 'manual';
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
}

export interface DistributedTrace {
  traceId: TraceId;
  spans: Span[];
  duration: number;
  status: 'success' | 'error';
  startTime: ISOTimestamp;
  endTime: ISOTimestamp;
}

export interface Span {
  spanId: string;
  parentSpanId?: string;
  traceId: TraceId;
  operationName: string;
  serviceId: ServiceId;
  startTime: ISOTimestamp;
  endTime: ISOTimestamp;
  duration: number;
  tags: Record<string, unknown>;
  status: SpanStatus;
}

export interface SpanStatus {
  code: 'ok' | 'error' | 'timeout';
  message?: string;
}