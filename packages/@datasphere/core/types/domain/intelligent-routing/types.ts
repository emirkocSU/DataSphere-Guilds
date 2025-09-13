/** @fileoverview Core types for Intelligent Routing. */
import { Uuid } from '../../../types/common.types';

export type RoutingStrategy = 'LEAST_LATENCY' | 'LEAST_COST' | 'HIGHEST_REPUTATION';

export interface Route {
  routeId: Uuid;
  source: Uuid; // e.g., Task ID
  destination: Uuid; // e.g., Worker ID
  strategy: RoutingStrategy;
  cost: number;
  latency: number;
}
