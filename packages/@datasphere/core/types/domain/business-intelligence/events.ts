/** @fileoverview Event types for Business Intelligence. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { BIReport } from './types';

export interface ReportGeneratedEvent {
  eventId: Uuid;
  report: BIReport;
  timestamp: IsoTimestamp;
}
