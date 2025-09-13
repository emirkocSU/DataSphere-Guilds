/** @fileoverview Interfaces for Network Topology services. */
import { Uuid } from '../../../types/common.types';
import { NetworkNode, NodeType } from './types';

export interface INetworkTopologyService {
  registerNode(node: Omit<NetworkNode, 'nodeId' | 'lastSeen' | 'status'>): Promise<NetworkNode>;
  updateNodeStatus(nodeId: Uuid, status: 'ONLINE' | 'OFFLINE' | 'DEGRADED'): Promise<void>;
  getNetworkMap(): Promise<NetworkNode[]>;
}
