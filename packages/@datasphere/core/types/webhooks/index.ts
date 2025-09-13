/**
 * @fileoverview Centralized, namespace-based export for the entire webhooks module.
 * This structure prevents name collisions and provides clear context for each type.
 * @version 3.0.0 - Strategist-3000 Optimized Edition
 * @author DataSphere Guilds Engineering
 */

// Export each submodule under its own namespace.
// This is the cleanest way to handle potential name collisions
// and makes it clear where each type originates.

export * as Webhook from './webhook.types';
export * as Events from './events.types';
export * as Delivery from './delivery.types';
