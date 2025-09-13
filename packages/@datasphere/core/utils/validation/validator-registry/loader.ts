/**
 * @fileoverview The PluginLoader, responsible for discovering and loading plugins.
 *
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { ValidatorRegistry } from './registry';
import { PluginManifest, ValidatorPlugin } from './types';
import { DependencyMismatchError, EngineVersionMismatchError, PluginNotFoundError } from './errors';

// Simple semver comparison for cross-platform compatibility
const satisfiesVersion = (current: string, required: string): boolean => {
  const [currentMajor, currentMinor] = current.split('.').map(Number);
  const [requiredMajor, requiredMinor] = required.split('.').map(Number);
  return currentMajor > requiredMajor || 
         (currentMajor === requiredMajor && currentMinor >= requiredMinor);
};

const CURRENT_ENGINE_VERSION = '1.0.0';

export class PluginLoader {
  /**
   * Registers a pre-loaded plugin with validation.
   * @param {ValidatorPlugin} plugin The plugin instance to register.
   * @param {PluginManifest} manifest The plugin's manifest.
   */
  public static async registerPlugin(plugin: ValidatorPlugin, manifest: PluginManifest): Promise<void> {
    plugin.manifest = manifest;
    this.validateEngineVersion(manifest);
    this.validateDependencies(manifest);
    ValidatorRegistry.register(plugin);
  }

  /**
   * Loads all valid plugins from a specified directory.
   * Note: This method is not supported in React Native - use registerPlugin instead.
   * @param {string} pluginsDirectory The absolute path to the directory containing plugin packages.
   */
  public static async loadFromDirectory(pluginsDirectory: string): Promise<void> {
    console.warn('Dynamic plugin loading from filesystem is not supported in React Native. Use registerPlugin() instead.');
  }

  private static validateEngineVersion(manifest: PluginManifest): void {
    if (!satisfiesVersion(CURRENT_ENGINE_VERSION, manifest.engineVersion)) {
      throw new EngineVersionMismatchError(manifest.name, manifest.engineVersion, CURRENT_ENGINE_VERSION);
    }
  }

  private static validateDependencies(manifest: PluginManifest): void {
    if (!manifest.dependencies) return;

    for (const depName in manifest.dependencies) {
      const requiredVersion = manifest.dependencies[depName];
      try {
        const installedPlugin = ValidatorRegistry.get(depName);
        if (!satisfiesVersion(installedPlugin.manifest.version, requiredVersion)) {
          throw new DependencyMismatchError(manifest.name, depName, requiredVersion, installedPlugin.manifest.version);
        }
      } catch (error) {
        if (error instanceof PluginNotFoundError) {
            throw new DependencyMismatchError(manifest.name, depName, requiredVersion, 'not found');
        }
        throw error;
      }
    }
  }
}
