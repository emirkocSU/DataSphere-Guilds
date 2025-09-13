/** @fileoverview Interfaces for Timezone Coordination services. */
import { TimezoneInfo, CoordinatedTime } from './types';

export interface ITimezoneService {
  getCurrentTimeInTimezone(timezoneName: string): Promise<CoordinatedTime>;
  convertTime(time: IsoTimestamp, fromTimezone: string, toTimezone: string): Promise<CoordinatedTime>;
  listSupportedTimezones(): Promise<TimezoneInfo[]>;
}
