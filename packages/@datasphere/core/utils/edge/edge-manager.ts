/**
 * @fileoverview Edge Computing Manager
 */

import { EventEmitter } from 'events';
import { EdgeNode, EdgeFunction, EdgeRequest, EdgeResponse, EdgeNodeId, FunctionId, RegionId, EdgeMetrics } from './types';

export class EdgeManager extends EventEmitter {
  private static instance: EdgeManager;
  private nodes = new Map<EdgeNodeId, EdgeNode>();
  private functions = new Map<FunctionId, EdgeFunction>();
  private deployments = new Map<string, Set<EdgeNodeId>>();
  private loadBalancer = new Map<RegionId, EdgeNodeId[]>();

  private constructor() {
    super();
    this.startHealthChecks();
  }

  static getInstance(): EdgeManager {
    if (!EdgeManager.instance) {
      EdgeManager.instance = new EdgeManager();
    }
    return EdgeManager.instance;
  }

  registerNode(node: EdgeNode): void {
    this.nodes.set(node.id, node);
    
    if (!this.loadBalancer.has(node.region)) {
      this.loadBalancer.set(node.region, []);
    }
    this.loadBalancer.get(node.region)!.push(node.id);
    
    this.emit('node-registered', node);
  }

  deployFunction(functionConfig: EdgeFunction, regions: RegionId[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const deploymentId = `${functionConfig.id}-${Date.now()}`;
      const targetNodes = new Set<EdgeNodeId>();

      for (const region of regions) {
        const availableNodes = this.getAvailableNodes(region);
        if (availableNodes.length === 0) {
          reject(new Error(`No available nodes in region ${region}`));
          return;
        }

        const selectedNode = this.selectOptimalNode(availableNodes, functionConfig);
        targetNodes.add(selectedNode.id);
      }

      this.deployments.set(deploymentId, targetNodes);
      this.functions.set(functionConfig.id, functionConfig);

      // Update deployment status
      functionConfig.deployment = {
        version: '1.0.0',
        status: 'deployed',
        deployedAt: new Date().toISOString(),
        regions: Object.fromEntries(
          Array.from(targetNodes).map(nodeId => {
            const node = this.nodes.get(nodeId)!;
            return [node.region, {
              status: 'deployed' as const,
              nodeId,
              deployedAt: new Date().toISOString()
            }];
          })
        )
      };

      this.emit('function-deployed', { functionConfig, deploymentId });
      resolve();
    });
  }

  async executeFunction(functionId: FunctionId, request: EdgeRequest): Promise<EdgeResponse> {
    const func = this.functions.get(functionId);
    if (!func) {
      throw new Error(`Function ${functionId} not found`);
    }

    const node = this.selectExecutionNode(request.region, func);
    if (!node) {
      throw new Error(`No available nodes for function execution in region ${request.region}`);
    }

    const startTime = Date.now();
    
    try {
      const response = await this.processRequest(node, func, request);
      const processingTime = Date.now() - startTime;
      
      this.updateFunctionMetrics(func, processingTime, false);
      this.updateNodeMetrics(node, processingTime);
      
      return {
        ...response,
        processingTime,
        cached: false
      };
    } catch (error) {
      this.updateFunctionMetrics(func, Date.now() - startTime, true);
      throw error;
    }
  }

  getNodeHealth(nodeId: EdgeNodeId): EdgeMetrics | null {
    const node = this.nodes.get(nodeId);
    return node ? node.metrics : null;
  }

  getRegionNodes(region: RegionId): EdgeNode[] {
    return Array.from(this.nodes.values()).filter(node => node.region === region);
  }

  private getAvailableNodes(region: RegionId): EdgeNode[] {
    return this.getRegionNodes(region).filter(node => 
      node.status === 'active' && 
      node.resources.cpu.utilization < 80 &&
      node.resources.memory.utilization < 80
    );
  }

  private selectOptimalNode(nodes: EdgeNode[], func: EdgeFunction): EdgeNode {
    return nodes.reduce((best, current) => {
      const bestScore = this.calculateNodeScore(best, func);
      const currentScore = this.calculateNodeScore(current, func);
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateNodeScore(node: EdgeNode, func: EdgeFunction): number {
    const cpuScore = (100 - node.resources.cpu.utilization) / 100;
    const memoryScore = (100 - node.resources.memory.utilization) / 100;
    const latencyScore = Math.max(0, 1 - (node.metrics.averageLatency / 1000));
    
    return (cpuScore * 0.4 + memoryScore * 0.4 + latencyScore * 0.2);
  }

  private selectExecutionNode(region: RegionId, func: EdgeFunction): EdgeNode | null {
    const availableNodes = this.getAvailableNodes(region);
    return availableNodes.length > 0 ? this.selectOptimalNode(availableNodes, func) : null;
  }

  private async processRequest(node: EdgeNode, func: EdgeFunction, request: EdgeRequest): Promise<EdgeResponse> {
    // Simulate function execution
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { success: true, nodeId: node.id },
      cached: false,
      processingTime: 0,
      size: 1024
    };
  }

  private updateFunctionMetrics(func: EdgeFunction, processingTime: number, isError: boolean): void {
    func.metrics.invocations++;
    func.metrics.duration = (func.metrics.duration + processingTime) / 2;
    
    if (isError) {
      func.metrics.errors++;
    }
    
    this.emit('function-metrics-updated', func);
  }

  private updateNodeMetrics(node: EdgeNode, processingTime: number): void {
    node.metrics.requestsPerSecond++;
    node.metrics.averageLatency = (node.metrics.averageLatency + processingTime) / 2;
    
    this.emit('node-metrics-updated', node);
  }

  private startHealthChecks(): void {
    setInterval(() => {
      for (const node of this.nodes.values()) {
        this.performHealthCheck(node);
      }
    }, 30000);
  }

  private performHealthCheck(node: EdgeNode): void {
    const now = new Date().toISOString();
    const lastHeartbeat = new Date(node.lastHeartbeat).getTime();
    const currentTime = new Date(now).getTime();
    
    if (currentTime - lastHeartbeat > 60000) {
      node.status = 'inactive';
      this.emit('node-unhealthy', node);
    }
  }
}

export const createEdgeManager = (): EdgeManager => {
  return EdgeManager.getInstance();
};