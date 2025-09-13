/**
 * @fileoverview Plugin Loader System
 */

import { EventEmitter } from 'events';
import { Plugin, PluginId, PluginStatus, ValidationResult, PluginManifest, PluginType } from './types';

export class PluginLoader extends EventEmitter {
  private static instance: PluginLoader;
  private loadedPlugins = new Map<PluginId, Plugin>();
  private loadOrder: PluginId[] = [];

  private constructor() {
    super();
  }

  static getInstance(): PluginLoader {
    if (!PluginLoader.instance) {
      PluginLoader.instance = new PluginLoader();
    }
    return PluginLoader.instance;
  }

  async load(pluginPath: string): Promise<Plugin> {
    const manifest = await this.loadManifest(pluginPath);
    const plugin = await this.createPlugin(manifest, pluginPath);
    
    const validation = await this.validate(plugin);
    if (!validation.isValid) {
      throw new Error(`Plugin validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    await this.resolveDependencies(plugin);
    await this.installPlugin(plugin);
    
    this.loadedPlugins.set(plugin.id, plugin);
    this.updateLoadOrder(plugin.id);
    
    this.emit('plugin-loaded', plugin);
    return plugin;
  }

  async unload(pluginId: PluginId): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) return;

    await this.deactivatePlugin(plugin);
    this.loadedPlugins.delete(pluginId);
    this.loadOrder = this.loadOrder.filter(id => id !== pluginId);
    
    this.emit('plugin-unloaded', plugin);
  }

  async reload(pluginId: PluginId): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) return;

    await this.unload(pluginId);
    await this.load(plugin.main);
  }

  async validate(plugin: Plugin): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Validate manifest
    if (!plugin.name) errors.push({ field: 'name', message: 'Plugin name is required', code: 'MISSING_NAME' });
    if (!plugin.version) errors.push({ field: 'version', message: 'Plugin version is required', code: 'MISSING_VERSION' });
    if (!plugin.main) errors.push({ field: 'main', message: 'Main file is required', code: 'MISSING_MAIN' });

    // Validate dependencies
    for (const dep of plugin.dependencies) {
      if (dep.required && !this.isDependencyAvailable(dep.name, dep.version)) {
        errors.push({ field: 'dependencies', message: `Required dependency ${dep.name}@${dep.version} not found`, code: 'MISSING_DEPENDENCY' });
      }
    }

    // Validate permissions
    for (const permission of plugin.permissions) {
      if (!this.isPermissionValid(permission)) {
        warnings.push({ field: 'permissions', message: `Unknown permission: ${permission}`, code: 'UNKNOWN_PERMISSION' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  getPlugin(pluginId: PluginId): Plugin | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  getLoadOrder(): PluginId[] {
    return [...this.loadOrder];
  }

  private async loadManifest(pluginPath: string): Promise<PluginManifest> {
    // Mock manifest loading
    return {
      name: 'sample-plugin',
      version: '1.0.0',
      description: 'A sample plugin',
      author: 'DataSphere',
      license: 'MIT',
      homepage: 'https://example.com',
      repository: 'https://github.com/example/plugin',
      keywords: ['plugin', 'sample'],
      engines: { node: '>=14.0.0' },
      files: ['index.js', 'package.json'],
      scripts: { test: 'npm test' }
    };
  }

  private async createPlugin(manifest: PluginManifest, pluginPath: string): Promise<Plugin> {
    return {
      id: `plugin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: manifest.name,
      version: manifest.version,
      type: PluginType.EXTENSION,
      status: PluginStatus.PENDING,
      description: manifest.description,
      author: manifest.author,
      main: pluginPath,
      dependencies: [],
      permissions: [],
      hooks: [],
      config: {
        schema: { type: 'object', properties: {}, required: [] },
        defaults: {},
        current: {},
        validation: []
      },
      manifest,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async resolveDependencies(plugin: Plugin): Promise<void> {
    for (const dep of plugin.dependencies) {
      if (dep.required && !this.isDependencyAvailable(dep.name, dep.version)) {
        throw new Error(`Required dependency ${dep.name}@${dep.version} not available`);
      }
    }
  }

  private async installPlugin(plugin: Plugin): Promise<void> {
    // Mock installation process
    plugin.status = PluginStatus.ACTIVE;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private async deactivatePlugin(plugin: Plugin): Promise<void> {
    plugin.status = PluginStatus.INACTIVE;
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private isDependencyAvailable(name: string, version: string): boolean {
    // Mock dependency check
    return true;
  }

  private isPermissionValid(permission: string): boolean {
    const validPermissions = ['read', 'write', 'execute', 'network', 'storage'];
    return validPermissions.includes(permission);
  }

  private updateLoadOrder(pluginId: PluginId): void {
    const plugin = this.loadedPlugins.get(pluginId);
    if (!plugin) return;

    // Simple load order based on dependencies
    const dependencyIds = plugin.dependencies
      .filter(dep => dep.type === 'plugin')
      .map(dep => dep.name);

    let insertIndex = 0;
    for (const depId of dependencyIds) {
      const depIndex = this.loadOrder.indexOf(depId);
      if (depIndex > -1) {
        insertIndex = Math.max(insertIndex, depIndex + 1);
      }
    }

    this.loadOrder.splice(insertIndex, 0, pluginId);
  }
}

export const createPluginLoader = (): PluginLoader => {
  return PluginLoader.getInstance();
};