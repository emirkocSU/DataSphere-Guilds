/**
 * @fileoverview Load Balancer
 */

import { Target, LoadBalancerConfig, RequestContext } from './types';

export class LoadBalancer {
  private currentIndex = 0;
  private connections = new Map<string, number>();

  selectTarget(
    targets: Target[],
    config: LoadBalancerConfig,
    context: RequestContext
  ): Target | null {
    const healthyTargets = config.healthyOnly 
      ? targets.filter(t => t.healthy)
      : targets;

    if (healthyTargets.length === 0) return null;

    switch (config.algorithm) {
      case 'round_robin':
        return this.roundRobin(healthyTargets);
      case 'least_connections':
        return this.leastConnections(healthyTargets);
      case 'ip_hash':
        return this.ipHash(healthyTargets, context);
      case 'weighted_round_robin':
        return this.weightedRoundRobin(healthyTargets);
      default:
        return healthyTargets[0];
    }
  }

  private roundRobin(targets: Target[]): Target {
    const target = targets[this.currentIndex % targets.length];
    this.currentIndex++;
    return target;
  }

  private leastConnections(targets: Target[]): Target {
    return targets.reduce((least, target) => {
      const targetKey = `${target.host}:${target.port}`;
      const connections = this.connections.get(targetKey) || 0;
      const leastKey = `${least.host}:${least.port}`;
      const leastConnections = this.connections.get(leastKey) || 0;
      
      return connections < leastConnections ? target : least;
    });
  }

  private ipHash(targets: Target[], context: RequestContext): Target {
    const hash = this.hashString(context.ip);
    const index = hash % targets.length;
    return targets[index];
  }

  private weightedRoundRobin(targets: Target[]): Target {
    const totalWeight = targets.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const target of targets) {
      random -= target.weight;
      if (random <= 0) {
        return target;
      }
    }
    
    return targets[0];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  incrementConnections(target: Target): void {
    const key = `${target.host}:${target.port}`;
    this.connections.set(key, (this.connections.get(key) || 0) + 1);
  }

  decrementConnections(target: Target): void {
    const key = `${target.host}:${target.port}`;
    const current = this.connections.get(key) || 0;
    this.connections.set(key, Math.max(0, current - 1));
  }

  getConnectionCount(target: Target): number {
    const key = `${target.host}:${target.port}`;
    return this.connections.get(key) || 0;
  }
}

export const createLoadBalancer = (): LoadBalancer => {
  return new LoadBalancer();
};