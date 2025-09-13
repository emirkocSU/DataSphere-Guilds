
/**
 * @fileoverview Centralized, namespace-based export for the entire earnings module.
 * This structure prevents name collisions and provides clear context for each type.
 * @version 3.0.0 - Strategist-3000 Optimized Edition
 * @author DataSphere Guilds Engineering
 */

// Export each submodule under its own namespace.
// This is the cleanest way to handle potential name collisions (e.g., PaymentStatus)
// and makes it clear where each type originates.

export * as Earnings from './earnings.types';
export * as Ledger from './ledger.types';
export * as Payments from './payments.types';
export * as Wallet from './wallet.types';
