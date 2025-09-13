/** @fileoverview Types for the extensible plugin system. */
import { Uuid } from '../../types/common.types';

export type PluginStatus = 'ENABLED' | 'DISABLED' | 'ERROR';

export interface PluginManifest {
  readonly pluginId: Uuid;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly entryPoint: string; // Path to the main plugin file
  readonly dependencies?: Record<string, string>; // Plugin dependencies
}

export interface Plugin {
  readonly manifest: PluginManifest;
  readonly status: PluginStatus;
  readonly loadedAt: Date;
  // The actual plugin code/instance would be here
}
