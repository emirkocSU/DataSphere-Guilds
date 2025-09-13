# Jest Testing Configuration - DataSphere Guilds

## 🚀 Overview

This directory contains the enterprise-grade Jest testing configuration for DataSphere Guilds. Our setup supports multi-platform testing (iOS, Android, Web), comprehensive mocking, performance monitoring, and advanced testing utilities.

## 📁 Structure

```
jest/
├── setup.native.ts      # React Native platform setup
├── setup.web.ts         # Web platform setup
├── setupAfterEnv.ts     # Test environment configuration
├── types.d.ts           # TypeScript definitions
├── resolver.js          # Custom module resolver
└── README.md            # This file
```

## 🎯 Features

### Multi-Platform Support
- **Native**: iOS and Android testing with React Native
- **Web**: Browser testing with React Native Web
- **Universal**: Shared test utilities across platforms

### Comprehensive Mocking
- 100+ dependencies mocked
- Expo SDK modules
- React Native core modules
- Firebase services
- AI/ML libraries (OpenAI, TensorFlow)
- Navigation libraries
- State management (Redux, React Query)
- Analytics and monitoring tools

### Performance Features
- Test execution monitoring
- Memory leak detection
- Performance metrics tracking
- CI/CD optimizations
- Parallel test execution

### Developer Experience
- Custom matchers for React Native
- Global test utilities
- Test data factories
- Network mocking utilities
- Snapshot testing
- Coverage reporting

## 🛠️ Configuration

### Environment Variables

```bash
# Platform selection
TEST_PLATFORM=native|web     # Default: native

# Test types
TEST_TYPE=unit|integration|e2e  # Default: unit

# Performance monitoring
LOG_PERFORMANCE_STATS=true    # Log performance metrics
DETECT_MEMORY_LEAKS=true      # Enable memory leak detection
LOG_SLOW_TESTS=true           # Log tests slower than 1s

# Debug options
JEST_VERBOSE=true             # Verbose output
DEBUG_TESTS=true              # Debug mode
DEBUG_RESOLVER=true           # Debug module resolution

# CI/CD
CI=true                       # CI environment
GITHUB_ACTIONS=true           # GitHub Actions
```

### Test Commands

```bash
# Basic commands
npm test                      # Run all tests
npm run test:watch            # Watch mode
npm run test:coverage         # With coverage

# Platform-specific
npm run test:native           # Native platform tests
npm run test:web              # Web platform tests
npm run test:all              # All platforms

# Test types
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests
npm run test:e2e              # End-to-end tests

# Performance monitoring
npm run test:performance      # With performance stats
npm run test:memory           # With memory leak detection
npm run test:slow             # Log slow tests

# Coverage by platform
npm run test:native:coverage  # Native with coverage
npm run test:web:coverage     # Web with coverage

# Utilities
npm run test:clear-cache      # Clear Jest cache
npm run test:update-snapshots # Update snapshots
```

## 📊 Coverage Thresholds

```javascript
{
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './src/services/': {
    branches: 85,
    functions: 85,
    lines: 85,
    statements: 85
  },
  './src/utils/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}
```

## 🧪 Custom Matchers

### Accessibility Matchers
```typescript
expect(element).toBeAccessible();
expect(element).toHaveAccessibilityLabel('Submit');
expect(element).toHaveAccessibilityRole('button');
expect(element).toHaveAccessibilityState({ disabled: false });
```

### Style Matchers
```typescript
expect(element).toHaveStyle({ backgroundColor: 'blue' });
expect(element).toBeVisible();
expect(element).toBeHidden();
```

### Performance Matchers
```typescript
await expect(promise).toCompleteWithin(1000);
expect(() => render(<Component />)).toRenderWithin(100);
```

### Data Validation
```typescript
expect('test@example.com').toBeValidEmail();
expect('+1234567890').toBeValidPhone();
expect('https://example.com').toBeValidURL();
```

## 🔧 Global Test Utilities

### Test Data Factory
```typescript
const user = testUtils.factory.user({
  email: 'custom@example.com',
  role: 'admin'
});

const tasks = testUtils.factory.tasks(5, {
  status: 'completed'
});
```

### Network Mocking
```typescript
testUtils.networkMock.mockResponse(
  'https://api.example.com/users',
  { users: [...] },
  { status: 200, delay: 100 }
);

const lastRequest = testUtils.networkMock.getLastRequest();
```

### Performance Tracking
```typescript
const stopTimer = testUtils.performance.start('api-call');
// ... perform operation
stopTimer();

const stats = testUtils.performance.getStats('api-call');
console.log(`Average: ${stats.avg}ms, P95: ${stats.p95}ms`);
```

### Platform-Specific Utilities

#### Native
```typescript
nativeTestUtils.mockCameraPermission('authorized');
nativeTestUtils.mockLocation({ latitude: 41.0082, longitude: 28.9784 });
nativeTestUtils.mockNetworkState(true, 'wifi');
nativeTestUtils.simulateAppStateChange('background');
```

#### Web
```typescript
webTestUtils.triggerMediaQueryChange('(prefers-color-scheme: dark)', true);
webTestUtils.goOffline();
webTestUtils.fillLocalStorage(90); // Fill to 90%
webTestUtils.mockServiceWorkerMessage({ type: 'CACHE_UPDATED' });
```

## 📈 CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  env:
    CI: true
    GITHUB_ACTIONS: true
    TEST_PLATFORM: ${{ matrix.platform }}
  run: npm run test:ci
```

### Coverage Reports
- HTML reports in `coverage/`
- LCOV for CI integration
- Platform-specific reports
- JUnit XML for CI systems

## 🐛 Debugging

### Debug Test Execution
```bash
npm run test:debug
# Opens Node debugger on port 9229
```

### Verbose Output
```bash
JEST_VERBOSE=true npm test
```

### Module Resolution Issues
```bash
DEBUG_RESOLVER=true npm test
```

## 🔍 Best Practices

1. **Mock Early**: All external dependencies are mocked in setup files
2. **Use Factories**: Use test data factories for consistent test data
3. **Platform Awareness**: Write platform-specific tests when needed
4. **Performance**: Monitor test performance in CI
5. **Coverage**: Maintain coverage thresholds
6. **Cleanup**: Tests automatically cleanup after execution

## 🚨 Common Issues

### Module Resolution
- Check `jest/resolver.js` for custom resolution logic
- Verify platform-specific extensions (.native.ts, .web.ts)

### Memory Leaks
- Enable `DETECT_MEMORY_LEAKS=true`
- Check for uncleaned timers or subscriptions

### Slow Tests
- Enable `LOG_SLOW_TESTS=true`
- Consider mocking heavy operations
- Use `test.concurrent` for parallel execution

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro)
- [DataSphere Guilds Wiki](https://github.com/datasphere-org/datasphere-guilds/wiki)

## 🤝 Contributing

When adding new dependencies or features:
1. Update the appropriate setup file
2. Add TypeScript definitions to `types.d.ts`
3. Document new utilities in this README
4. Ensure all platforms are supported

---

**Version**: 3.0.0  
**Last Updated**: December 2024  
**Maintained by**: DataSphere Guilds Team 