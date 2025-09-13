
/**
 * @file packages/@datasphere/core/business/conversion-funnels/interfaces.ts
 * @version 2.0.0
 * @description Defines the service contract for the Conversion Funnel Analytics Engine.
 */

import { FunnelAnalysisResult, FunnelDefinition, FunnelExperimentResult } from './types';
import { SegmentationAttribute } from './constants';

/**
 * Defines the contract for a service that analyzes user conversion funnels.
 */
export interface IConversionFunnelService {
  /**
   * Analyzes the performance of a given funnel over a specific time period.
   * @param funnel - The definition of the funnel to analyze.
   * @param timePeriod - The start and end dates for the analysis.
   * @param segmentBy - Optional attribute to segment the analysis by.
   * @returns A promise that resolves to the detailed funnel analysis result.
   */
  analyzeFunnel(
    funnel: FunnelDefinition,
    timePeriod: { startDate: string; endDate: string },
    segmentBy?: { attribute: SegmentationAttribute; value: string }
  ): Promise<FunnelAnalysisResult>;

  /**
   * Compares the performance of two or more variations of a funnel for A/B testing.
   * @param experimentId - A unique identifier for the experiment.
   * @param variations - An array of funnel definitions representing the different variations.
   * @param timePeriod - The time period for the analysis.
   * @returns A promise that resolves to the experiment result, including the winning variation.
   */
  compareFunnelVariations(
    experimentId: string,
    variations: FunnelDefinition[],
    timePeriod: { startDate: string; endDate: string }
  ): Promise<FunnelExperimentResult>;

  /**
   * Identifies the biggest drop-off points in a funnel.
   * @param funnel - The definition of the funnel to analyze.
   * @param timePeriod - The time period for the analysis.
   * @returns A promise that resolves to a list of the top 3 steps with the highest drop-off rates.
   */
  getTopDropOffSteps(
    funnel: FunnelDefinition,
    timePeriod: { startDate: string; endDate: string }
  ): Promise<{ stepName: string; dropOffRate: number }[]>;
}
