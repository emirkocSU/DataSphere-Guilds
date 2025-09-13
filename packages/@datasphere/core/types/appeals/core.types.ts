
/**
 * @fileoverview Optimized appeals workflow core types with a modular, inheritance-based structure.
 * @version 3.0.0 - Strategist-3000 Optimized Edition
 * @author DataSphere Guilds Engineering
 */

import type { UUID, ISOTimestamp, Money } from '../common.types';

// =============================================================================
// ENUMS (Unchanged for zero runtime cost)
// =============================================================================

export const enum AppealStatus { DRAFT, SUBMITTED, UNDER_REVIEW, PENDING_EVIDENCE, DECIDED, CLOSED, WITHDRAWN }
export const enum AppealOutcome { GRANTED, DENIED, PARTIALLY_GRANTED, REMANDED }
export const enum EvidenceType { SCREENSHOT, VIDEO_RECORDING, DOCUMENT, SYSTEM_LOG }

// =============================================================================
// BASE INTERFACES (The Core of the Optimization)
// =============================================================================

/**
 * A foundational interface for any record within the appeals system.
 * Ensures that every record has a unique identifier and timestamps.
 */
export interface BaseAppealRecord {
  readonly id: UUID;
  readonly createdAt: ISOTimestamp;
  readonly updatedAt: ISOTimestamp;
}

/**
 * A base for actions performed by a user within the context of a specific appeal.
 */
export interface BaseAppealAction extends BaseAppealRecord {
  readonly appealId: UUID;
  readonly actorId: UUID; // The user performing the action
}

// =============================================================================
// CORE ENTITY INTERFACES (Inheriting from Base Interfaces)
// =============================================================================

/**
 * Represents the main appeal request.
 */
export interface Appeal extends BaseAppealRecord {
  readonly submissionId: UUID;
  readonly appellantId: UUID;
  readonly status: AppealStatus;
  readonly reason: string;
  readonly details: Record<string, unknown>;
}

/**
 * Represents a piece of evidence submitted for an appeal.
 */
export interface Evidence extends BaseAppealAction {
  readonly type: EvidenceType;
  readonly content: string; // e.g., URL to the evidence file, or base64 content
  readonly description: string;
}

/**
 * Represents the final decision made on an appeal.
 */
export interface Decision extends BaseAppealAction {
  readonly outcome: AppealOutcome;
  readonly justification: string;
  readonly effectiveDate: ISOTimestamp;
}

/**
 * Represents a single entry in the audit log for an appeal.
 */
export interface AuditLog extends BaseAppealAction {
  readonly action: string; // e.g., 'STATUS_CHANGED', 'EVIDENCE_SUBMITTED'
  readonly fromState: any;
  readonly toState: any;
}

// =============================================================================
// CREATE/UPDATE REQUEST TYPES (Using TypeScript Utility Types)
// =============================================================================

/**
 * Defines the required data to create a new appeal.
 * Omits system-generated fields like `id`, `createdAt`, `updatedAt`, and `status`.
 */
export type CreateAppealRequest = Omit<Appeal, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

/**
 * Defines the required data to add a new piece of evidence.
 */
export type AddEvidenceRequest = Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Defines the required data to make a decision.
 */
export type MakeDecisionRequest = Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Defines the data for updating an appeal's status or details.
 * Uses `Partial` to make all fields optional.
 */
export type UpdateAppealRequest = Partial<Omit<Appeal, 'id' | 'createdAt' | 'updatedAt'>>;
