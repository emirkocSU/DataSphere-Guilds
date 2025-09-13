/**
 * @fileoverview Plugin Sandbox Security
 */

import { EventEmitter } from 'events';
import { PluginSandbox, PluginId, Permission, ResourceLimits } from './types';

export class PluginSandboxManager extends EventEmitter {
  private static instance: PluginSandboxManager;
  private sandboxes = new Map<PluginId, PluginSandbox>();
  private resourceMonitor = new Map<PluginId, ResourceMonitor>();

  private constructor() {
    super();
  }

  static getInstance(): PluginSandboxManager {
    if (!PluginSandboxManager.instance) {
      PluginSandboxManager.instance = new PluginSandboxManager();
    }
    return PluginSandboxManager.instance;
  }

  createSandbox(pluginId: PluginId, permissions: Permission[]): PluginSandbox {
    const sandbox: PluginSandbox = {
      pluginId,
      context: {
        globals: this.createGlobals(permissions),
        modules: this.createModules(permissions),
        apis: this.createAPIs(permissions)
      },
      permissions,
      limits: this.createLimits()
    };

    this.sandboxes.set(pluginId, sandbox);
    this.startResourceMonitoring(pluginId);
    
    this.emit('sandbox-created', sandbox);
    return sandbox;
  }

  destroySandbox(pluginId: PluginId): void {
    const sandbox = this.sandboxes.get(pluginId);
    if (sandbox) {
      this.stopResourceMonitoring(pluginId);
      this.sandboxes.delete(pluginId);
      this.emit('sandbox-destroyed', sandbox);
    }
  }

  getSandbox(pluginId: PluginId): PluginSandbox | undefined {
    return this.sandboxes.get(pluginId);
  }

  checkPermission(pluginId: PluginId, permission: string): boolean {
    const sandbox = this.sandboxes.get(pluginId);
    if (!sandbox) return false;

    return sandbox.permissions.some(p => p.name === permission && p.granted);
  }

  getResourceUsage(pluginId: PluginId): ResourceUsage | undefined {
    const monitor = this.resourceMonitor.get(pluginId);
    return monitor?.getUsage();
  }

  private createGlobals(permissions: Permission[]): Record<string, unknown> {
    const globals: Record<string, unknown> = {};

    if (this.hasPermission(permissions, 'console')) {
      globals.console = console;
    }

    if (this.hasPermission(permissions, 'timers')) {
      globals.setTimeout = setTimeout;
      globals.setInterval = setInterval;
      globals.clearTimeout = clearTimeout;
      globals.clearInterval = clearInterval;
    }

    return globals;
  }

  private createModules(permissions: Permission[]): Record<string, unknown> {
    const modules: Record<string, unknown> = {};

    if (this.hasPermission(permissions, 'crypto')) {
      modules.crypto = require('crypto');
    }

    if (this.hasPermission(permissions, 'path')) {
      modules.path = require('path');
    }

    return modules;
  }

  private createAPIs(permissions: Permission[]): Record<string, unknown> {
    const apis: Record<string, unknown> = {};

    if (this.hasPermission(permissions, 'storage')) {
      apis.storage = this.createStorageAPI();
    }

    if (this.hasPermission(permissions, 'network')) {
      apis.fetch = this.createFetchAPI();
    }

    return apis;
  }

  private createLimits(): ResourceLimits {
    return {
      memory: 100 * 1024 * 1024, // 100MB
      cpu: 50, // 50% CPU
      storage: 10 * 1024 * 1024, // 10MB
      network: 1000, // 1000 requests/hour
      timeout: 30000 // 30 seconds
    };
  }

  private createStorageAPI(): any {
    return {
      get: (key: string) => Promise.resolve(null),
      set: (key: string, value: unknown) => Promise.resolve(),
      delete: (key: string) => Promise.resolve(),
      clear: () => Promise.resolve()
    };
  }

  private createFetchAPI(): any {
    return (url: string, options?: any) => {
      // Sandboxed fetch with restrictions
      return fetch(url, { ...options, timeout: 10000 });
    };
  }

  private hasPermission(permissions: Permission[], name: string): boolean {
    return permissions.some(p => p.name === name && p.granted);
  }

  private startResourceMonitoring(pluginId: PluginId): void {
    const monitor = new ResourceMonitor(pluginId);
    this.resourceMonitor.set(pluginId, monitor);
    monitor.start();
  }

  private stopResourceMonitoring(pluginId: PluginId): void {
    const monitor = this.resourceMonitor.get(pluginId);
    if (monitor) {
      monitor.stop();
      this.resourceMonitor.delete(pluginId);
    }
  }
}

interface ResourceUsage {
  memory: number;
  cpu: number;
  storage: number;
  network: number;
}

class ResourceMonitor {
  private interval?: NodeJS.Timeout;
  private usage: ResourceUsage = { memory: 0, cpu: 0, storage: 0, network: 0 };

  constructor(private pluginId: PluginId) {}

  start(): void {
    this.interval = setInterval(() => {
      this.updateUsage();
    }, 1000);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  getUsage(): ResourceUsage {
    return { ...this.usage };
  }

  private updateUsage(): void {
    // Mock resource usage monitoring
    this.usage.memory = Math.floor(Math.random() * 50 * 1024 * 1024);
    this.usage.cpu = Math.floor(Math.random() * 30);
    this.usage.storage = Math.floor(Math.random() * 5 * 1024 * 1024);
    this.usage.network = Math.floor(Math.random() * 100);
  }
}

export const createPluginSandboxManager = (): PluginSandboxManager => {
  return PluginSandboxManager.getInstance();
};