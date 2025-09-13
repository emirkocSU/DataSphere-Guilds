/** @fileoverview Event types for Geographic Distribution. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { GeoLocation } from './types';

export interface LocationUpdatedEvent {
  eventId: Uuid;
  location: GeoLocation;
  timestamp: IsoTimestamp;
}
