/** @fileoverview Core types for Timezone Coordination. */
import { IsoTimestamp } from '../../../types/common.types';

export interface TimezoneInfo {
  name: string; // e.g., 'America/New_York'
  offset: string; // e.g., '-05:00'
  isDst: boolean; // Is Daylight Saving Time active
}

export interface CoordinatedTime {
  utcTime: IsoTimestamp;
  localTime: IsoTimestamp;
  timezone: TimezoneInfo;
}
