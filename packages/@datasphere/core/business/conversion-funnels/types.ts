
/**
 * @file packages/@datasphere/core/business/conversion-funnels/types.ts
 * @version 2.0.0
 * @description Defines the core data structures for the Conversion Funnel Analytics Engine.
 */

import { FunnelName, FunnelStepEvent, SegmentationAttribute } from './constants';

/**
 * Represents a single step within a conversion funnel definition.
 */
export interface FunnelStep {
  stepId: string; // e.g., 'signup', 'profile_completion'
  stepName: string; // Human-readable name, e.g., "User Signed Up"
  /** The analytics event that signifies the completion of this step. */
  completionEvent: typeof FunnelStepEvent[keyof typeof FunnelStepEvent];
}

/**
 * Defines the complete, ordered structure of a conversion funnel.
 */
export interface FunnelDefinition {
  funnelName: FunnelName;
  description: string;
  steps: FunnelStep[];
}

/**
 * Represents the analysis result for a single step in the funnel.
 */
export interface FunnelStepAnalysis {
  stepId: string;
  stepName: string;
  /** The total number of unique users who reached this step. */
  userCount: number;
  /** The conversion rate from the immediately preceding step to this one. */
  conversionRateFromPrevious: number; // e.g., 0.85 for 85%
  /** The conversion rate from the very first step of the funnel to this one. */
  conversionRateFromStart: number;
  /** The average time it took users to get from the previous step to this one (in hours). */
  avgTimeToConvertHours?: number;
}

/**
 * The complete analysis result for a specific funnel, optionally segmented.
 */
export interface FunnelAnalysisResult {
  analysisId: string;
  funnelName: FunnelName;
  generatedAt: string; // ISO 8601
  timePeriod: {
    startDate: string;
    endDate: string;
  };
  /** The overall conversion rate from the first step to the last step. */
  overallConversionRate: number;
  /** The detailed analysis for each step in the funnel. */
  stepAnalysis: FunnelStepAnalysis[];
  /** Optional segmentation data if the analysis was segmented. */
  segment?: {
    attribute: SegmentationAttribute;
    value: string;
  };
}

/**
 * Represents the result of an A/B test comparing two or more funnel variations.
 */
export interface FunnelExperimentResult {
  experimentId: string;
  funnelName: FunnelName;
  /** A map where keys are variation names (e.g., 'control', 'variation_A') and values are their analysis results. */
  resultsByVariation: Record<string, FunnelAnalysisResult>;
  /** The name of the winning variation, if statistically significant. */
  winningVariation?: string;
  /** The confidence level of the result. */
  statisticalSignificance: number;
}
