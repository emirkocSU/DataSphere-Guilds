/** @fileoverview Event types for User Behavior Analytics. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export interface UserSegmentChangedEvent {
  eventId: Uuid;
  userId: Uuid;
  oldSegment: UserSegment;
  newSegment: UserSegment;
  timestamp: IsoTimestamp;
}
