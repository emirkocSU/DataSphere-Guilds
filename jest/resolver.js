/**
 * Custom Jest Resolver for DataSphere Guilds
 * 
 * Handles platform-specific file resolution and module aliasing
 * Supports .native.js, .ios.js, .android.js, .web.js extensions
 * 
 * @version 3.0.0
 */

const path = require('path');
const fs = require('fs');

// Get current platform from environment
const platform = process.env.TEST_PLATFORM || 'native';
const isNative = platform === 'native';
const isWeb = platform === 'web';

// Platform-specific extensions in priority order
const extensions = {
  native: [
    '.native.ts',
    '.native.tsx',
    '.native.js',
    '.native.jsx',
    '.ios.ts',
    '.ios.tsx',
    '.ios.js',
    '.ios.jsx',
    '.android.ts',
    '.android.tsx',
    '.android.js',
    '.android.jsx',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
  ],
  web: [
    '.web.ts',
    '.web.tsx',
    '.web.js',
    '.web.jsx',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
  ],
};

// Module aliases
const aliases = {
  '@': 'src',
  '@components': 'src/components',
  '@screens': 'src/screens',
  '@services': 'src/services',
  '@hooks': 'src/hooks',
  '@utils': 'src/utils',
  '@config': 'src/config',
  '@assets': 'src/assets',
  '@api': 'src/api',
  '@state': 'src/state',
  '@types': 'src/types',
  '@i18n': 'src/i18n',
  '@navigation': 'src/navigation',
  '@contexts': 'src/contexts',
  '@models': 'src/models',
  '@theme': 'src/theme',
};

// Cache for resolved modules
const resolveCache = new Map();

/**
 * Custom resolver function
 */
module.exports = (request, options) => {
  // Check cache first
  const cacheKey = `${request}:${options.basedir}:${platform}`;
  if (resolveCache.has(cacheKey)) {
    return resolveCache.get(cacheKey);
  }

  try {
    // Handle module aliases
    const aliasedRequest = resolveAlias(request, options);
    
    // Try platform-specific resolution
    const resolved = resolvePlatformSpecific(aliasedRequest, options) ||
                    // Fallback to default resolver
                    options.defaultResolver(aliasedRequest, {
                      ...options,
                      // Add platform-specific extensions
                      extensions: [...extensions[platform], ...(options.extensions || [])],
                    });
    
    // Cache the result
    resolveCache.set(cacheKey, resolved);
    
    return resolved;
  } catch (error) {
    // Clear cache on error
    resolveCache.delete(cacheKey);
    
    // Log detailed error in debug mode
    if (process.env.DEBUG_RESOLVER === 'true') {
      console.error(`Failed to resolve: ${request}`);
      console.error(`Base directory: ${options.basedir}`);
      console.error(`Platform: ${platform}`);
      console.error(error);
    }
    
    throw error;
  }
};

/**
 * Resolve module aliases
 */
function resolveAlias(request, options) {
  // Check if request starts with an alias
  for (const [alias, replacement] of Object.entries(aliases)) {
    if (request === alias) {
      return path.join(options.rootDir, replacement);
    }
    
    if (request.startsWith(alias + '/')) {
      return path.join(options.rootDir, request.replace(alias, replacement));
    }
  }
  
  return request;
}

/**
 * Resolve platform-specific files
 */
function resolvePlatformSpecific(request, options) {
  // Skip if not a relative import or already has platform extension
  if (!request.startsWith('.') && !request.startsWith('/')) {
    return null;
  }
  
  // Check if request already has a platform-specific extension
  const platformExtensions = extensions[platform];
  if (platformExtensions.some(ext => request.endsWith(ext))) {
    return null;
  }
  
  // Try to resolve with platform-specific extensions
  const basePath = path.resolve(options.basedir, request);
  
  for (const ext of platformExtensions) {
    const candidatePath = basePath + ext;
    
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
    
    // Also try index files
    const indexPath = path.join(basePath, 'index' + ext);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }
  
  return null;
}

// Export utilities for testing
module.exports.clearCache = () => {
  resolveCache.clear();
};

module.exports.getCacheSize = () => {
  return resolveCache.size;
};

module.exports.getExtensions = () => {
  return extensions[platform];
};

// Log resolver initialization
console.log(`🔍 Jest Resolver initialized for platform: ${platform}`); 