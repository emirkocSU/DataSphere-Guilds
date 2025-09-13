/**
 * Jest Setup for React Native (DataSphere Guilds)
 * 
 * Enterprise-grade Jest setup for comprehensive React Native testing
 * Supports: Expo SDK 49+, React Native 0.72+, TypeScript, AI Integration, 
 * Multi-platform testing (iOS, Android, Web), and all project dependencies
 * 
 * Features:
 * - Complete Expo modules mocking with type safety
 * - React Native ecosystem mocking with performance optimizations
 * - Firebase and analytics mocking with realistic responses
 * - Navigation and state management mocking
 * - AI and ML libraries mocking with custom configurations
 * - Performance monitoring setup with metrics
 * - Security and biometric mocking with edge cases
 * - Comprehensive error handling and recovery
 * - Development vs CI environment handling
 * - Memory leak prevention
 * - Test isolation and cleanup
 * 
 * @version 3.0.0
 * @author DataSphere Guilds Team
 */

// Suppress specific warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

// Filter out known warnings
console.warn = (...args: any[]) => {
  const warningMessage = args[0]?.toString() || '';
  
  // Suppress known React Native warnings
  const suppressedWarnings = [
    'Require cycle:',
    'Non-serializable values were found',
    'VirtualizedLists should never be nested',
    'componentWillReceiveProps has been renamed',
    'componentWillMount has been renamed',
    'Setting a timer for a long period',
    'Animated: `useNativeDriver`',
    'EventEmitter.removeListener',
  ];
  
  if (suppressedWarnings.some(warning => warningMessage.includes(warning))) {
    return;
  }
  
  originalWarn.apply(console, args);
};

console.error = (...args: any[]) => {
  const errorMessage = args[0]?.toString() || '';
  
  // Suppress known errors that don't affect tests
  const suppressedErrors = [
    'Warning: An update to',
    'Warning: Cannot update a component',
    'Warning: Can\'t perform a React state update',
  ];
  
  if (suppressedErrors.some(error => errorMessage.includes(error))) {
    return;
  }
  
  originalError.apply(console, args);
};

// ===== Core React Native Setup =====
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // Enhanced mock with worklet support
  Reanimated.default.call = () => {};
  Reanimated.default.createAnimatedComponent = (Component: any) => Component;
  Reanimated.default.FadeIn = { duration: jest.fn(() => ({ duration: 300 })) };
  Reanimated.default.FadeOut = { duration: jest.fn(() => ({ duration: 300 })) };
  Reanimated.default.Layout = { duration: jest.fn(() => ({ duration: 300 })) };
  
  return Reanimated;
});

// ===== Global Test Environment Variables =====
declare global {
  var __DEV__: boolean;
  var __TEST__: boolean;
  var __JEST__: boolean;
  var ErrorUtils: {
    setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
    getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
  };
}

global.__DEV__ = true;
global.__TEST__ = true;
global.__JEST__ = true;

// Mock ErrorUtils for React Native error handling
global.ErrorUtils = {
  setGlobalHandler: jest.fn(),
  getGlobalHandler: jest.fn(() => jest.fn()),
};

// Platform detection for conditional mocking
const isCI = process.env.CI === 'true';
const platform = process.env.TEST_PLATFORM || 'native';
const isVerbose = process.env.JEST_VERBOSE === 'true';

// Performance monitoring
const performanceMetrics = {
  setupStartTime: Date.now(),
  mockCounts: {} as Record<string, number>,
  memoryUsage: {} as Record<string, number>,
};

// Track mock usage for optimization
const trackMockUsage = (mockName: string) => {
  performanceMetrics.mockCounts[mockName] = (performanceMetrics.mockCounts[mockName] || 0) + 1;
};

// ===== Enhanced Expo Modules Mocking =====

// Expo Haptics with full API
jest.mock('expo-haptics', () => {
  trackMockUsage('expo-haptics');
  return {
    impactAsync: jest.fn(() => Promise.resolve()),
    notificationAsync: jest.fn(() => Promise.resolve()),
    selectionAsync: jest.fn(() => Promise.resolve()),
    ImpactFeedbackStyle: {
      Light: 'light',
      Medium: 'medium',
      Heavy: 'heavy',
      Soft: 'soft',
      Rigid: 'rigid',
    },
    NotificationFeedbackType: {
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
    },
  };
});

// Expo Constants with comprehensive device info
jest.mock('expo-constants', () => {
  trackMockUsage('expo-constants');
  return {
    default: {
      appOwnership: 'standalone',
      expoVersion: '49.0.15',
      manifest: {
        name: 'DataSphere Guilds',
        slug: 'datasphere-guilds',
        version: '1.0.0',
        extra: {
          eas: { projectId: 'test-project-id' },
        },
      },
      platform: {
        ios: {
          platform: 'ios',
          model: 'iPhone 15 Pro',
          systemVersion: '17.2',
          userInterfaceIdiom: 'phone',
          buildNumber: '1',
        },
        android: {
          platform: 'android',
          versionCode: 1,
          model: 'Pixel 8 Pro',
        },
        web: {
          ua: 'Mozilla/5.0 (Test Browser)',
        },
      },
      deviceName: 'Test Device',
      installationId: 'test-installation-id',
      sessionId: 'test-session-id',
      statusBarHeight: 44,
      deviceYearClass: 2024,
      getWebViewUserAgentAsync: jest.fn(() => Promise.resolve('Test User Agent')),
      isHeadless: false,
      debugMode: __DEV__,
      isDetached: false,
    },
    ExecutionEnvironment: {
      Bare: 'bare',
      Standalone: 'standalone',
      StoreClient: 'storeClient',
    },
    UserInterfaceIdiom: {
      Phone: 'phone',
      Tablet: 'tablet',
      Desktop: 'desktop',
      TV: 'tv',
      CarPlay: 'carplay',
      Unknown: 'unknown',
    },
  };
});

// Expo Device
jest.mock('expo-device', () => ({
  isDevice: true,
  brand: 'Apple',
  manufacturer: 'Apple',
  modelName: 'iPhone 15 Pro',
  modelId: 'iPhone16,1',
  designName: 'iPhone',
  productName: 'iPhone',
  deviceYearClass: 2023,
  totalMemory: 8589934592,
  supportedCpuArchitectures: ['arm64'],
  osName: 'iOS',
  osVersion: '17.0',
  osBuildId: '21A329',
  osInternalBuildId: '21A329',
  osBuildFingerprint: 'Apple/iPhone/iPhone16,1:17.0/21A329',
  platformApiLevel: null,
  deviceName: 'Test iPhone',
  DeviceType: {
    UNKNOWN: 0,
    PHONE: 1,
    TABLET: 2,
    DESKTOP: 3,
    TV: 4,
  },
}));

// Expo Application
jest.mock('expo-application', () => ({
  applicationName: 'DataSphere Guilds',
  applicationId: 'com.datasphere.guilds',
  nativeApplicationVersion: '1.0.0',
  nativeBuildVersion: '1',
  getInstallationTimeAsync: jest.fn(() => Promise.resolve(new Date('2024-01-01'))),
  getLastUpdateTimeAsync: jest.fn(() => Promise.resolve(new Date('2024-01-15'))),
  getIosIdForVendorAsync: jest.fn(() => Promise.resolve('test-vendor-id')),
  getAndroidId: jest.fn(() => 'test-android-id'),
}));

// Expo Secure Store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  SecureStoreOptions: {},
  WHEN_UNLOCKED: 'whenUnlocked',
  AFTER_FIRST_UNLOCK: 'afterFirstUnlock',
  ALWAYS: 'always',
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'whenPasscodeSetThisDeviceOnly',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'afterFirstUnlockThisDeviceOnly',
  ALWAYS_THIS_DEVICE_ONLY: 'alwaysThisDeviceOnly',
}));

// Expo Local Authentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([1, 2])),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
  cancelAuthenticate: jest.fn(),
  AuthenticationType: {
    FINGERPRINT: 1,
    FACIAL_RECOGNITION: 2,
    IRIS: 3,
  },
  SecurityLevel: {
    NONE: 0,
    SECRET: 1,
    BIOMETRIC_WEAK: 2,
    BIOMETRIC_STRONG: 3,
  },
}));

// Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestBackgroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 41.0082,
      longitude: 28.9784,
      altitude: 10,
      accuracy: 5,
      altitudeAccuracy: 3,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  })),
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
  getLastKnownPositionAsync: jest.fn(() => Promise.resolve(null)),
  geocodeAsync: jest.fn(() => Promise.resolve([])),
  reverseGeocodeAsync: jest.fn(() => Promise.resolve([])),
  LocationAccuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
}));

// Expo Camera
jest.mock('expo-camera', () => ({
  Camera: {
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
      FlashMode: {
        on: 'on',
        off: 'off',
        auto: 'auto',
        torch: 'torch',
      },
    },
  },
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMicrophonePermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getMicrophonePermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

// Expo Image Picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test-image.jpg',
      width: 1920,
      height: 1080,
      type: 'image',
    }],
  })),
  launchCameraAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test-camera-image.jpg',
      width: 1920,
      height: 1080,
      type: 'image',
    }],
  })),
  MediaTypeOptions: {
    All: 'All',
    Videos: 'Videos',
    Images: 'Images',
  },
}));

// Expo AV (Audio/Video)
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    Recording: jest.fn(() => ({
      prepareToRecordAsync: jest.fn(() => Promise.resolve()),
      startAsync: jest.fn(() => Promise.resolve()),
      stopAndUnloadAsync: jest.fn(() => Promise.resolve({ uri: 'file://test-recording.m4a' })),
      getStatusAsync: jest.fn(() => Promise.resolve({ isRecording: false })),
    })),
    Sound: jest.fn(() => ({
      loadAsync: jest.fn(() => Promise.resolve()),
      playAsync: jest.fn(() => Promise.resolve()),
      pauseAsync: jest.fn(() => Promise.resolve()),
      stopAsync: jest.fn(() => Promise.resolve()),
      unloadAsync: jest.fn(() => Promise.resolve()),
      getStatusAsync: jest.fn(() => Promise.resolve({ isLoaded: true, isPlaying: false })),
    })),
  },
  Video: jest.fn(() => ({
    loadAsync: jest.fn(() => Promise.resolve()),
    playAsync: jest.fn(() => Promise.resolve()),
    pauseAsync: jest.fn(() => Promise.resolve()),
    stopAsync: jest.fn(() => Promise.resolve()),
  })),
  InterruptionModeIOS: {
    MixWithOthers: 0,
    DoNotMix: 1,
    DuckOthers: 2,
  },
  InterruptionModeAndroid: {
    DoNotMix: 1,
    DuckOthers: 2,
  },
}));

// Expo Notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  presentNotificationAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Expo File System
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test-documents/',
  cacheDirectory: 'file://test-cache/',
  readAsStringAsync: jest.fn(() => Promise.resolve('test file content')),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  readDirectoryAsync: jest.fn(() => Promise.resolve(['file1.txt', 'file2.txt'])),
  getInfoAsync: jest.fn(() => Promise.resolve({
    exists: true,
    isDirectory: false,
    modificationTime: Date.now(),
    size: 1024,
    uri: 'file://test-file.txt',
  })),
  downloadAsync: jest.fn(() => Promise.resolve({
    uri: 'file://downloaded-file.txt',
    status: 200,
    headers: {},
    md5: 'test-md5',
  })),
  uploadAsync: jest.fn(() => Promise.resolve({
    status: 200,
    headers: {},
    body: 'upload response',
  })),
}));

// ===== React Native Core Modules with Type Safety =====

// Enhanced AsyncStorage mock with persistence simulation
const mockAsyncStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key: string) => {
      return Promise.resolve(store[key] || null);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    multiGet: jest.fn((keys: string[]) => {
      return Promise.resolve(keys.map(key => [key, store[key] || null]));
    }),
    multiSet: jest.fn((pairs: Array<[string, string]>) => {
      pairs.forEach(([key, value]) => {
        store[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys: string[]) => {
      keys.forEach(key => delete store[key]);
      return Promise.resolve();
    }),
    mergeItem: jest.fn((key: string, value: string) => {
      const existing = store[key];
      if (existing) {
        try {
          const existingObj = JSON.parse(existing);
          const newObj = JSON.parse(value);
          store[key] = JSON.stringify({ ...existingObj, ...newObj });
        } catch {
          store[key] = value;
        }
      } else {
        store[key] = value;
      }
      return Promise.resolve();
    }),
  };
})();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ 
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: {
      isConnectionExpensive: false,
      ssid: 'Test-WiFi',
      bssid: 'test-bssid',
      strength: 100,
      ipAddress: '192.168.1.100',
      subnet: '255.255.255.0',
    },
  })),
  addEventListener: jest.fn(() => jest.fn()),
  useNetInfo: jest.fn(() => ({ 
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
  configure: jest.fn(),
  refresh: jest.fn(() => Promise.resolve()),
}));

// React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  State: {},
  ScrollView: 'ScrollView',
  Slider: 'Slider',
  Switch: 'Switch',
  TextInput: 'TextInput',
  ToolbarAndroid: 'ToolbarAndroid',
  ViewPagerAndroid: 'ViewPagerAndroid',
  DrawerLayoutAndroid: 'DrawerLayoutAndroid',
  WebView: 'WebView',
  NativeViewGestureHandler: 'NativeViewGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
  FlingGestureHandler: 'FlingGestureHandler',
  ForceTouchGestureHandler: 'ForceTouchGestureHandler',
  LongPressGestureHandler: 'LongPressGestureHandler',
  PanGestureHandler: 'PanGestureHandler',
  PinchGestureHandler: 'PinchGestureHandler',
  RotationGestureHandler: 'RotationGestureHandler',
  RawButton: 'RawButton',
  BaseButton: 'BaseButton',
  RectButton: 'RectButton',
  BorderlessButton: 'BorderlessButton',
  FlatList: 'FlatList',
  gestureHandlerRootHOC: jest.fn(component => component),
  Directions: {},
}));

// React Native Screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  screensEnabled: jest.fn(() => true),
}));

// React Native Safe Area Context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
  SafeAreaInsetsContext: {
    Consumer: ({ children }: { children: (insets: any) => React.ReactNode }) =>
      children({ top: 44, bottom: 34, left: 0, right: 0 }),
  },
}));

// ===== Navigation Mocking =====
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    isFocused: jest.fn(() => true),
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: {},
    name: 'TestScreen',
    key: 'test-key',
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  createNavigationContainerRef: jest.fn(),
}));

// ===== Firebase Mocking with Realistic Behavior =====
const createFirebaseMock = () => {
  const authStateListeners: Array<(user: any) => void> = [];
  let currentUser: any = null;
  
  return {
    auth: () => ({
      currentUser,
      signInWithEmailAndPassword: jest.fn((email: string, password: string) => {
        currentUser = { uid: 'test-uid', email };
        authStateListeners.forEach(listener => listener(currentUser));
        return Promise.resolve({ user: currentUser });
      }),
      createUserWithEmailAndPassword: jest.fn((email: string, password: string) => {
        currentUser = { uid: 'new-test-uid', email };
        authStateListeners.forEach(listener => listener(currentUser));
        return Promise.resolve({ user: currentUser });
      }),
      signOut: jest.fn(() => {
        currentUser = null;
        authStateListeners.forEach(listener => listener(null));
        return Promise.resolve();
      }),
      onAuthStateChanged: jest.fn((listener: (user: any) => void) => {
        authStateListeners.push(listener);
        listener(currentUser);
        return () => {
          const index = authStateListeners.indexOf(listener);
          if (index > -1) authStateListeners.splice(index, 1);
        };
      }),
      sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
      confirmPasswordReset: jest.fn(() => Promise.resolve()),
      applyActionCode: jest.fn(() => Promise.resolve()),
      sendEmailVerification: jest.fn(() => Promise.resolve()),
    }),
    firestore: () => ({
      collection: jest.fn((collectionName: string) => ({
        doc: jest.fn((docId?: string) => ({
          id: docId || 'auto-generated-id',
          get: jest.fn(() => Promise.resolve({
            exists: true,
            id: docId || 'auto-generated-id',
            data: () => ({ test: 'data' }),
            metadata: { fromCache: false, hasPendingWrites: false },
          })),
          set: jest.fn(() => Promise.resolve()),
          update: jest.fn(() => Promise.resolve()),
          delete: jest.fn(() => Promise.resolve()),
          onSnapshot: jest.fn((callback: Function) => {
            callback({
              exists: true,
              data: () => ({ test: 'data' }),
              metadata: { fromCache: false, hasPendingWrites: false },
            });
            return jest.fn(); // unsubscribe function
          }),
        })),
        add: jest.fn((data: any) => Promise.resolve({ id: 'new-doc-id' })),
        where: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({
            docs: [],
            size: 0,
            empty: true,
            forEach: jest.fn(),
          })),
          limit: jest.fn(() => ({ get: jest.fn(() => Promise.resolve({ docs: [] })) })),
          orderBy: jest.fn(() => ({ get: jest.fn(() => Promise.resolve({ docs: [] })) })),
        })),
      })),
      batch: jest.fn(() => ({
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        commit: jest.fn(() => Promise.resolve()),
      })),
      runTransaction: jest.fn((updateFunction: Function) => 
        Promise.resolve(updateFunction({
          get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        }))
      ),
    }),
    storage: () => ({
      ref: jest.fn((path?: string) => ({
        child: jest.fn((childPath: string) => ({
          put: jest.fn(() => ({
            on: jest.fn(),
            snapshot: { ref: { getDownloadURL: jest.fn(() => Promise.resolve('https://test-url.com')) } },
          })),
          putFile: jest.fn(() => Promise.resolve()),
          getDownloadURL: jest.fn(() => Promise.resolve('https://test-url.com')),
          delete: jest.fn(() => Promise.resolve()),
        })),
      })),
    }),
    analytics: () => ({
      logEvent: jest.fn(() => Promise.resolve()),
      setUserId: jest.fn(() => Promise.resolve()),
      setUserProperties: jest.fn(() => Promise.resolve()),
      setCurrentScreen: jest.fn(() => Promise.resolve()),
      setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    }),
    crashlytics: () => ({
      log: jest.fn(),
      recordError: jest.fn(),
      setUserId: jest.fn(),
      setAttribute: jest.fn(),
      setAttributes: jest.fn(),
      setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    }),
    messaging: () => ({
      getToken: jest.fn(() => Promise.resolve('test-fcm-token')),
      onMessage: jest.fn((callback: Function) => {
        // Simulate incoming message
        setTimeout(() => {
          callback({
            notification: { title: 'Test', body: 'Test message' },
            data: { key: 'value' },
          });
        }, 100);
        return jest.fn(); // unsubscribe
      }),
      onTokenRefresh: jest.fn((callback: Function) => jest.fn()),
      requestPermission: jest.fn(() => Promise.resolve(1)), // authorized
      hasPermission: jest.fn(() => Promise.resolve(1)),
      deleteToken: jest.fn(() => Promise.resolve()),
      setBackgroundMessageHandler: jest.fn(),
    }),
  };
};

const firebaseMock = createFirebaseMock();

jest.mock('@react-native-firebase/app', () => ({
  default: {
    apps: [],
    app: jest.fn((name?: string) => firebaseMock),
    initializeApp: jest.fn(() => Promise.resolve(firebaseMock)),
  },
}));

jest.mock('@react-native-firebase/auth', () => ({
  default: jest.fn(() => firebaseMock.auth()),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  default: jest.fn(() => firebaseMock.firestore()),
}));

jest.mock('@react-native-firebase/storage', () => ({
  default: jest.fn(() => firebaseMock.storage()),
}));

jest.mock('@react-native-firebase/analytics', () => ({
  default: jest.fn(() => firebaseMock.analytics()),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  default: jest.fn(() => firebaseMock.crashlytics()),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  default: jest.fn(() => firebaseMock.messaging()),
}));

// ===== Analytics Mocking =====
jest.mock('@amplitude/react-native', () => ({
  Amplitude: {
    getInstance: jest.fn(() => ({
      init: jest.fn(() => Promise.resolve()),
      logEvent: jest.fn(() => Promise.resolve()),
      setUserId: jest.fn(() => Promise.resolve()),
      setUserProperties: jest.fn(() => Promise.resolve()),
    })),
  },
}));

// ===== AI and ML Libraries Mocking =====
jest.mock('openai', () => ({
  OpenAI: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                isValid: true,
                confidence: 0.95,
                score: 95,
                issues: [],
                suggestions: [],
              }),
            },
          }],
          usage: { total_tokens: 150 },
        })),
      },
    },
  })),
}));

jest.mock('@tensorflow/tfjs-react-native', () => ({
  platform: jest.fn(),
  ready: jest.fn(() => Promise.resolve()),
}));

// ===== UI Library Mocking =====
jest.mock('react-native-elements', () => ({
  Button: 'Button',
  Input: 'Input',
  Card: 'Card',
  Avatar: 'Avatar',
  Badge: 'Badge',
  CheckBox: 'CheckBox',
  Divider: 'Divider',
  Header: 'Header',
  Icon: 'Icon',
  Image: 'Image',
  ListItem: 'ListItem',
  Overlay: 'Overlay',
  Rating: 'Rating',
  SearchBar: 'SearchBar',
  Slider: 'Slider',
  SocialIcon: 'SocialIcon',
  Text: 'Text',
  Tile: 'Tile',
  Tooltip: 'Tooltip',
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#2E7D32',
        secondary: '#1976D2',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
      },
    },
  }),
}));

// ===== Animation Libraries =====
jest.mock('lottie-react-native', () => 'LottieView');

jest.mock('react-native-animatable', () => ({
  View: 'Animatable.View',
  Text: 'Animatable.Text',
  Image: 'Animatable.Image',
  createAnimatableComponent: jest.fn(component => component),
}));

// ===== Vector Icons =====
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

// ===== Performance and Monitoring =====
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn(callback => callback({ setTag: jest.fn(), setContext: jest.fn() })),
}));

// ===== Development Tools =====
if (__DEV__) {
  // React DevTools
  jest.mock('react-devtools-core', () => ({
    connectToDevTools: jest.fn(),
  }));

  // Flipper
  jest.mock('react-native-flipper', () => ({
    logger: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  }));
}

// ===== Global Test Utilities =====

// Mock timers for consistent testing
if (!isCI) {
  jest.useFakeTimers();
}

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock global fetch for API testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Map(),
  })
) as jest.Mock;

// Mock WebSocket
global.WebSocket = jest.fn(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1, // OPEN
})) as any;

// Mock IntersectionObserver for web compatibility
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as any;

// ===== Custom Test Utilities Export =====
export const testUtils = {
  // Mock data generators
  createMockUser: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'worker',
    rating: 4.5,
    level: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
  
  createMockTask: (overrides = {}) => ({
    id: 'task-123',
    title: 'Test Task',
    description: 'Test task description',
    domain: 'image-labeling',
    reward: 25.0,
    currency: 'USD',
    status: 'open',
    deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    requirements: {
      level: 1,
      skills: ['basic-labeling'],
    },
    estimatedTime: 30,
    available: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),
  
  createMockQCResult: (overrides = {}) => ({
    id: 'qc-123',
    taskId: 'task-123',
    submissionId: 'sub-123',
    inspectorId: 'inspector-123',
    decision: 'approve',
    confidence: 0.95,
    score: 92,
    feedback: {
      accuracy: 5,
      completeness: 5,
      followedInstructions: 4,
      overallQuality: 4.7,
    },
    issues: [],
    suggestions: ['Great work!'],
    processingTime: 1500,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),
  
  // Test environment helpers
  isCI: () => isCI,
  platform: () => platform,
  
  // Mock response helpers
  mockSuccessResponse: (data: any) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data }),
    text: () => Promise.resolve(JSON.stringify({ success: true, data })),
    headers: new Headers({ 'content-type': 'application/json' }),
  }),
  
  mockErrorResponse: (status: number, message: string) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ success: false, error: { message } }),
    text: () => Promise.resolve(JSON.stringify({ success: false, error: { message } })),
    headers: new Headers({ 'content-type': 'application/json' }),
  }),
  
  // Performance helpers
  measureMockPerformance: () => performanceMetrics,
  
  // Firebase helpers
  getFirebaseMock: () => firebaseMock,
  resetFirebaseAuth: () => {
    const auth = firebaseMock.auth();
    auth.currentUser = null;
  },
  
  // AsyncStorage helpers
  getAsyncStorageMock: () => mockAsyncStorage,
  clearAsyncStorage: () => mockAsyncStorage.clear(),
  
  // Wait helpers
  waitForAsync: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  flushPromises: () => new Promise(resolve => setImmediate(resolve)),
};

// ===== Test Environment Cleanup =====
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
  
  // Clear AsyncStorage
  mockAsyncStorage.clear();
  
  // Reset Firebase auth state
  testUtils.resetFirebaseAuth();
  
  // Clear console mocks if verbose mode is disabled
  if (!isVerbose) {
    (console.log as jest.Mock).mockClear();
    (console.info as jest.Mock).mockClear();
    (console.debug as jest.Mock).mockClear();
  }
  
  // Track memory usage in CI
  if (isCI) {
    performanceMetrics.memoryUsage[expect.getState().currentTestName || 'unknown'] = 
      process.memoryUsage().heapUsed;
  }
});

afterEach(() => {
  // Clean up any remaining timers
  if (!isCI) {
    jest.runOnlyPendingTimers();
  }
  
  // Clear any intervals or timeouts
  jest.clearAllTimers();
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
});

// Log setup completion with performance metrics
const setupEndTime = Date.now();
const setupDuration = setupEndTime - performanceMetrics.setupStartTime;

console.info('🧪 Jest Native Setup Complete - DataSphere Guilds v3.0.0');
console.info(`📱 Platform: ${platform} | CI: ${isCI ? 'Yes' : 'No'} | Verbose: ${isVerbose ? 'Yes' : 'No'}`);
console.info(`⚡ Setup completed in ${setupDuration}ms`);

// Export performance metrics for monitoring
export { performanceMetrics }; 