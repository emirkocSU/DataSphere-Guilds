/**
 * @fileoverview Plugin Registry System
 */

import { EventEmitter } from 'events';
import { Plugin, PluginId, PluginHook, HookId } from './types';

export class PluginRegistry extends EventEmitter {
  private static instance: PluginRegistry;
  private plugins = new Map<PluginId, Plugin>();
  private hooks = new Map<string, PluginHook[]>();
  private hookHandlers = new Map<HookId, Function>();

  private constructor() {
    super();
  }

  static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  register(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    this.registerHooks(plugin);
    this.emit('plugin-registered', plugin);
  }

  unregister(pluginId: PluginId): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.unregisterHooks(plugin);
      this.plugins.delete(pluginId);
      this.emit('plugin-unregistered', plugin);
    }
  }

  getPlugin(pluginId: PluginId): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getHooks(event: string): PluginHook[] {
    return this.hooks.get(event) || [];
  }

  async executeHooks(event: string, context: Record<string, unknown>): Promise<unknown[]> {
    const hooks = this.getHooks(event)
      .filter(hook => this.evaluateConditions(hook, context))
      .sort((a, b) => a.priority - b.priority);

    const results: unknown[] = [];
    
    for (const hook of hooks) {
      try {
        const handler = this.hookHandlers.get(hook.id);
        if (handler) {
          if (hook.async) {
            results.push(await handler(context));
          } else {
            results.push(handler(context));
          }
        }
      } catch (error) {
        this.emit('hook-error', { hook, error });
      }
    }

    return results;
  }

  registerHookHandler(hookId: HookId, handler: Function): void {
    this.hookHandlers.set(hookId, handler);
  }

  unregisterHookHandler(hookId: HookId): void {
    this.hookHandlers.delete(hookId);
  }

  private registerHooks(plugin: Plugin): void {
    for (const hook of plugin.hooks) {
      if (!this.hooks.has(hook.event)) {
        this.hooks.set(hook.event, []);
      }
      this.hooks.get(hook.event)!.push(hook);
    }
  }

  private unregisterHooks(plugin: Plugin): void {
    for (const hook of plugin.hooks) {
      const eventHooks = this.hooks.get(hook.event);
      if (eventHooks) {
        const index = eventHooks.findIndex(h => h.id === hook.id);
        if (index > -1) {
          eventHooks.splice(index, 1);
        }
      }
      this.hookHandlers.delete(hook.id);
    }
  }

  private evaluateConditions(hook: PluginHook, context: Record<string, unknown>): boolean {
    return hook.conditions.every(condition => {
      const value = context[condition.field];
      switch (condition.operator) {
        case 'eq': return value === condition.value;
        case 'ne': return value !== condition.value;
        case 'gt': return (value as number) > (condition.value as number);
        case 'lt': return (value as number) < (condition.value as number);
        default: return true;
      }
    });
  }
}

export const createPluginRegistry = (): PluginRegistry => {
  return PluginRegistry.getInstance();
};