/**
 * @file packages/@datasphere/core/business/ab-testing/interfaces.ts
 * @version 2.1.0
 * @description Defines the service contract for the A/B Testing & Experimentation Engine,
 *              now with real-time dashboard support.
 */

import { ExperimentAnalysisResult, ExperimentDefinition, LiveExperimentDashboard } from './types';

/**
 * Defines the contract for a service that manages and analyzes A/B tests.
 */
export interface IExperimentationService {
  /**
   * Creates or updates an experiment definition.
   * @param definition - The complete definition of the experiment.
   * @returns A promise that resolves to the saved experiment definition.
   */
  saveExperiment(definition: ExperimentDefinition): Promise<ExperimentDefinition>;

  /**
   * Starts a previously defined experiment.
   * @param experimentId - The ID of the experiment to start.
   * @returns A promise that resolves when the experiment is successfully started.
   */
  startExperiment(experimentId: string): Promise<void>;

  /**
   * Stops or concludes an experiment.
   * @param experimentId - The ID of the experiment to stop.
   * @returns A promise that resolves to the final analysis result of the experiment.
   */
  stopExperiment(experimentId: string): Promise<ExperimentAnalysisResult>;

  /**
   * Assigns a user to a variation for a given experiment.
   * The assignment should be sticky, meaning a user always sees the same variation.
   * @param experimentId - The ID of the active experiment.
   * @param userId - The ID of the user to assign.
   * @returns A promise that resolves to the ID of the assigned variation (e.g., 'control').
   */
  assignUserToVariation(experimentId: string, userId: string): Promise<string>;

  /**
   * Tracks a conversion event for a specific user and experiment.
   * @param experimentId - The ID of the experiment.
   * @param userId - The ID of the user who converted.
   * @param goalId - The ID of the goal that was achieved.
   * @returns A promise that resolves when the event is successfully tracked.
   */
  trackConversion(experimentId: string, userId: string, goalId: string): Promise<void>;

  /**
   * Retrieves the final analysis results for a completed experiment.
   * @param experimentId - The ID of the experiment.
   * @returns A promise that resolves to the experiment analysis result.
   */
  getAnalysisResult(experimentId: string): Promise<ExperimentAnalysisResult>;

  /**
   * [NEW] Retrieves the live, up-to-the-minute data for a running experiment's dashboard.
   * This method is designed to be called periodically by a frontend to refresh the dashboard.
   * @param experimentId - The ID of the running experiment.
   * @returns A promise that resolves to the live dashboard data.
   */
  getLiveDashboardData(experimentId: string): Promise<LiveExperimentDashboard>;
}