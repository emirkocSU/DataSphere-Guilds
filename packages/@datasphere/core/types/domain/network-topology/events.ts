/** @fileoverview Event types for Network Topology. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { NetworkNode } from './types';

export interface NodeStatusChangedEvent {
  eventId: Uuid;
  node: NetworkNode;
  oldStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  newStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  timestamp: IsoTimestamp;
}
