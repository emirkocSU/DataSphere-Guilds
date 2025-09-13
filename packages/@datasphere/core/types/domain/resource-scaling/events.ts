/** @fileoverview Event types for Resource Scaling. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { ScalingPolicy, ScalingAction } from './types';

export interface ScalingActionEvent {
  eventId: Uuid;
  policy: ScalingPolicy;
  action: ScalingAction;
  timestamp: IsoTimestamp;
}
