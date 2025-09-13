/** @fileoverview Types for job scheduling. */
import { Uuid, IsoTimestamp } from '../common.types';

export interface RecurringJob {
  readonly scheduleId: Uuid;
  readonly name: string;
  readonly cronExpression: string; // e.g., '0 0 * * *' for daily at midnight
  readonly timezone: string;
  readonly jobType: string;
  readonly defaultPayload: any;
  readonly lastRun?: IsoTimestamp;
  readonly nextRun: IsoTimestamp;
  readonly isActive: boolean;
}
