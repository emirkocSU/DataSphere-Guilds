/** @fileoverview Event types for Timezone Coordination. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { CoordinatedTime } from './types';

export interface TimezoneChangeEvent {
  eventId: Uuid;
  oldTime: CoordinatedTime;
  newTime: CoordinatedTime;
  timestamp: IsoTimestamp;
}
