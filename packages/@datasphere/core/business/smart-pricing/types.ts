/**
 * @file packages/@datasphere/core/business/smart-pricing/types.ts
 * @version 2.0.0
 * @description Defines the core data structures and type definitions for the Smart Pricing Engine.
 */

import { CountryCode } from '../../types/api/common';

// Define missing types locally
export type TaskDomain = 'DATA_COLLECTION' | 'IMAGE_ANNOTATION' | 'TEXT_PROCESSING' | 'AUDIO_TRANSCRIPTION';
export type TaskType = 'SIMPLE' | 'COMPLEX' | 'CREATIVE' | 'TECHNICAL';
export type QualityLevel = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
import { CostComponentName, GeographicTier, PriceModifierReasonCode, PriceModifierType, TaskComplexity, UrgencyLevel } from './constants';

// Extracts the literal types from the constant objects
export type PriceModifierReasonCodeType = typeof PriceModifierReasonCode[keyof typeof PriceModifierReasonCode];
export type CostComponentNameType = typeof CostComponentName[keyof typeof CostComponentName];

/**
 * Represents a single adjustment applied to the base price of a task.
 * This ensures full transparency in how the final price is calculated.
 */
export interface PriceModifier {
  type: PriceModifierType;
  value: number;
  reasonCode: PriceModifierReasonCodeType;
  description: string;
  source: string;
}

export interface CostComponent {
  name: CostComponentNameType;
  amount: number;
  currency: string;
}

export interface SmartPricingInput {
  taskId: Uuid;
  taskType: TaskType;
  taskDomain: TaskDomain;
  complexity: TaskComplexity;
  itemCount: number;
  estimatedCompletionTimeMinutes: number; // Added back
  requiredQualityLevel: QualityLevel;
  urgency: UrgencyLevel;
  worker?: { workerId: Uuid; countryCode?: string; reputationScore?: number; }; // Added back
  market?: { demandFactor?: number; geographicTier: GeographicTier; };
  ai?: { assistanceLevel?: 'NONE' | 'LOW' | 'HIGH'; estimatedQcCost?: number; }; // Added back
}

export interface SmartPricingResult {
  calculationId: Uuid;
  timestamp: Date;
  currency: string;
  basePrice: number;
  modifiers: PriceModifier[];
  finalWorkerPayout: number;
  totalCostBreakdown: CostComponent[];
  totalCost: number;
  explanation: string;
  quoteExpiresAt: Date; // Added back
  auditTrail: string[];
}
