/**
 * @fileoverview Service Registry & Discovery
 */

import { EventEmitter } from 'events';
import { ServiceDefinition, ServiceInstance, ServiceId, ServiceStatus } from './types';

export class ServiceRegistry extends EventEmitter {
  private static instance: ServiceRegistry;
  private services = new Map<ServiceId, ServiceDefinition>();
  private instances = new Map<string, ServiceInstance>();
  private healthChecks = new Map<string, NodeJS.Timeout>();

  private constructor() {
    super();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  registerService(service: ServiceDefinition): void {
    this.services.set(service.id, service);
    this.emit('service-registered', service);
  }

  registerInstance(instance: ServiceInstance): void {
    this.instances.set(instance.id, instance);
    this.startHealthCheck(instance);
    this.emit('instance-registered', instance);
  }

  deregisterInstance(instanceId: string): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      this.instances.delete(instanceId);
      this.stopHealthCheck(instanceId);
      this.emit('instance-deregistered', instance);
    }
  }

  getService(serviceId: ServiceId): ServiceDefinition | undefined {
    return this.services.get(serviceId);
  }

  getHealthyInstances(serviceId: ServiceId): ServiceInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.serviceId === serviceId && instance.status === ServiceStatus.HEALTHY);
  }

  getAllInstances(serviceId: ServiceId): ServiceInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.serviceId === serviceId);
  }

  updateInstanceStatus(instanceId: string, status: ServiceStatus): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.status = status;
      instance.lastHeartbeat = new Date().toISOString();
      this.emit('instance-status-changed', instance);
    }
  }

  private startHealthCheck(instance: ServiceInstance): void {
    const service = this.services.get(instance.serviceId);
    if (!service) return;

    const interval = setInterval(async () => {
      try {
        const isHealthy = await this.performHealthCheck(instance, service);
        const newStatus = isHealthy ? ServiceStatus.HEALTHY : ServiceStatus.UNHEALTHY;
        
        if (instance.status !== newStatus) {
          this.updateInstanceStatus(instance.id, newStatus);
        }
      } catch (error) {
        this.updateInstanceStatus(instance.id, ServiceStatus.UNHEALTHY);
      }
    }, service.healthCheck.interval);

    this.healthChecks.set(instance.id, interval);
  }

  private stopHealthCheck(instanceId: string): void {
    const interval = this.healthChecks.get(instanceId);
    if (interval) {
      clearInterval(interval);
      this.healthChecks.delete(instanceId);
    }
  }

  private async performHealthCheck(instance: ServiceInstance, service: ServiceDefinition): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), service.healthCheck.timeout);

    try {
      const response = await fetch(`http://${instance.host}:${instance.port}${service.healthCheck.path}`, {
        method: 'GET',
        signal: controller.signal
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const createServiceRegistry = (): ServiceRegistry => {
  return ServiceRegistry.getInstance();
};