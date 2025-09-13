/**
 * Babel Configuration for DataSphere Guilds
 * 
 * Production-grade transpilation setup for Expo/React Native/TypeScript
 * Supports: iOS, Android, Web (React Native Web)
 * 
 * Features:
 * - Expo SDK 49+ compatibility
 * - React Native 0.72+ support
 * - TypeScript path aliases synchronized with tsconfig.json
 * - Advanced optimizations for production builds
 * - Tree shaking and dead code elimination
 * - React Fast Refresh support
 * - Reanimated 2 animations
 * - Environment-specific configurations
 * 
 * @version 2.0.0
 */

module.exports = function (api) {
  // Enable config caching based on NODE_ENV
  api.cache.using(() => process.env.NODE_ENV);

  // Detect environment
  const isProduction = api.env('production');
  const isDevelopment = api.env('development');
  const isTest = api.env('test');

  // Platform detection for conditional plugins
  const isWeb = process.env.PLATFORM === 'web';
  const isNative = !isWeb;

  return {
    // Base preset for Expo (includes React Native, Flow, TypeScript, and modern JS)
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic', // New JSX Transform
          lazyImports: true, // Lazy load imports for better performance
          native: {
            // Native-specific optimizations
            disableImportExportTransform: false,
            unstable_transformProfile: isProduction ? 'hermes-stable' : 'default',
          },
          web: {
            // Web-specific optimizations
            disableImportExportTransform: true,
            lazyImports: true,
          },
        },
      ],
    ],

    // Plugins array with conditional loading
    plugins: [
      // ===== Core Functionality =====
      
      // Expo Router - File-based navigation
      ['expo-router/babel', { root: './src' }],

      // Module resolver for path aliases
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.native.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.native.tsx',
            '.tsx',
            '.ios.js',
            '.android.js',
            '.native.js',
            '.js',
            '.ios.jsx',
            '.android.jsx',
            '.native.jsx',
            '.jsx',
            '.json',
            '.cjs',
            '.mjs',
          ],
          alias: {
            // Source directories
            '@api': './src/api',
            '@assets': './src/assets',
            '@components': './src/components',
            '@config': './src/config',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@i18n': './src/i18n',
            '@models': './src/models',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@services': './src/services',
            '@state': './src/state',
            '@theme': './src/theme',
            '@types': './src/types',
            '@utils': './src/utils',
            
            // Test utilities (only in test environment)
            ...(isTest && {
              '@test-utils': './src/__tests__/utils',
              '@mocks': './src/__mocks__',
            }),
          },
        },
      ],

      // ===== React & React Native Optimizations =====

      // React Refresh for Fast Refresh in development
      isDevelopment && !isTest && 'react-refresh/babel',

      // React Native specific optimizations
      isNative && [
        'react-native-reanimated/plugin',
        {
          relativeSourceLocation: true,
          globals: ['__scanQRCodes', '__scanFaces'],
        },
      ],

      // ===== Transform Plugins =====

      // Class properties and private methods
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],

      // Decorators support (legacy mode for MobX compatibility)
      ['@babel/plugin-proposal-decorators', { legacy: true }],

      // Modern JavaScript features
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-logical-assignment-operators',
      '@babel/plugin-proposal-numeric-separator',

      // Async/await optimizations
      ['@babel/plugin-transform-async-to-generator', { method: 'coroutine' }],

      // ===== Production Optimizations =====

      // Remove console statements in production
      isProduction && [
        'transform-remove-console',
        {
          exclude: ['error', 'warn', 'info'],
        },
      ],

      // Remove PropTypes in production
      isProduction && [
        'babel-plugin-transform-react-remove-prop-types',
        {
          mode: 'remove',
          removeImport: true,
          additionalLibraries: ['react-native-safe-area-context'],
        },
      ],

      // Optimize React constant elements
      isProduction && '@babel/plugin-transform-react-constant-elements',

      // Inline React elements for better performance
      isProduction && '@babel/plugin-transform-react-inline-elements',

      // ===== Development & Debug Tools =====

      // Better error messages in development
      isDevelopment && [
        'babel-plugin-transform-react-jsx-source',
        'babel-plugin-transform-react-jsx-self',
      ],

      // ===== Code Quality & Analysis =====

      // Import path linting
      !isProduction && [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: true,
          allowUndefined: false,
          verbose: false,
        },
      ],

      // Styled components support (if used)
      [
        'babel-plugin-styled-components',
        {
          ssr: isWeb,
          displayName: isDevelopment,
          fileName: isDevelopment,
          meaninglessFileNames: ['index', 'styles'],
          minify: isProduction,
          transpileTemplateLiterals: isProduction,
          pure: isProduction,
        },
      ],

      // ===== Platform-specific Plugins =====

      // Web-specific optimizations
      isWeb && [
        'babel-plugin-react-native-web',
        {
          commonjs: true,
        },
      ],

      // ===== Testing Plugins =====

      // Jest hoist for better test performance
      isTest && 'babel-plugin-jest-hoist',

      // Dynamic import support for tests
      isTest && '@babel/plugin-syntax-dynamic-import',

      // ===== Bundle Size Optimizations =====

      // Lodash optimization
      ['babel-plugin-lodash', { id: ['lodash', 'recompose'] }],

      // Date-fns optimization
      ['babel-plugin-date-fns', { includeLocales: ['en-US'] }],

      // Transform imports for tree shaking
      [
        'babel-plugin-transform-imports',
        {
          '@reduxjs/toolkit': {
            transform: '@reduxjs/toolkit/dist/${member}',
            preventFullImport: true,
            skipDefaultConversion: true,
          },
          'react-native-vector-icons': {
            transform: 'react-native-vector-icons/${member}',
            preventFullImport: true,
          },
          lodash: {
            transform: 'lodash/${member}',
            preventFullImport: true,
          },
        },
      ],

      // ===== Final Plugins (must be last) =====

      // Inline environment variables
      [
        'transform-inline-environment-variables',
        {
          include: [
            'NODE_ENV',
            'EXPO_PUBLIC_API_URL',
            'EXPO_PUBLIC_APP_VARIANT',
          ],
        },
      ],
    ].filter(Boolean), // Remove falsy values (conditional plugins)

    // Environment-specific configurations
    env: {
      production: {
        plugins: [
          // Additional production-only plugins
          'babel-plugin-minify-dead-code-elimination',
          ['babel-plugin-minify-mangle-names', { topLevel: true }],
          'babel-plugin-minify-flip-comparisons',
          'babel-plugin-minify-guarded-expressions',
          'babel-plugin-minify-simplify',
        ],
      },
      development: {
        // Development-specific settings
        compact: false,
        comments: true,
        sourceMaps: true,
      },
      test: {
        // Test-specific settings
        plugins: [
          // Ensure all imports are transformed for Jest
          '@babel/plugin-transform-modules-commonjs',
          '@babel/plugin-transform-runtime',
        ],
      },
    },

    // Global Babel options
    assumptions: {
      // Modern JavaScript assumptions for smaller output
      constantReexports: true,
      constantSuper: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      iterableIsArray: true,
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      noIncompleteNsImportDetection: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      pureGetters: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
      superIsCallableConstructor: true,
    },

    // Source type
    sourceType: 'unambiguous',

    // Ignore patterns
    ignore: [
      'node_modules/**',
      'web-build/**',
      'dist/**',
      '.expo/**',
      '.expo-shared/**',
    ],

    // Only include source files
    only: isTest ? undefined : ['./src', './App.tsx', './index.js'],
  };
};
  