/** @fileoverview Core types for Network Topology. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type NodeType = 'SERVER' | 'EDGE_DEVICE' | 'CLIENT';

export interface NetworkNode {
  nodeId: Uuid;
  name: string;
  type: NodeType;
  ipAddress: string;
  location: { latitude: number; longitude: number; };
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  lastSeen: IsoTimestamp;
}
