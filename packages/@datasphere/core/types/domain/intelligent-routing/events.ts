/** @fileoverview Event types for Intelligent Routing. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { Route } from './types';

export interface RouteSelectedEvent {
  eventId: Uuid;
  route: Route;
  timestamp: IsoTimestamp;
}
