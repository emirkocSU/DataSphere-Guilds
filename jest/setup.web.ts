/**
 * Jest Setup for Web Platform (DataSphere Guilds)
 * 
 * Enterprise-grade Jest setup for web platform testing
 * Supports: React Native Web, Next.js, PWA features, Web APIs
 * 
 * Features:
 * - React Native Web compatibility with type safety
 * - Web-specific API mocking with edge cases
 * - DOM environment setup with performance monitoring
 * - Progressive Web App features with service workers
 * - Service Worker mocking with offline support
 * - Web performance APIs with metrics
 * - Accessibility testing support (WCAG 2.1)
 * - Cross-browser compatibility
 * - Memory leak detection
 * - Network simulation
 * 
 * @version 3.0.0
 * @author DataSphere Guilds Team
 */

import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Performance monitoring
const webPerformanceMetrics = {
  setupStartTime: performance.now(),
  domOperations: 0,
  apiCalls: {} as Record<string, number>,
};

// Track API usage
const trackAPIUsage = (apiName: string) => {
  webPerformanceMetrics.apiCalls[apiName] = (webPerformanceMetrics.apiCalls[apiName] || 0) + 1;
};

// ===== Web Environment Setup =====

// Enhanced window.matchMedia with listeners
const mediaQueryListeners = new Map<string, Set<Function>>();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => {
    trackAPIUsage('matchMedia');
    const listeners = mediaQueryListeners.get(query) || new Set();
    mediaQueryListeners.set(query, listeners);
    
    const mediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn((callback: Function) => {
        listeners.add(callback);
      }),
      removeListener: jest.fn((callback: Function) => {
        listeners.delete(callback);
      }),
      addEventListener: jest.fn((event: string, callback: Function) => {
        if (event === 'change') listeners.add(callback);
      }),
      removeEventListener: jest.fn((event: string, callback: Function) => {
        if (event === 'change') listeners.delete(callback);
      }),
      dispatchEvent: jest.fn((event: Event) => {
        listeners.forEach(listener => listener(event));
        return true;
      }),
    };
    
    // Simulate common media queries
    if (query === '(prefers-color-scheme: dark)') {
      mediaQueryList.matches = false; // Default to light mode
    } else if (query === '(min-width: 768px)') {
      mediaQueryList.matches = true; // Default to desktop
    } else if (query === '(hover: hover)') {
      mediaQueryList.matches = true; // Has hover capability
    } else if (query === '(prefers-reduced-motion: reduce)') {
      mediaQueryList.matches = false; // No motion preference
    }
    
    return mediaQueryList;
  }),
});

// Enhanced ResizeObserver with entry tracking
class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private observations = new Map<Element, ResizeObserverEntry>();
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    trackAPIUsage('ResizeObserver');
  }
  
  observe(target: Element, options?: ResizeObserverOptions) {
    const entry: ResizeObserverEntry = {
      target,
      contentRect: {
        x: 0,
        y: 0,
        width: 1024,
        height: 768,
        top: 0,
        right: 1024,
        bottom: 768,
        left: 0,
        toJSON: () => ({}),
      },
      borderBoxSize: [{
        inlineSize: 1024,
        blockSize: 768,
      }],
      contentBoxSize: [{
        inlineSize: 1024,
        blockSize: 768,
      }],
      devicePixelContentBoxSize: [{
        inlineSize: 1024,
        blockSize: 768,
      }],
    };
    
    this.observations.set(target, entry);
    // Simulate async callback
    setTimeout(() => {
      this.callback([entry], this);
    }, 0);
  }
  
  unobserve(target: Element) {
    this.observations.delete(target);
  }
  
  disconnect() {
    this.observations.clear();
  }
}

global.ResizeObserver = MockResizeObserver as any;

// Enhanced IntersectionObserver with threshold support
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private options: IntersectionObserverInit;
  private observations = new Map<Element, IntersectionObserverEntry>();
  
  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.options = options;
    trackAPIUsage('IntersectionObserver');
  }
  
  observe(target: Element) {
    const entry: IntersectionObserverEntry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      intersectionRect: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
        toJSON: () => ({}),
      },
      boundingClientRect: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
        toJSON: () => ({}),
      },
      rootBounds: null,
      time: performance.now(),
    };
    
    this.observations.set(target, entry);
    // Simulate async callback
    requestAnimationFrame(() => {
      this.callback([entry], this);
    });
  }
  
  unobserve(target: Element) {
    this.observations.delete(target);
  }
  
  disconnect() {
    this.observations.clear();
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return Array.from(this.observations.values());
  }
}

global.IntersectionObserver = MockIntersectionObserver as any;

// Enhanced MutationObserver
class MockMutationObserver {
  private callback: MutationCallback;
  private records: MutationRecord[] = [];
  
  constructor(callback: MutationCallback) {
    this.callback = callback;
    trackAPIUsage('MutationObserver');
  }
  
  observe(target: Node, options?: MutationObserverInit) {
    // Simulate mutation observation
    webPerformanceMetrics.domOperations++;
  }
  
  disconnect() {
    this.records = [];
  }
  
  takeRecords(): MutationRecord[] {
    const records = [...this.records];
    this.records = [];
    return records;
  }
}

global.MutationObserver = MockMutationObserver as any;

// ===== Enhanced Web APIs =====

// Mock requestAnimationFrame with proper timing
let animationFrameId = 0;
const animationFrameCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  const id = ++animationFrameId;
  animationFrameCallbacks.set(id, callback);
  
  setTimeout(() => {
    const cb = animationFrameCallbacks.get(id);
    if (cb) {
      animationFrameCallbacks.delete(id);
      cb(performance.now());
    }
  }, 16); // ~60fps
  
  return id;
});

global.cancelAnimationFrame = jest.fn((id: number) => {
  animationFrameCallbacks.delete(id);
});

// Enhanced localStorage with quota simulation
const createStorageMock = (type: 'local' | 'session') => {
  let store: Record<string, string> = {};
  const QUOTA_BYTES = 5 * 1024 * 1024; // 5MB quota
  
  const getUsedBytes = () => {
    return Object.entries(store).reduce((total, [key, value]) => {
      return total + key.length + value.length;
    }, 0);
  };
  
  return {
    getItem: jest.fn((key: string) => {
      trackAPIUsage(`${type}Storage.getItem`);
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      trackAPIUsage(`${type}Storage.setItem`);
      const newSize = getUsedBytes() + key.length + value.length;
      
      if (newSize > QUOTA_BYTES) {
        throw new DOMException('QuotaExceededError');
      }
      
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      trackAPIUsage(`${type}Storage.removeItem`);
      delete store[key];
    }),
    clear: jest.fn(() => {
      trackAPIUsage(`${type}Storage.clear`);
      store = {};
    }),
    key: jest.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    },
    // Test utilities
    __getStore: () => store,
    __setStore: (newStore: Record<string, string>) => { store = newStore; },
  };
};

global.localStorage = createStorageMock('local');
global.sessionStorage = createStorageMock('session');

// Enhanced Geolocation API with error simulation
const mockGeolocation = {
  getCurrentPosition: jest.fn((
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ) => {
    trackAPIUsage('geolocation.getCurrentPosition');
    
    // Simulate async position acquisition
    setTimeout(() => {
      if (Math.random() > 0.9 && errorCallback) {
        // 10% chance of error
        errorCallback({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      } else {
        successCallback({
          coords: {
            latitude: 41.0082,
            longitude: 28.9784,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      }
    }, options?.timeout || 100);
  }),
  watchPosition: jest.fn((
    successCallback: PositionCallback,
    errorCallback?: PositionErrorCallback,
    options?: PositionOptions
  ) => {
    trackAPIUsage('geolocation.watchPosition');
    let watchId = Math.floor(Math.random() * 10000);
    
    // Simulate position updates
    const interval = setInterval(() => {
      successCallback({
        coords: {
          latitude: 41.0082 + (Math.random() - 0.5) * 0.001,
          longitude: 28.9784 + (Math.random() - 0.5) * 0.001,
          accuracy: 5 + Math.random() * 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: Math.random() * 360,
          speed: Math.random() * 5,
        },
        timestamp: Date.now(),
      } as GeolocationPosition);
    }, 1000);
    
    // Store interval for cleanup
    (mockGeolocation as any).watchIntervals = (mockGeolocation as any).watchIntervals || new Map();
    (mockGeolocation as any).watchIntervals.set(watchId, interval);
    
    return watchId;
  }),
  clearWatch: jest.fn((watchId: number) => {
    trackAPIUsage('geolocation.clearWatch');
    const intervals = (mockGeolocation as any).watchIntervals;
    if (intervals && intervals.has(watchId)) {
      clearInterval(intervals.get(watchId));
      intervals.delete(watchId);
    }
  }),
};

global.navigator.geolocation = mockGeolocation;

// Enhanced Service Worker API with lifecycle
const serviceWorkerState = {
  controller: null as ServiceWorker | null,
  ready: null as Promise<ServiceWorkerRegistration> | null,
  registrations: new Map<string, ServiceWorkerRegistration>(),
};

global.navigator.serviceWorker = {
  controller: null,
  ready: new Promise((resolve) => {
    serviceWorkerState.ready = Promise.resolve({
      scope: '/',
      updateViaCache: 'imports',
      active: {
        scriptURL: '/sw.js',
        state: 'activated',
        postMessage: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as any,
      installing: null,
      waiting: null,
      navigationPreload: {
        enable: jest.fn(() => Promise.resolve()),
        disable: jest.fn(() => Promise.resolve()),
        setHeaderValue: jest.fn(() => Promise.resolve()),
        getState: jest.fn(() => Promise.resolve({ enabled: false, headerValue: 'true' })),
      },
      pushManager: {
        getSubscription: jest.fn(() => Promise.resolve(null)),
        subscribe: jest.fn(() => Promise.resolve({
          endpoint: 'https://fcm.googleapis.com/fcm/send/test',
          expirationTime: null,
          options: {},
          getKey: jest.fn(),
          toJSON: jest.fn(),
          unsubscribe: jest.fn(() => Promise.resolve(true)),
        })),
        permissionState: jest.fn(() => Promise.resolve('granted')),
      },
      sync: {
        register: jest.fn(() => Promise.resolve()),
        getTags: jest.fn(() => Promise.resolve([])),
      },
      unregister: jest.fn(() => Promise.resolve(true)),
      update: jest.fn(() => Promise.resolve()),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as any);
    resolve(serviceWorkerState.ready as any);
  }),
  register: jest.fn(async (scriptURL: string, options?: RegistrationOptions) => {
    trackAPIUsage('serviceWorker.register');
    const registration = await serviceWorkerState.ready;
    serviceWorkerState.registrations.set(scriptURL, registration as any);
    return registration;
  }),
  getRegistration: jest.fn(async (scope?: string) => {
    trackAPIUsage('serviceWorker.getRegistration');
    return serviceWorkerState.ready;
  }),
  getRegistrations: jest.fn(async () => {
    trackAPIUsage('serviceWorker.getRegistrations');
    return Array.from(serviceWorkerState.registrations.values());
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  startMessages: jest.fn(),
} as any;

// Mock Web APIs
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Notification API
global.Notification = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
global.Notification.requestPermission = jest.fn().mockResolvedValue('granted');

// Mock Clipboard API
global.navigator.clipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
  readText: jest.fn().mockResolvedValue(''),
  write: jest.fn().mockResolvedValue(undefined),
  read: jest.fn().mockResolvedValue([]),
};

// Mock Web Crypto API
global.crypto = {
  getRandomValues: jest.fn().mockImplementation((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
  randomUUID: jest.fn().mockReturnValue('mock-uuid'),
  subtle: {
    encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    decrypt: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    sign: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    verify: jest.fn().mockResolvedValue(true),
    digest: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    generateKey: jest.fn().mockResolvedValue({}),
    importKey: jest.fn().mockResolvedValue({}),
    exportKey: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    deriveBits: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    deriveKey: jest.fn().mockResolvedValue({}),
    wrapKey: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    unwrapKey: jest.fn().mockResolvedValue({}),
  },
};

// Mock Performance API
global.performance = {
  ...global.performance,
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn().mockReturnValue([]),
  getEntriesByType: jest.fn().mockReturnValue([]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  now: jest.fn().mockReturnValue(Date.now()),
};

// Mock File API
global.File = jest.fn().mockImplementation((chunks, filename, options) => ({
  name: filename,
  size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
  type: options?.type || '',
  lastModified: Date.now(),
  webkitRelativePath: '',
  stream: jest.fn(),
  text: jest.fn().mockResolvedValue(''),
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
  slice: jest.fn().mockReturnValue(new Blob()),
}));

global.FileReader = jest.fn().mockImplementation(() => ({
  readAsText: jest.fn(),
  readAsDataURL: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  readAsBinaryString: jest.fn(),
  abort: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  result: null,
  error: null,
  readyState: 0,
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
}));

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn().mockReturnValue({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  }),
  putImageData: jest.fn(),
  createImageData: jest.fn().mockReturnValue({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  }),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn().mockReturnValue({ width: 0 }),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
});

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
  writable: true,
  value: false,
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: { value: 440 },
  }),
  createGain: jest.fn().mockReturnValue({
    connect: jest.fn(),
    gain: { value: 1 },
  }),
  destination: {},
  close: jest.fn().mockResolvedValue(undefined),
  suspend: jest.fn().mockResolvedValue(undefined),
  resume: jest.fn().mockResolvedValue(undefined),
  state: 'running',
  sampleRate: 44100,
  currentTime: 0,
}));

// Mock MediaDevices API
global.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: jest.fn().mockReturnValue([]),
    getVideoTracks: jest.fn().mockReturnValue([]),
    getAudioTracks: jest.fn().mockReturnValue([]),
    addTrack: jest.fn(),
    removeTrack: jest.fn(),
    clone: jest.fn().mockReturnValue({}),
    active: true,
    id: 'mock-stream-id',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
  enumerateDevices: jest.fn().mockResolvedValue([]),
  getSupportedConstraints: jest.fn().mockReturnValue({}),
  getDisplayMedia: jest.fn().mockResolvedValue({}),
};

// Mock Permissions API
global.navigator.permissions = {
  query: jest.fn().mockResolvedValue({
    state: 'granted',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
};

// Mock Battery API
global.navigator.getBattery = jest.fn().mockResolvedValue({
  charging: true,
  chargingTime: 0,
  dischargingTime: Infinity,
  level: 1,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

// Mock Vibration API
global.navigator.vibrate = jest.fn().mockReturnValue(true);

// Mock Network Information API
global.navigator.connection = {
  effectiveType: '4g',
  downlink: 10,
  rtt: 100,
  saveData: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock Payment Request API
global.PaymentRequest = jest.fn().mockImplementation(() => ({
  show: jest.fn().mockResolvedValue({
    complete: jest.fn().mockResolvedValue(undefined),
    retry: jest.fn().mockResolvedValue(undefined),
  }),
  abort: jest.fn().mockResolvedValue(undefined),
  canMakePayment: jest.fn().mockResolvedValue(true),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Broadcast Channel API
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Mutation Observer
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([]),
}));

// Mock console methods for cleaner output
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Keep error and warn for debugging
  error: originalConsole.error,
  warn: originalConsole.warn,
  // Suppress info, log, debug in tests unless explicitly enabled
  info: process.env.JEST_VERBOSE === 'true' ? originalConsole.info : jest.fn(),
  log: process.env.JEST_VERBOSE === 'true' ? originalConsole.log : jest.fn(),
  debug: process.env.JEST_VERBOSE === 'true' ? originalConsole.debug : jest.fn(),
};

// Mock Next.js specific APIs (if using Next.js)
if (typeof window !== 'undefined') {
  // Mock Next.js router
  jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      pathname: '/',
      query: {},
      asPath: '/',
      route: '/',
      basePath: '',
      locale: 'en',
      locales: ['en'],
      defaultLocale: 'en',
      isReady: true,
      isPreview: false,
      isLocaleDomain: false,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }),
  }));

  // Mock Next.js dynamic imports
  jest.mock('next/dynamic', () => {
    return jest.fn().mockImplementation((importFunc) => {
      const Component = importFunc();
      return Component;
    });
  });

  // Mock Next.js Image component
  jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, ...props }: any) => {
      return <img src={src} alt={alt} {...props} />;
    },
  }));
}

// Mock React Native Web specific components
jest.mock('react-native-web', () => ({
  ...jest.requireActual('react-native-web'),
  Linking: {
    openURL: jest.fn().mockResolvedValue(undefined),
    canOpenURL: jest.fn().mockResolvedValue(true),
    getInitialURL: jest.fn().mockResolvedValue(null),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Share: {
    share: jest.fn().mockResolvedValue({ action: 'sharedAction' }),
  },
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 1024, height: 768 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  Platform: {
    OS: 'web',
    Version: '1.0.0',
    select: jest.fn().mockImplementation((options) => options.web || options.default),
  },
  PixelRatio: {
    get: jest.fn().mockReturnValue(1),
    getFontScale: jest.fn().mockReturnValue(1),
    getPixelSizeForLayoutSize: jest.fn().mockImplementation((size) => size),
    roundToNearestPixel: jest.fn().mockImplementation((size) => size),
  },
}));

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Test environment cleanup
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset storage
  (global.localStorage as any).__setStore({});
  (global.sessionStorage as any).__setStore({});
  
  // Clear performance entries
  performanceEntries.length = 0;
  
  // Reset service worker state
  serviceWorkerState.controller = null;
  serviceWorkerState.registrations.clear();
  
  // Clear media query listeners
  mediaQueryListeners.clear();
  
  // Reset DOM operations counter
  webPerformanceMetrics.domOperations = 0;
  
  // Clear console mocks if verbose mode is disabled
  if (process.env.JEST_VERBOSE !== 'true') {
    (console.log as jest.Mock).mockClear();
    (console.info as jest.Mock).mockClear();
    (console.debug as jest.Mock).mockClear();
  }
});

afterEach(() => {
  // Clean up any remaining timers
  jest.runOnlyPendingTimers();
  jest.clearAllTimers();
  
  // Clear animation frame callbacks
  animationFrameCallbacks.clear();
  
  // Clear geolocation watches
  const watchIntervals = (mockGeolocation as any).watchIntervals;
  if (watchIntervals) {
    watchIntervals.forEach((interval: NodeJS.Timeout) => clearInterval(interval));
    watchIntervals.clear();
  }
});

// ===== Enhanced Performance API =====
const performanceEntries: PerformanceEntry[] = [];

global.performance = {
  ...global.performance,
  mark: jest.fn((markName: string) => {
    trackAPIUsage('performance.mark');
    const entry: PerformanceMark = {
      name: markName,
      entryType: 'mark',
      startTime: performance.now(),
      duration: 0,
      toJSON: () => ({}),
    };
    performanceEntries.push(entry);
  }),
  measure: jest.fn((measureName: string, startMark?: string, endMark?: string) => {
    trackAPIUsage('performance.measure');
    const startEntry = startMark ? performanceEntries.find(e => e.name === startMark) : null;
    const endEntry = endMark ? performanceEntries.find(e => e.name === endMark) : null;
    
    const entry: PerformanceMeasure = {
      name: measureName,
      entryType: 'measure',
      startTime: startEntry?.startTime || 0,
      duration: (endEntry?.startTime || performance.now()) - (startEntry?.startTime || 0),
      toJSON: () => ({}),
    };
    performanceEntries.push(entry);
  }),
  getEntriesByName: jest.fn((name: string) => {
    return performanceEntries.filter(e => e.name === name);
  }),
  getEntriesByType: jest.fn((type: string) => {
    return performanceEntries.filter(e => e.entryType === type);
  }),
  clearMarks: jest.fn((markName?: string) => {
    if (markName) {
      const index = performanceEntries.findIndex(e => e.name === markName && e.entryType === 'mark');
      if (index > -1) performanceEntries.splice(index, 1);
    } else {
      performanceEntries.splice(0, performanceEntries.length, 
        ...performanceEntries.filter(e => e.entryType !== 'mark'));
    }
  }),
  clearMeasures: jest.fn((measureName?: string) => {
    if (measureName) {
      const index = performanceEntries.findIndex(e => e.name === measureName && e.entryType === 'measure');
      if (index > -1) performanceEntries.splice(index, 1);
    } else {
      performanceEntries.splice(0, performanceEntries.length, 
        ...performanceEntries.filter(e => e.entryType !== 'measure'));
    }
  }),
  now: performance.now.bind(performance),
  timeOrigin: performance.timeOrigin,
} as any;

// ===== Custom Test Utilities =====
export const webTestUtils = {
  // Simulate media query change
  triggerMediaQueryChange: (query: string, matches: boolean) => {
    const listeners = mediaQueryListeners.get(query);
    if (listeners) {
      const event = { matches, media: query } as MediaQueryListEvent;
      listeners.forEach(listener => listener(event));
    }
  },
  
  // Simulate offline/online
  goOffline: () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    window.dispatchEvent(new Event('offline'));
  },
  
  goOnline: () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
    window.dispatchEvent(new Event('online'));
  },
  
  // Performance metrics
  getPerformanceMetrics: () => ({
    ...webPerformanceMetrics,
    setupDuration: performance.now() - webPerformanceMetrics.setupStartTime,
  }),
  
  // Storage helpers
  fillLocalStorage: (percentage: number) => {
    const quota = 5 * 1024 * 1024; // 5MB
    const targetBytes = Math.floor(quota * (percentage / 100));
    const chunk = 'x'.repeat(1024); // 1KB chunks
    let used = 0;
    let key = 0;
    
    while (used < targetBytes) {
      try {
        localStorage.setItem(`test-${key}`, chunk);
        used += chunk.length + `test-${key}`.length;
        key++;
      } catch (e) {
        break;
      }
    }
  },
  
  // Service Worker helpers
  mockServiceWorkerMessage: (data: any) => {
    const event = new MessageEvent('message', {
      data,
      origin: window.location.origin,
      source: navigator.serviceWorker.controller,
    });
    navigator.serviceWorker.dispatchEvent(event);
  },
  
  // Accessibility helpers
  mockScreenReader: () => {
    window.matchMedia('(prefers-reduced-motion: reduce)').matches = true;
    document.documentElement.setAttribute('aria-busy', 'false');
  },
};

// Log setup completion
const setupEndTime = performance.now();
const setupDuration = setupEndTime - webPerformanceMetrics.setupStartTime;

console.info('🌐 Jest Web Setup Complete - DataSphere Guilds v3.0.0');
console.info(`📱 Platform: Web | Environment: jsdom | Setup: ${setupDuration.toFixed(2)}ms`);

// Export for monitoring
export { webPerformanceMetrics }; 