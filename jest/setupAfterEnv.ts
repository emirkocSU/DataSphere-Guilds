/**
 * Jest Setup After Environment (DataSphere Guilds)
 * 
 * Enterprise-grade test environment configuration
 * Runs after the test framework has been installed in the environment
 * 
 * Features:
 * - Custom matchers for React Native and Web
 * - Global test utilities and helpers
 * - Performance monitoring
 * - Memory leak detection
 * - Accessibility testing utilities
 * - Network mocking utilities
 * - Test data factories
 * - Snapshot serializers
 * 
 * @version 3.0.0
 * @author DataSphere Guilds Team
 */

import '@testing-library/jest-native/extend-expect';
import { configure } from '@testing-library/react-native';
import { format } from 'util';

// Configure Testing Library
configure({
  asyncUtilTimeout: 5000,
  defaultHidden: true,
  defaultDebugOptions: {
    debug: process.env.DEBUG_TESTS === 'true',
    mapProps: (props: Record<string, any>) => {
      // Remove internal React props from debug output
      const { _owner, _store, ...visibleProps } = props;
      return visibleProps;
    },
  },
});

// ===== Custom Matchers =====

declare global {
  namespace jest {
    interface Matchers<R> {
      // Accessibility matchers
      toBeAccessible(): R;
      toHaveAccessibilityLabel(label: string): R;
      toHaveAccessibilityRole(role: string): R;
      toHaveAccessibilityState(state: Record<string, any>): R;
      
      // Style matchers
      toHaveStyle(style: Record<string, any>): R;
      toBeVisible(): R;
      toBeHidden(): R;
      
      // Performance matchers
      toCompleteWithin(ms: number): R;
      toRenderWithin(ms: number): R;
      
      // Async matchers
      toResolveWithin(ms: number): R;
      toRejectWithin(ms: number): R;
      
      // Data validation matchers
      toMatchSchema(schema: any): R;
      toBeValidEmail(): R;
      toBeValidPhone(): R;
      toBeValidURL(): R;
      
      // Component matchers
      toHaveBeenCalledWithProps(props: Record<string, any>): R;
      toHaveRenderedTimes(times: number): R;
      
      // Network matchers
      toHaveBeenCalledWithEndpoint(endpoint: string): R;
      toHaveReturnedSuccessResponse(): R;
      toHaveReturnedErrorResponse(status?: number): R;
    }
  }
}

// Accessibility matchers implementation
expect.extend({
  toBeAccessible(received) {
    const hasAccessibilityRole = received.props?.accessibilityRole || received.props?.role;
    const hasAccessibilityLabel = 
      received.props?.accessibilityLabel || 
      received.props?.['aria-label'] ||
      (typeof received.props?.children === 'string' && received.props.children);
    
    const pass = hasAccessibilityRole && hasAccessibilityLabel;
    
    return {
      message: () => 
        pass 
          ? `Expected element not to be accessible, but it has role "${hasAccessibilityRole}" and label "${hasAccessibilityLabel}"`
          : `Expected element to be accessible (must have accessibilityRole/role and accessibilityLabel/aria-label)`,
      pass,
    };
  },
  
  toHaveAccessibilityLabel(received, expectedLabel: string) {
    const actualLabel = 
      received.props?.accessibilityLabel || 
      received.props?.['aria-label'] || 
      '';
    
    const pass = actualLabel === expectedLabel;
    
    return {
      message: () =>
        pass
          ? `Expected element not to have accessibility label "${expectedLabel}"`
          : `Expected element to have accessibility label "${expectedLabel}", but got "${actualLabel}"`,
      pass,
    };
  },
  
  toHaveAccessibilityRole(received, expectedRole: string) {
    const actualRole = received.props?.accessibilityRole || received.props?.role || '';
    const pass = actualRole === expectedRole;
    
    return {
      message: () =>
        pass
          ? `Expected element not to have accessibility role "${expectedRole}"`
          : `Expected element to have accessibility role "${expectedRole}", but got "${actualRole}"`,
      pass,
    };
  },
  
  toHaveAccessibilityState(received, expectedState: Record<string, any>) {
    const actualState = received.props?.accessibilityState || {};
    const pass = Object.entries(expectedState).every(
      ([key, value]) => actualState[key] === value
    );
    
    return {
      message: () =>
        pass
          ? `Expected element not to have accessibility state ${JSON.stringify(expectedState)}`
          : `Expected element to have accessibility state ${JSON.stringify(expectedState)}, but got ${JSON.stringify(actualState)}`,
      pass,
    };
  },
});

// Style matchers implementation
expect.extend({
  toHaveStyle(received, expectedStyle: Record<string, any>) {
    const actualStyle = received.props?.style || {};
    const flattenedStyle = Array.isArray(actualStyle) 
      ? Object.assign({}, ...actualStyle) 
      : actualStyle;
    
    const mismatches: string[] = [];
    
    Object.entries(expectedStyle).forEach(([key, value]) => {
      if (flattenedStyle[key] !== value) {
        mismatches.push(`${key}: expected ${value}, got ${flattenedStyle[key]}`);
      }
    });
    
    const pass = mismatches.length === 0;
    
    return {
      message: () =>
        pass
          ? `Expected element not to have style ${JSON.stringify(expectedStyle)}`
          : `Expected element to have style:\n${mismatches.join('\n')}`,
      pass,
    };
  },
  
  toBeVisible(received) {
    const style = received.props?.style || {};
    const flattenedStyle = Array.isArray(style) 
      ? Object.assign({}, ...style) 
      : style;
    
    const isHidden = 
      flattenedStyle.display === 'none' ||
      flattenedStyle.opacity === 0 ||
      flattenedStyle.visibility === 'hidden';
    
    const pass = !isHidden;
    
    return {
      message: () =>
        pass
          ? 'Expected element not to be visible'
          : 'Expected element to be visible',
      pass,
    };
  },
  
  toBeHidden(received) {
    const result = (expect(received) as any).toBeVisible();
    return {
      message: () =>
        result.pass
          ? 'Expected element to be hidden'
          : 'Expected element not to be hidden',
      pass: !result.pass,
    };
  },
});

// Performance matchers implementation
expect.extend({
  async toCompleteWithin(received: Promise<any>, ms: number) {
    const startTime = performance.now();
    let completed = false;
    let error: any = null;
    
    try {
      await Promise.race([
        received.then(() => { completed = true; }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), ms)
        ),
      ]);
    } catch (e) {
      error = e;
    }
    
    const duration = performance.now() - startTime;
    const pass = completed && duration <= ms;
    
    return {
      message: () =>
        pass
          ? `Expected promise not to complete within ${ms}ms, but it completed in ${duration.toFixed(2)}ms`
          : `Expected promise to complete within ${ms}ms, but it ${
              error?.message === 'Timeout' 
                ? `timed out after ${ms}ms` 
                : `failed with: ${error?.message}`
            }`,
      pass,
    };
  },
  
  toRenderWithin(received: () => any, ms: number) {
    const startTime = performance.now();
    let error: any = null;
    
    try {
      received();
    } catch (e) {
      error = e;
    }
    
    const duration = performance.now() - startTime;
    const pass = !error && duration <= ms;
    
    return {
      message: () =>
        pass
          ? `Expected component not to render within ${ms}ms, but it rendered in ${duration.toFixed(2)}ms`
          : `Expected component to render within ${ms}ms, but it ${
              error 
                ? `failed with: ${error.message}` 
                : `took ${duration.toFixed(2)}ms`
            }`,
      pass,
    };
  },
});

// Data validation matchers
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    return {
      message: () =>
        pass
          ? `Expected "${received}" not to be a valid email`
          : `Expected "${received}" to be a valid email`,
      pass,
    };
  },
  
  toBeValidPhone(received: string) {
    // Support multiple phone formats
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    const pass = phoneRegex.test(received.replace(/\s/g, ''));
    
    return {
      message: () =>
        pass
          ? `Expected "${received}" not to be a valid phone number`
          : `Expected "${received}" to be a valid phone number`,
      pass,
    };
  },
  
  toBeValidURL(received: string) {
    try {
      new URL(received);
      return {
        message: () => `Expected "${received}" not to be a valid URL`,
        pass: true,
      };
    } catch {
      return {
        message: () => `Expected "${received}" to be a valid URL`,
        pass: false,
      };
    }
  },
});

// ===== Global Test Utilities =====

// Performance tracking
const testPerformance = {
  measurements: new Map<string, number[]>(),
  
  start(label: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      const measurements = this.measurements.get(label) || [];
      measurements.push(duration);
      this.measurements.set(label, measurements);
    };
  },
  
  getStats(label: string) {
    const measurements = this.measurements.get(label) || [];
    if (measurements.length === 0) return null;
    
    const sorted = [...measurements].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  },
  
  reset() {
    this.measurements.clear();
  },
};

// Memory leak detection
const memoryLeakDetector = {
  initialHeap: 0,
  threshold: 50 * 1024 * 1024, // 50MB
  
  start() {
    if (global.gc) {
      global.gc();
    }
    this.initialHeap = process.memoryUsage().heapUsed;
  },
  
  check(testName: string) {
    if (global.gc) {
      global.gc();
    }
    
    const currentHeap = process.memoryUsage().heapUsed;
    const increase = currentHeap - this.initialHeap;
    
    if (increase > this.threshold) {
      console.warn(
        `⚠️  Potential memory leak in "${testName}": ` +
        `Heap increased by ${(increase / 1024 / 1024).toFixed(2)}MB`
      );
    }
  },
};

// Network mock utilities
const networkMock = {
  requests: [] as Array<{ url: string; method: string; body?: any; headers?: any }>,
  
  reset() {
    this.requests = [];
  },
  
  mockResponse(url: string | RegExp, response: any, options: any = {}) {
    const status = options.status || 200;
    const delay = options.delay || 0;
    
    (global.fetch as jest.Mock).mockImplementation(async (requestUrl: string, init?: RequestInit) => {
      this.requests.push({
        url: requestUrl,
        method: init?.method || 'GET',
        body: init?.body,
        headers: init?.headers,
      });
      
      const matches = typeof url === 'string' ? requestUrl === url : url.test(requestUrl);
      
      if (matches) {
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        return {
          ok: status >= 200 && status < 300,
          status,
          statusText: options.statusText || 'OK',
          headers: new Headers(options.headers || {}),
          json: async () => response,
          text: async () => JSON.stringify(response),
          blob: async () => new Blob([JSON.stringify(response)]),
          arrayBuffer: async () => new ArrayBuffer(0),
          formData: async () => new FormData(),
          clone: function() { return this; },
        };
      }
      
      throw new Error(`No mock found for ${requestUrl}`);
    });
  },
  
  getLastRequest() {
    return this.requests[this.requests.length - 1];
  },
  
  findRequest(predicate: (req: any) => boolean) {
    return this.requests.find(predicate);
  },
};

// Test data factories
const testDataFactory = {
  user: (overrides = {}) => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
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
  
  task: (overrides = {}) => ({
    id: `task-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test Task',
    description: 'Test task description',
    domain: 'image-labeling',
    reward: 25.0,
    currency: 'USD',
    status: 'open',
    deadline: new Date(Date.now() + 86400000).toISOString(),
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
  
  qcResult: (overrides = {}) => ({
    id: `qc-${Math.random().toString(36).substr(2, 9)}`,
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
  
  // Batch creators
  users: (count: number, overrides = {}) => 
    Array.from({ length: count }, (_, i) => 
      testDataFactory.user({ ...overrides, email: `test${i}@example.com` })
    ),
  
  tasks: (count: number, overrides = {}) =>
    Array.from({ length: count }, (_, i) =>
      testDataFactory.task({ ...overrides, title: `Test Task ${i + 1}` })
    ),
};

// Make utilities globally available
(global as any).testUtils = {
  performance: testPerformance,
  memoryLeakDetector,
  networkMock,
  factory: testDataFactory,
};

// ===== Global Test Configuration =====

// Set longer timeout for integration tests
if (process.env.TEST_TYPE === 'integration') {
  jest.setTimeout(30000); // 30 seconds
} else {
  jest.setTimeout(10000); // 10 seconds
}

// Global setup for each test
beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Reset network mock
  networkMock.reset();
  
  // Start memory leak detection
  if (process.env.DETECT_MEMORY_LEAKS === 'true') {
    memoryLeakDetector.start();
  }
  
  // Clear performance measurements
  testPerformance.reset();
  
  // Setup default fetch mock
  if (!global.fetch || !(global.fetch as jest.Mock).mockImplementation) {
    global.fetch = jest.fn(() => 
      Promise.reject(new Error('Fetch not mocked. Use networkMock.mockResponse()'))
    );
  }
});

// Global teardown for each test
afterEach(() => {
  // Check for memory leaks
  if (process.env.DETECT_MEMORY_LEAKS === 'true') {
    const testName = expect.getState().currentTestName || 'Unknown Test';
    memoryLeakDetector.check(testName);
  }
  
  // Log slow tests
  if (process.env.LOG_SLOW_TESTS === 'true') {
    const testName = expect.getState().currentTestName || 'Unknown Test';
    const testRuntime = expect.getState().testResults?.[0]?.duration;
    
    if (testRuntime && testRuntime > 1000) {
      console.warn(`⚠️  Slow test detected: "${testName}" took ${testRuntime}ms`);
    }
  }
  
  // Restore all mocks
  jest.restoreAllMocks();
  
  // Clear all timers
  jest.clearAllTimers();
});

// Silence specific console methods in tests
const originalConsole = { ...console };

beforeAll(() => {
  // Silence console methods unless in verbose mode
  if (process.env.JEST_VERBOSE !== 'true') {
    console.log = jest.fn();
    console.info = jest.fn();
    console.debug = jest.fn();
  }
  
  // Always show warnings and errors
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

afterAll(() => {
  // Restore console
  Object.assign(console, originalConsole);
  
  // Log performance stats if enabled
  if (process.env.LOG_PERFORMANCE_STATS === 'true') {
    console.log('\n📊 Performance Statistics:');
    testPerformance.measurements.forEach((measurements, label) => {
      const stats = testPerformance.getStats(label);
      if (stats) {
        console.log(`  ${label}:`);
        console.log(`    Count: ${stats.count}`);
        console.log(`    Avg: ${stats.avg.toFixed(2)}ms`);
        console.log(`    P95: ${stats.p95.toFixed(2)}ms`);
      }
    });
  }
});

// Export utilities for use in tests
export {
  testPerformance,
  memoryLeakDetector,
  networkMock,
  testDataFactory,
}; 