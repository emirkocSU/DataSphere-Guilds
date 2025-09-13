/**
 * Jest Configuration for DataSphere Guilds
 * 
 * Enterprise-grade Jest configuration with multi-platform support,
 * advanced coverage settings, performance optimizations, and CI/CD integration
 * 
 * Features:
 * - Multi-platform testing (iOS, Android, Web)
 * - TypeScript support with path aliases
 * - Advanced coverage thresholds and reporting
 * - Performance optimizations (caching, parallel execution)
 * - CI/CD environment detection and optimization
 * - Custom test environments
 * - Snapshot testing configuration
 * - Module name mapping for all dependencies
 * - Test result processors and reporters
 * 
 * @version 3.0.0
 * @author DataSphere Guilds Team
 */

const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

// Detect environment
const isCI = process.env.CI === 'true';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const testType = process.env.TEST_TYPE || 'unit';
const platform = process.env.TEST_PLATFORM || 'native';

// Performance settings based on environment
const maxWorkers = isCI ? '50%' : '75%';
const cache = !isCI; // Disable cache in CI for fresh runs
const bail = isCI ? 1 : 0; // Stop on first test failure in CI

// Coverage thresholds
const coverageThresholds = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/services/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85,
  },
  './src/utils/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
  './src/components/': {
    branches: 75,
    functions: 75,
    lines: 75,
    statements: 75,
  },
};

// Platform-specific configurations
const platformConfigs = {
  native: {
    preset: 'react-native',
    setupFiles: ['<rootDir>/jest/setup.native.ts'],
    testEnvironment: 'node',
    transformIgnorePatterns: [
      'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo|@expo|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-native-async-storage|@react-native-firebase|react-native-vector-icons|react-native-elements|lottie-react-native|react-native-maps|react-native-webview|react-native-permissions|react-native-device-info|react-native-fs|react-native-share|react-native-image-picker|react-native-document-picker|react-native-video|react-native-sound|react-native-audio|react-native-voice|react-native-tts|react-native-biometrics|react-native-keychain|react-native-sensitive-info|react-native-mmkv|react-native-fast-image|react-native-linear-gradient|react-native-shimmer-placeholder|react-native-skeleton-placeholder|react-native-progress|react-native-circular-progress|react-native-chart-kit|react-native-gifted-charts|react-native-calendars|react-native-date-picker|react-native-modal|react-native-bottom-sheet|react-native-action-sheet|react-native-popup-menu|react-native-toast-message|react-native-flash-message|react-native-snackbar|react-native-haptic-feedback|react-native-splash-screen|react-native-bootsplash|react-native-orientation-locker|react-native-keep-awake|react-native-background-timer|react-native-background-fetch|react-native-push-notification|@notifee/react-native|react-native-onesignal|react-native-branch|react-native-appsflyer|react-native-mixpanel|react-native-amplitude|@segment/analytics-react-native|react-native-firebase|@sentry/react-native|react-native-flipper|react-native-performance|react-native-logs|@shopify/react-native-skia|react-native-vision-camera|react-native-qrcode-scanner|react-native-barcode-mask|react-native-mlkit|@react-native-ml-kit|@tensorflow/tfjs-react-native|react-native-tflite|react-native-pytorch-core|react-native-onnxruntime|openai|@anthropic-ai/sdk|@google-cloud/aiplatform|@aws-sdk|azure-cognitiveservices|@huggingface|replicate|cohere-ai|@pinecone-database/pinecone|@supabase/supabase-js|@prisma/client|realm|@apollo/client|graphql|socket.io-client|@tanstack/react-query|swr|@reduxjs/toolkit|react-redux|zustand|valtio|jotai|recoil|mobx|mobx-react-lite|formik|react-hook-form|yup|zod|joi|ajv|date-fns|moment|dayjs|luxon|numeral|accounting|currency.js|dinero.js|lodash|ramda|immer|nanoid|uuid|crypto-js|bcryptjs|jsonwebtoken|axios|ky|got|node-fetch|superagent|@react-native-community/netinfo|@react-native-cookies/cookies|react-native-url-polyfill|react-native-get-random-values|react-native-crypto|react-native-randombytes|react-native-sodium|react-native-rsa-native|react-native-aes-crypto|react-native-simple-crypto|react-native-fingerprint-scanner|react-native-touch-id|react-native-face-id|react-native-passcode-auth|react-native-pin-view|react-native-confirmation-code-field|react-native-otp-inputs|react-native-sms-retriever|react-native-sms-user-consent|react-native-contacts|react-native-communications|react-native-email-link|react-native-deep-linking|react-native-app-link|react-native-rate|react-native-store-review|react-native-iap|react-native-billing|react-native-payments|react-native-stripe-sdk|tipsi-stripe|react-native-square-in-app-payments|react-native-paypal|react-native-razorpay|react-native-paytm|react-native-phonepe|react-native-google-pay|react-native-apple-pay|react-native-samsung-pay|react-native-nfc-manager|react-native-ble-plx|react-native-ble-manager|react-native-bluetooth-classic|react-native-bluetooth-serial|react-native-wifi-reborn|react-native-wifi-p2p|react-native-network-info|react-native-carrier-info|react-native-sim-data|react-native-telephony|react-native-call-detection|react-native-callkeep|react-native-voip-push-notification|react-native-webrtc|react-native-incall-manager|react-native-android-sms-listener|react-native-android-sms-retriever|react-native-ios-sms-retriever)',
    ],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@screens/(.*)$': '<rootDir>/src/screens/$1',
      '^@services/(.*)$': '<rootDir>/src/services/$1',
      '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@assets/(.*)$': '<rootDir>/src/assets/$1',
      '^@api/(.*)$': '<rootDir>/src/api/$1',
      '^@state/(.*)$': '<rootDir>/src/state/$1',
      '^@types/(.*)$': '<rootDir>/src/types/$1',
      '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
      '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
      '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
      '^@models/(.*)$': '<rootDir>/src/models/$1',
      '^@theme/(.*)$': '<rootDir>/src/theme/$1',
      // Asset mocks
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  },
  web: {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest/setup.web.ts'],
    transformIgnorePatterns: [
      'node_modules/(?!(@react-native|react-native|react-native-web|@expo|expo|@unimodules|unimodules|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
    ],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^react-native/(.*)$': 'react-native-web/$1',
      ...pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/' }),
    },
  },
};

// Main configuration
const config = {
  ...platformConfigs[platform],
  
  // TypeScript configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest/setup/extend-expect.ts'],
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/web/',
    '/.expo/',
    '/coverage/',
    '/dist/',
    '/build/',
  ],
  
  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
  
  // Coverage configuration
  collectCoverage: isCI || process.env.COVERAGE === 'true',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/index.{ts,tsx}',
    '!src/types/**',
    '!src/assets/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: isCI 
    ? ['json', 'lcov', 'text', 'clover', 'cobertura', 'html']
    : ['text', 'lcov', 'html'],
  coverageThreshold: coverageThresholds,
  
  // Performance settings
  maxWorkers,
  cache,
  cacheDirectory: '<rootDir>/.jest-cache',
  bail,
  
  // Timeouts
  testTimeout: testType === 'e2e' ? 60000 : 10000,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Snapshot configuration
  snapshotSerializers: ['@emotion/jest/serializer'],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  
  // Watch mode configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Reporter configuration
  reporters: getReporters(),
  
  // Global variables
  globals: {
    __DEV__: true,
    __TEST__: true,
    __PLATFORM__: platform,
  },
  
  // Resolver configuration
  resolver: '<rootDir>/jest/resolver.js',
  
  // Runner options
  runner: testType === 'e2e' ? 'jest-circus/runner' : 'jest-runner',
  
  // Notification configuration
  notify: !isCI,
  notifyMode: 'failure-change',
  
  // Verbose output in CI
  verbose: isCI,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Fake timers
  fakeTimers: {
    enableGlobally: false,
    advanceTimers: true,
    now: Date.now(),
  },
  
  // Test environment options
  testEnvironmentOptions: platform === 'web' ? {
    url: 'http://localhost:3000',
    userAgent: 'Mozilla/5.0 (Testing) Chrome/91.0',
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
  } : {},
  
  // Inject globals
  injectGlobals: true,
  
  // Force exit after tests complete
  forceExit: isCI,
  
  // Detect open handles
  detectOpenHandles: !isCI,
  
  // Detect leaks
  detectLeaks: false, // Disabled due to performance impact
  
  // Pretty print
  prettierPath: require.resolve('prettier'),
};

// Get reporters based on environment
function getReporters() {
  const reporters = ['default'];
  
  if (isCI) {
    // GitHub Actions annotations
    if (isGitHubActions) {
      reporters.push(['github-actions', { silent: false }]);
    }
    
    // JUnit reporter for CI systems
    reporters.push([
      'jest-junit',
      {
        outputDirectory: '<rootDir>/test-results',
        outputName: `junit-${platform}-${Date.now()}.xml`,
        classNameTemplate: '{classname} - {title}',
        titleTemplate: '{classname} - {title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
        addFileAttribute: true,
        includeConsoleOutput: true,
        includeShortConsoleOutput: false,
      },
    ]);
    
    // HTML reporter
    reporters.push([
      'jest-html-reporters',
      {
        publicPath: '<rootDir>/test-results/html',
        filename: `report-${platform}.html`,
        openReport: false,
        pageTitle: `DataSphere Guilds Test Report - ${platform}`,
        logoImgPath: '<rootDir>/src/assets/images/logo.png',
        hideIcon: false,
        expand: false,
        customInfos: [
          {
            title: 'Environment',
            value: process.env.NODE_ENV || 'test',
          },
          {
            title: 'Platform',
            value: platform,
          },
          {
            title: 'Test Type',
            value: testType,
          },
        ],
      },
    ]);
  } else {
    // Local development reporters
    reporters.push([
      'jest-progress-bar-reporter',
      {
        customSummary: (results) => {
          const { numTotalTests, numPassedTests, numFailedTests } = results;
          const percentage = Math.round((numPassedTests / numTotalTests) * 100);
          return `Tests: ${numPassedTests}/${numTotalTests} (${percentage}%) passed`;
        },
      },
    ]);
  }
  
  return reporters;
}

// Projects configuration for multi-platform testing
if (process.env.TEST_ALL_PLATFORMS === 'true') {
  config.projects = [
    {
      ...platformConfigs.native,
      displayName: 'Native (iOS/Android)',
      testMatch: ['<rootDir>/src/**/*.native.test.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}'],
    },
    {
      ...platformConfigs.web,
      displayName: 'Web',
      testMatch: ['<rootDir>/src/**/*.web.test.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}'],
    },
  ];
  
  // Remove platform-specific config from root
  delete config.preset;
  delete config.setupFiles;
  delete config.testEnvironment;
  delete config.transformIgnorePatterns;
  delete config.moduleNameMapper;
}

// Export configuration
module.exports = config;

// Log configuration summary
console.log('🧪 Jest Configuration Loaded - DataSphere Guilds v3.0.0');
console.log(`📱 Platform: ${platform} | Environment: ${isCI ? 'CI' : 'Local'} | Type: ${testType}`);
console.log(`⚡ Workers: ${maxWorkers} | Cache: ${cache ? 'Enabled' : 'Disabled'} | Bail: ${bail || 'Disabled'}`);
console.log(`📊 Coverage: ${config.collectCoverage ? 'Enabled' : 'Disabled'}`);

// Validate configuration
if (platform !== 'native' && platform !== 'web') {
  throw new Error(`Invalid TEST_PLATFORM: ${platform}. Must be 'native' or 'web'`);
}

if (testType !== 'unit' && testType !== 'integration' && testType !== 'e2e') {
  throw new Error(`Invalid TEST_TYPE: ${testType}. Must be 'unit', 'integration', or 'e2e'`);
}
  