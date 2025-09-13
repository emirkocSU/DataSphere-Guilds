/** @fileoverview Business logic for managing a registry of loaded plugins. */
import { Uuid } from '../../../types/common.types';
import { Plugin } from '../../../types/infrastructure/plugin-system.types';

export class PluginRegistry {
  private plugins: Map<Uuid, Plugin> = new Map();

  register(plugin: Plugin) {
    this.plugins.set(plugin.manifest.pluginId, plugin);
    console.log(`Plugin ${plugin.manifest.name} registered.`);
  }

  get(pluginId: Uuid): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}
