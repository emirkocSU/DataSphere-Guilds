/** @fileoverview Interfaces for Intelligent Routing services. */
import { Uuid } from '../../../types/common.types';
import { Route, RoutingStrategy } from './types';

export interface IRouterService {
  findOptimalRoute(sourceId: Uuid, destinationCandidates: Uuid[], strategy: RoutingStrategy): Promise<Route>;
  getRouteHistory(routeId: Uuid): Promise<Route[]>;
}
