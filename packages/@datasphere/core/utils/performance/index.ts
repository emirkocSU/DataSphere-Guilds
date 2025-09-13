/** @fileoverview Zero-overhead performance utilities with sub-millisecond precision and memory pooling. */

// Core performance exports
export * from './cache';
export * from './throttle';
export * from './optimize';
export * from './monitor';
export * from './metrics';
export * from './profiler';

// Memory management
export {
  ObjectPool,
  BufferPool,
  MemoryMonitor,
  GCOptimizer
} from './memory';

// Ultra-fast utilities
export {
  FastMap,
  FastSet,
  FastArray,
  BitVector
} from './collections';

// Performance measurement
export {
  PrecisionTimer,
  PerformanceProfiler,
  BenchmarkRunner,
  LoadTester
} from './measurement';

// Optimization strategies
export {
  LazyLoader,
  BatchProcessor,
  StreamProcessor,
  WorkerPool
} from './optimization';

// Zero-allocation utilities
export {
  createMemoized,
  createPooled,
  createBatched,
  createThrottled
} from './factories';
