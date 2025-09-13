
import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import { merge } from 'lodash';

// Define a schema for environment variables for validation
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_VERSION: z.string().default('v2'),
  // Add other critical environment variables here
});

type Environment = z.infer<typeof EnvSchema>;

/**
 * Represents a source for configuration.
 * @interface IConfigSource
 */
interface IConfigSource {
  load(): Promise<Record<string, unknown>>;
}

/**
 * Loads configuration from environment variables.
 * @class EnvConfigSource
 * @implements {IConfigSource}
 */
class EnvConfigSource implements IConfigSource {
  public async load(): Promise<Record<string, unknown>> {
    dotenvConfig(); // Load .env file
    const parsedEnv = EnvSchema.safeParse(process.env);
    if (!parsedEnv.success) {
      console.error('❌ Invalid environment variables:', parsedEnv.error.format());
      throw new Error('Environment variable validation failed.');
    }
    return parsedEnv.data;
  }
}

/**
 * Loads configuration from a JSON file.
 * @class JsonConfigSource
 * @implements {IConfigSource}
 */
class JsonConfigSource implements IConfigSource {
  constructor(private filePath: string) {}

  public async load(): Promise<Record<string, unknown>> {
    try {
      const fileContent = await import(this.filePath);
      return fileContent.default || fileContent;
    } catch (error) {
      console.warn(`⚠️ Could not load JSON config from ${this.filePath}:`, error);
      return {};
    }
  }
}

/**
 * Manages the loading and merging of configurations from various sources.
 * Ensures that configuration is loaded only once (Singleton pattern).
 * @class ConfigLoader
 */
class ConfigLoader {
  private static instance: ConfigLoader;
  private config: Record<string, unknown> = {};
  private isInitialized = false;

  private constructor() {}

  /**
   * Gets the singleton instance of the ConfigLoader.
   * @returns {ConfigLoader} The singleton instance.
   */
  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  /**
   * Initializes the configuration by loading from specified sources.
   * Merges configurations in the order they are provided (later sources override earlier ones).
   * @param {IConfigSource[]} sources - An array of configuration sources.
   * @returns {Promise<void>}
   */
  public async initialize(sources: IConfigSource[]): Promise<void> {
    if (this.isInitialized) {
      console.warn('Configuration has already been initialized.');
      return;
    }

    console.log('🔄 Initializing configuration...');
    let loadedConfigs: Record<string, unknown>[] = [];

    for (const source of sources) {
      const loadedConfig = await source.load();
      loadedConfigs.push(loadedConfig);
    }

    this.config = merge({}, ...loadedConfigs);
    this.isInitialized = true;
    console.log('✅ Configuration initialized successfully.');
  }

  /**
   * Retrieves a configuration value by key.
   * @template T - The expected type of the configuration value.
   * @param {string} key - The key of the configuration value (e.g., 'database.host').
   * @returns {T | undefined} The configuration value or undefined if not found.
   */
  public get<T>(key: string): T | undefined {
    if (!this.isInitialized) {
      throw new Error('ConfigLoader must be initialized before accessing config values.');
    }
    // Basic key retrieval, can be extended to support dot notation e.g., 'database.host'
    return this.config[key] as T;
  }

  /**
   * Retrieves the entire configuration object.
   * @returns {Record<string, unknown>} The full configuration object.
   */
  public getAll(): Record<string, unknown> {
    if (!this.isInitialized) {
      throw new Error('ConfigLoader must be initialized before accessing config values.');
    }
    return this.config;
  }
}

// Export a singleton instance of the loader and the source classes
export const configLoader = ConfigLoader.getInstance();
export { EnvConfigSource, JsonConfigSource };
