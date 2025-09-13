/** @fileoverview Event types for Quality Assurance. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { QAProcess } from './types';

export interface QAProcessCompletedEvent {
  eventId: Uuid;
  process: QAProcess;
  timestamp: IsoTimestamp;
}
