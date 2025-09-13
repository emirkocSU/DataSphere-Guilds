/**
 * TypeScript Definitions for Jest Testing (DataSphere Guilds)
 * 
 * Comprehensive type definitions for all Jest mocks, utilities, and globals
 * 
 * @version 3.0.0
 * @author DataSphere Guilds Team
 */

/// <reference types="jest" />
/// <reference types="@testing-library/jest-native" />
/// <reference types="@testing-library/react-native" />

// ===== Global Test Utilities Types =====

declare global {
  // Jest globals
  var jest: typeof import('jest');
  var expect: jest.Expect;
  var describe: jest.Describe;
  var it: jest.It;
  var test: jest.It;
  var beforeAll: jest.Lifecycle;
  var beforeEach: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var afterEach: jest.Lifecycle;

  // Node.js globals
  var global: typeof globalThis;
  var process: NodeJS.Process;
  var require: NodeRequire;
  var setImmediate: typeof globalThis.setImmediate;

  // Test utilities namespace
  namespace TestUtils {
    interface PerformanceStats {
      count: number;
      min: number;
      max: number;
      avg: number;
      median: number;
      p95: number;
      p99: number;
    }

    interface TestPerformance {
      measurements: Map<string, number[]>;
      start(label: string): () => void;
      getStats(label: string): PerformanceStats | null;
      reset(): void;
    }

    interface MemoryLeakDetector {
      initialHeap: number;
      threshold: number;
      start(): void;
      check(testName: string): void;
    }

    interface NetworkRequest {
      url: string;
      method: string;
      body?: any;
      headers?: any;
    }

    interface NetworkMockOptions {
      status?: number;
      statusText?: string;
      headers?: Record<string, string>;
      delay?: number;
    }

    interface NetworkMock {
      requests: NetworkRequest[];
      reset(): void;
      mockResponse(url: string | RegExp, response: any, options?: NetworkMockOptions): void;
      getLastRequest(): NetworkRequest | undefined;
      findRequest(predicate: (req: NetworkRequest) => boolean): NetworkRequest | undefined;
    }

    interface UserData {
      id: string;
      email: string;
      fullName: string;
      role: 'worker' | 'admin' | 'moderator';
      rating: number;
      level: number;
      status: 'active' | 'inactive' | 'suspended';
      createdAt: string;
      updatedAt: string;
    }

    interface TaskData {
      id: string;
      title: string;
      description: string;
      domain: string;
      reward: number;
      currency: string;
      status: 'open' | 'in-progress' | 'completed' | 'cancelled';
      deadline: string;
      requirements: {
        level: number;
        skills: string[];
      };
      estimatedTime: number;
      available: number;
      createdAt: string;
      updatedAt: string;
    }

    interface QCResultData {
      id: string;
      taskId: string;
      submissionId: string;
      inspectorId: string;
      decision: 'approve' | 'reject' | 'revision';
      confidence: number;
      score: number;
      feedback: {
        accuracy: number;
        completeness: number;
        followedInstructions: number;
        overallQuality: number;
      };
      issues: string[];
      suggestions: string[];
      processingTime: number;
      createdAt: string;
    }

    interface TestDataFactory {
      user(overrides?: Partial<UserData>): UserData;
      task(overrides?: Partial<TaskData>): TaskData;
      qcResult(overrides?: Partial<QCResultData>): QCResultData;
      users(count: number, overrides?: Partial<UserData>): UserData[];
      tasks(count: number, overrides?: Partial<TaskData>): TaskData[];
    }
  }

  // Global test utilities
  var testUtils: {
    performance: TestUtils.TestPerformance;
    memoryLeakDetector: TestUtils.MemoryLeakDetector;
    networkMock: TestUtils.NetworkMock;
    factory: TestUtils.TestDataFactory;
  };

  // Web test utilities (from setup.web.ts)
  var webTestUtils: {
    triggerMediaQueryChange(query: string, matches: boolean): void;
    goOffline(): void;
    goOnline(): void;
    getPerformanceMetrics(): {
      setupStartTime: number;
      domOperations: number;
      apiCalls: Record<string, number>;
      setupDuration: number;
    };
    fillLocalStorage(percentage: number): void;
    mockServiceWorkerMessage(data: any): void;
    mockScreenReader(): void;
  };

  // Native test utilities (from setup.native.ts)
  var nativeTestUtils: {
    mockCameraPermission(status: 'authorized' | 'denied' | 'restricted'): void;
    mockLocationPermission(status: 'authorized' | 'denied' | 'restricted'): void;
    mockLocation(coords: { latitude: number; longitude: number; accuracy?: number }): void;
    mockNetworkState(isConnected: boolean, type?: string): void;
    mockBatteryLevel(level: number, state?: string): void;
    mockDeviceOrientation(orientation: 'portrait' | 'landscape'): void;
    mockNotificationPermission(status: 'granted' | 'denied' | 'undetermined'): void;
    mockBiometricAvailability(available: boolean, type?: 'TouchID' | 'FaceID'): void;
    simulateMemoryWarning(): void;
    simulateAppStateChange(state: 'active' | 'background' | 'inactive'): void;
    getPerformanceMetrics(): {
      mockCalls: Record<string, number>;
      setupDuration: number;
    };
  };
}

// ===== Expo Module Types =====

declare module 'expo-constants' {
  export interface Constants {
    manifest: any;
    deviceId: string;
    deviceName: string;
    isDevice: boolean;
    platform: {
      ios?: {
        model: string;
        platform: string;
        systemVersion: string;
      };
      android?: {
        versionCode: number;
      };
    };
    sessionId: string;
    statusBarHeight: number;
    systemFonts: string[];
  }
  
  const Constants: Constants;
  export default Constants;
}

declare module 'expo-haptics' {
  export enum ImpactFeedbackStyle {
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
  }
  
  export enum NotificationFeedbackType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
  }
  
  export function impactAsync(style: ImpactFeedbackStyle): Promise<void>;
  export function notificationAsync(type: NotificationFeedbackType): Promise<void>;
  export function selectionAsync(): Promise<void>;
}

declare module 'expo-camera' {
  export enum CameraType {
    front = 'front',
    back = 'back',
  }
  
  export interface CameraProps {
    type?: CameraType;
    onCameraReady?: () => void;
    onMountError?: (error: any) => void;
  }
  
  export class Camera extends React.Component<CameraProps> {
    static requestCameraPermissionsAsync(): Promise<{ status: string }>;
    static getCameraPermissionsAsync(): Promise<{ status: string }>;
  }
}

declare module 'expo-location' {
  export interface LocationObject {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number | null;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }
  
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options?: any): Promise<LocationObject>;
  export function watchPositionAsync(options: any, callback: (location: LocationObject) => void): Promise<{ remove: () => void }>;
}

// ===== React Native Module Types =====

declare module '@react-native-async-storage/async-storage' {
  export interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: string[]): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
  }
  
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module '@react-native-community/netinfo' {
  export interface NetInfoState {
    type: string;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    details: any;
  }
  
  export function fetch(): Promise<NetInfoState>;
  export function addEventListener(callback: (state: NetInfoState) => void): () => void;
}

// ===== Firebase Module Types =====

declare module '@react-native-firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: any;
  }
  
  export function initializeApp(options: any, name?: string): FirebaseApp;
  export function app(name?: string): FirebaseApp;
}

declare module '@react-native-firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    isAnonymous: boolean;
    emailVerified: boolean;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
  }
  
  export interface Auth {
    currentUser: User | null;
    signInWithEmailAndPassword(email: string, password: string): Promise<any>;
    createUserWithEmailAndPassword(email: string, password: string): Promise<any>;
    signOut(): Promise<void>;
    onAuthStateChanged(listener: (user: User | null) => void): () => void;
  }
  
  export default function auth(): Auth;
}

// ===== AI/ML Module Types =====

declare module 'openai' {
  export interface OpenAI {
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
    embeddings: {
      create(params: any): Promise<any>;
    };
  }
  
  export default class OpenAI {
    constructor(config: { apiKey: string });
  }
}

declare module '@tensorflow/tfjs-react-native' {
  export function ready(): Promise<void>;
  export interface Tensor {
    shape: number[];
    dtype: string;
    print(): void;
    data(): Promise<any>;
    dispose(): void;
  }
}

// ===== Navigation Types =====

declare module '@react-navigation/native' {
  export interface NavigationProp<T = any> {
    navigate(name: string, params?: any): void;
    goBack(): void;
    reset(state: any): void;
    setParams(params: any): void;
    dispatch(action: any): void;
    canGoBack(): boolean;
    isFocused(): boolean;
    addListener(event: string, callback: () => void): () => void;
  }
  
  export function useNavigation<T = any>(): NavigationProp<T>;
  export function useRoute<T = any>(): { params: T; name: string };
  export function useFocusEffect(callback: () => void | (() => void)): void;
}

// ===== Redux Toolkit Types =====

declare module '@reduxjs/toolkit' {
  export interface PayloadAction<P = void, T extends string = string> {
    type: T;
    payload: P;
  }
  
  export function createSlice<T>(options: {
    name: string;
    initialState: T;
    reducers: any;
    extraReducers?: any;
  }): any;
  
  export function createAsyncThunk<T, P>(
    type: string,
    payloadCreator: (arg: P) => Promise<T>
  ): any;
  
  export function configureStore(options: any): any;
}

// ===== Testing Library Extensions =====

declare module '@testing-library/react-native' {
  export interface RenderOptions {
    wrapper?: React.ComponentType<any>;
    createNodeMock?: (element: React.ReactElement) => any;
  }
  
  export interface RenderResult {
    container: any;
    baseElement: any;
    debug: (message?: string) => void;
    toJSON: () => any;
    unmount: () => void;
    rerender: (ui: React.ReactElement) => void;
    asFragment: () => any;
  }
}

// ===== Mock Function Types =====

interface MockedFunction<T extends (...args: any[]) => any> extends jest.Mock<ReturnType<T>, Parameters<T>> {
  mockName(name: string): this;
  mockReturnValue(value: ReturnType<T>): this;
  mockReturnValueOnce(value: ReturnType<T>): this;
  mockResolvedValue(value: ReturnType<T> extends Promise<infer U> ? U : never): this;
  mockResolvedValueOnce(value: ReturnType<T> extends Promise<infer U> ? U : never): this;
  mockRejectedValue(value: any): this;
  mockRejectedValueOnce(value: any): this;
}

// ===== Environment Variables =====

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    JEST_WORKER_ID?: string;
    CI?: string;
    DEBUG_TESTS?: string;
    TEST_TYPE?: 'unit' | 'integration' | 'e2e';
    DETECT_MEMORY_LEAKS?: string;
    LOG_SLOW_TESTS?: string;
    LOG_PERFORMANCE_STATS?: string;
    JEST_VERBOSE?: string;
  }
}

// Export empty object to make this a module
export {}; 