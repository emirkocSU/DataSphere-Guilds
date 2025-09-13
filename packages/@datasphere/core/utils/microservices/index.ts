/**
 * @fileoverview Microservices Communication - Main Exports
 */

export { ServiceRegistry, createServiceRegistry } from './service-registry';
export { EventBus, createEventBus } from './event-bus';
export { DistributedTracer, createDistributedTracer } from './distributed-tracer';
export type * from './types';