/**
 * LoginScreen Component Tests
 * 
 * Enterprise-grade test suite for the LoginScreen component in DataSphere Guilds
 * Covers authentication flows, validation, accessibility, performance, and edge cases
 * 
 * @version 3.0.0
 * @author DataSphere Team
 */

import React from 'react';
import { 
  render, 
  fireEvent, 
  waitFor, 
  act,
  screen,
  within,
  cleanup
} from '@testing-library/react-native';
import { 
  Text, 
  ActivityIndicator, 
  Platform, 
  Dimensions,
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

import LoginScreen from '@screens/Auth/LoginScreen';
import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import * as authService from '@services/authService';
import * as analyticsService from '@services/analyticsService';
import * as notificationService from '@services/notificationService';
import { theme } from '@theme';
import type { 
  AuthStackParamList, 
  LoginScreenProps,
  AuthError,
  LoginCredentials,
  AuthResponse
} from '@types';

// ===== Mock Dependencies =====

jest.mock('@services/authService');
jest.mock('@services/analyticsService');
jest.mock('@services/notificationService');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');
jest.mock('expo-local-authentication');
jest.mock('expo-secure-store');
jest.mock('expo-haptics');

// Mock React Navigation
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();
const mockCanGoBack = jest.fn(() => false);
const mockGetState = jest.fn(() => ({ index: 0, routes: [] }));

const mockNavigation = {
  navigate: mockNavigate,
  replace: mockReplace,
  goBack: mockGoBack,
  reset: mockReset,
  canGoBack: mockCanGoBack,
  getState: mockGetState,
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
} as any;

const mockRoute = {
  key: 'Login',
  name: 'Login',
  params: undefined,
} as any;

// Mock implementations
const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;
const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
const mockLocalAuth = LocalAuthentication as jest.Mocked<typeof LocalAuthentication>;
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockHaptics = Haptics as jest.Mocked<typeof Haptics>;

// ===== Test Setup =====

const Stack = createNativeStackNavigator<AuthStackParamList>();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={() => <>{children}</>} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  </ThemeProvider>
);

const createTestComponent = (props: Partial<LoginScreenProps> = {}) => {
  const defaultProps: LoginScreenProps = {
    navigation: mockNavigation,
    route: mockRoute,
    ...props,
  };

  return (
    <TestWrapper>
      <LoginScreen {...defaultProps} />
    </TestWrapper>
  );
};

// Test data factories
const createValidCredentials = (): LoginCredentials => ({
  email: 'worker@datasphereguilds.com',
  password: 'DataSphere2024!',
});

const createInvalidCredentials = (): LoginCredentials => ({
  email: 'invalid-email',
  password: '123',
});

const createAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refreshToken: 'refresh_token_123',
  user: {
    id: 'user-123',
    email: 'worker@datasphereguilds.com',
    name: 'John Doe',
    role: 'worker',
    reputation: 4.8,
    completedTasks: 156,
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  expiresIn: 3600,
  ...overrides,
});

const createAuthError = (type: string, message: string): AuthError => ({
  type,
  message,
  code: 'AUTH_ERROR',
  timestamp: new Date().toISOString(),
});

describe('LoginScreen', () => {
  // ===== Setup & Teardown =====

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Default mock implementations
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
    } as any);
    
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    ]);
    
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
    
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    mockSecureStore.setItemAsync.mockResolvedValue();
    mockSecureStore.deleteItemAsync.mockResolvedValue();
    
    mockHaptics.impactAsync.mockResolvedValue();
    mockHaptics.notificationAsync.mockResolvedValue();
    
    mockAnalyticsService.trackEvent.mockResolvedValue();
    mockNotificationService.scheduleNotification.mockResolvedValue('notification-id');
    
    // Mock Platform
    Platform.OS = 'ios';
    Platform.Version = '15.0';
    
    // Mock Dimensions
    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 375,
      height: 812,
      scale: 3,
      fontScale: 1,
    });
  });

  afterEach(() => {
    cleanup();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ===== Rendering & Basic Functionality =====

  describe('🎨 Rendering & Basic Functionality', () => {
    it('should render all essential UI elements', () => {
      const { getByTestId, getByText, getByPlaceholderText } = render(
        createTestComponent()
      );

      // Header elements
      expect(getByText('Welcome Back')).toBeTruthy();
      expect(getByText('Sign in to DataSphere Guilds')).toBeTruthy();
      
      // Input fields
      expect(getByPlaceholderText('Email address')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      
      // Buttons
      expect(getByText('Sign In')).toBeTruthy();
      expect(getByText('Forgot Password?')).toBeTruthy();
      expect(getByText("Don't have an account? Sign Up")).toBeTruthy();
      
      // Biometric authentication (if available)
      expect(getByTestId('biometric-login-button')).toBeTruthy();
      
      // Social login options
      expect(getByText('Continue with Google')).toBeTruthy();
      expect(getByText('Continue with Apple')).toBeTruthy();
    });

    it('should display DataSphere Guilds branding correctly', () => {
      const { getByTestId } = render(createTestComponent());
      
      const logo = getByTestId('datasphere-logo');
      expect(logo).toBeTruthy();
      
      const tagline = getByTestId('app-tagline');
      expect(tagline).toBeTruthy();
      expect(tagline.props.children).toContain('Be the boss of your own data business');
    });

    it('should render with correct theme colors', () => {
      const { getByTestId } = render(createTestComponent());
      
      const container = getByTestId('login-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: theme.colors.background,
          })
        ])
      );
    });

    it('should handle different screen sizes responsively', () => {
      // Test tablet layout
      jest.spyOn(Dimensions, 'get').mockReturnValue({
        width: 768,
        height: 1024,
        scale: 2,
        fontScale: 1,
      });

      const { getByTestId } = render(createTestComponent());
      const container = getByTestId('login-container');
      
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            maxWidth: 400, // Tablet constraint
          })
        ])
      );
    });
  });

  // ===== Authentication Flow =====

  describe('🔐 Authentication Flow', () => {
    it('should successfully authenticate with valid credentials', async () => {
      const credentials = createValidCredentials();
      const authResponse = createAuthResponse();
      
      mockAuthService.login.mockResolvedValue(authResponse);

      const { getByPlaceholderText, getByText } = render(
        createTestComponent()
      );

      // Fill in credentials
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);

      // Submit form
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });

      // Verify analytics tracking
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('login_success', {
        method: 'email',
        user_id: authResponse.user.id,
        user_role: authResponse.user.role,
      });
    });

    it('should handle authentication failure gracefully', async () => {
      const credentials = createValidCredentials();
      const authError = createAuthError('INVALID_CREDENTIALS', 'Invalid email or password');
      
      mockAuthService.login.mockRejectedValue(authError);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
        expect(getByText('Invalid email or password')).toBeTruthy();
      });

      // Verify error analytics
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('login_error', {
        error_type: 'INVALID_CREDENTIALS',
        error_message: 'Invalid email or password',
      });
    });

    it('should handle network errors appropriately', async () => {
      mockNetInfo.fetch.mockResolvedValue({
        isConnected: false,
        isInternetReachable: false,
      } as any);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByTestId('network-error')).toBeTruthy();
        expect(getByText('No internet connection. Please check your network and try again.')).toBeTruthy();
      });
    });

    it('should implement proper loading states', async () => {
      let resolveAuth: (value: AuthResponse) => void;
      const authPromise = new Promise<AuthResponse>((resolve) => {
        resolveAuth = resolve;
      });
      
      mockAuthService.login.mockReturnValue(authPromise);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      
      fireEvent.press(getByText('Sign In'));

      // Check loading state
      expect(getByTestId('login-loading')).toBeTruthy();
      expect(getByText('Signing In...')).toBeTruthy();
      
      // Button should be disabled during loading
      const signInButton = getByText('Signing In...');
      expect(signInButton.props.accessibilityState.disabled).toBe(true);

      // Resolve authentication
      act(() => {
        resolveAuth!(createAuthResponse());
      });

      await waitFor(() => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });
    });
  });

  // ===== Form Validation =====

  describe('✅ Form Validation', () => {
    it('should validate email format correctly', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      // Test invalid email formats
      const invalidEmails = [
        'invalid-email',
        'user@',
        '@domain.com',
        'user@domain',
        'user.domain.com',
        '',
      ];

      for (const email of invalidEmails) {
        fireEvent.changeText(getByPlaceholderText('Email address'), email);
        fireEvent.changeText(getByPlaceholderText('Password'), 'ValidPassword123!');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
          expect(getByTestId('email-error')).toBeTruthy();
          expect(getByText('Please enter a valid email address')).toBeTruthy();
        });
      }
    });

    it('should validate password strength requirements', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      // Test weak passwords
      const weakPasswords = [
        '123',
        'password',
        '12345678',
        'PASSWORD',
        'Password',
        '',
      ];

      for (const password of weakPasswords) {
        fireEvent.changeText(getByPlaceholderText('Email address'), 'user@datasphereguilds.com');
        fireEvent.changeText(getByPlaceholderText('Password'), password);
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
          expect(getByTestId('password-error')).toBeTruthy();
        });
      }
    });

    it('should show real-time validation feedback', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        createTestComponent()
      );

      const emailInput = getByPlaceholderText('Email address');
      
      // Type invalid email
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(getByTestId('email-validation-icon')).toBeTruthy();
        expect(getByTestId('email-validation-icon').props.name).toBe('close-circle');
      });

      // Type valid email
      fireEvent.changeText(emailInput, 'user@datasphereguilds.com');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(getByTestId('email-validation-icon').props.name).toBe('checkmark-circle');
      });
    });

    it('should disable submit button when form is invalid', () => {
      const { getByText, getByPlaceholderText } = render(
        createTestComponent()
      );

      const signInButton = getByText('Sign In');
      
      // Initially disabled
      expect(signInButton.props.accessibilityState.disabled).toBe(true);

      // Still disabled with invalid data
      fireEvent.changeText(getByPlaceholderText('Email address'), 'invalid');
      fireEvent.changeText(getByPlaceholderText('Password'), '123');
      expect(signInButton.props.accessibilityState.disabled).toBe(true);

      // Enabled with valid data
      fireEvent.changeText(getByPlaceholderText('Email address'), 'user@datasphereguilds.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'ValidPassword123!');
      expect(signInButton.props.accessibilityState.disabled).toBe(false);
    });
  });

  // ===== Biometric Authentication =====

  describe('🔒 Biometric Authentication', () => {
    it('should show biometric login option when available', async () => {
      mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
      mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);

      const { getByTestId } = render(createTestComponent());

      await waitFor(() => {
        expect(getByTestId('biometric-login-button')).toBeTruthy();
      });
    });

    it('should hide biometric login when not available', async () => {
      mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);

      const { queryByTestId } = render(createTestComponent());

      await waitFor(() => {
        expect(queryByTestId('biometric-login-button')).toBeNull();
      });
    });

    it('should authenticate with biometrics successfully', async () => {
      const storedCredentials = createValidCredentials();
      const authResponse = createAuthResponse();
      
      mockLocalAuth.authenticateAsync.mockResolvedValue({
        success: true,
        error: undefined,
        warning: undefined,
      });
      
      mockSecureStore.getItemAsync.mockImplementation((key) => {
        if (key === 'biometric_email') return Promise.resolve(storedCredentials.email);
        if (key === 'biometric_password') return Promise.resolve(storedCredentials.password);
        return Promise.resolve(null);
      });
      
      mockAuthService.login.mockResolvedValue(authResponse);

      const { getByTestId } = render(createTestComponent());

      await waitFor(() => {
        expect(getByTestId('biometric-login-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('biometric-login-button'));

      await waitFor(() => {
        expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith({
          promptMessage: 'Sign in to DataSphere Guilds',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Password',
        });
        expect(mockAuthService.login).toHaveBeenCalledWith(storedCredentials);
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });
    });

    it('should handle biometric authentication failure', async () => {
      mockLocalAuth.authenticateAsync.mockResolvedValue({
        success: false,
        error: 'user_cancel',
        warning: undefined,
      });

      const { getByTestId } = render(createTestComponent());

      await waitFor(() => {
        expect(getByTestId('biometric-login-button')).toBeTruthy();
      });

      fireEvent.press(getByTestId('biometric-login-button'));

      await waitFor(() => {
        expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('biometric_auth_cancelled', {
          error: 'user_cancel',
        });
      });
    });
  });

  // ===== Social Authentication =====

  describe('🌐 Social Authentication', () => {
    it('should handle Google Sign-In successfully', async () => {
      const authResponse = createAuthResponse({
        user: { ...createAuthResponse().user, provider: 'google' },
      });
      
      mockAuthService.signInWithGoogle.mockResolvedValue(authResponse);

      const { getByText } = render(createTestComponent());

      fireEvent.press(getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockAuthService.signInWithGoogle).toHaveBeenCalled();
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });

      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('login_success', {
        method: 'google',
        user_id: authResponse.user.id,
        user_role: authResponse.user.role,
      });
    });

    it('should handle Apple Sign-In successfully', async () => {
      const authResponse = createAuthResponse({
        user: { ...createAuthResponse().user, provider: 'apple' },
      });
      
      mockAuthService.signInWithApple.mockResolvedValue(authResponse);

      const { getByText } = render(createTestComponent());

      fireEvent.press(getByText('Continue with Apple'));

      await waitFor(() => {
        expect(mockAuthService.signInWithApple).toHaveBeenCalled();
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });
    });

    it('should handle social authentication cancellation', async () => {
      const socialError = createAuthError('USER_CANCELLED', 'User cancelled the sign-in flow');
      mockAuthService.signInWithGoogle.mockRejectedValue(socialError);

      const { getByText } = render(createTestComponent());

      fireEvent.press(getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('login_cancelled', {
          method: 'google',
          reason: 'USER_CANCELLED',
        });
      });
    });
  });

  // ===== Navigation =====

  describe('🧭 Navigation', () => {
    it('should navigate to Register screen', () => {
      const { getByText } = render(createTestComponent());

      fireEvent.press(getByText("Don't have an account? Sign Up"));

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('navigate_to_register', {
        source: 'login_screen',
      });
    });

    it('should navigate to ForgotPassword screen', () => {
      const { getByText } = render(createTestComponent());

      fireEvent.press(getByText('Forgot Password?'));

      expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('navigate_to_forgot_password', {
        source: 'login_screen',
      });
    });

    it('should handle deep linking with pre-filled email', () => {
      const email = 'worker@datasphereguilds.com';
      const routeWithParams = {
        ...mockRoute,
        params: { email },
      };

      const { getByPlaceholderText } = render(
        createTestComponent({ route: routeWithParams })
      );

      const emailInput = getByPlaceholderText('Email address');
      expect(emailInput.props.value).toBe(email);
    });
  });

  // ===== Accessibility =====

  describe('♿ Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByLabelText } = render(createTestComponent());

      expect(getByLabelText('Email address input')).toBeTruthy();
      expect(getByLabelText('Password input')).toBeTruthy();
      expect(getByLabelText('Sign in button')).toBeTruthy();
      expect(getByLabelText('Sign in with biometrics')).toBeTruthy();
    });

    it('should have proper accessibility roles', () => {
      const { getByTestId } = render(createTestComponent());

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const signInButton = getByTestId('sign-in-button');

      expect(emailInput.props.accessibilityRole).toBe('text');
      expect(passwordInput.props.accessibilityRole).toBe('text');
      expect(signInButton.props.accessibilityRole).toBe('button');
    });

    it('should announce validation errors to screen readers', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      fireEvent.changeText(getByPlaceholderText('Email address'), 'invalid');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        const errorMessage = getByTestId('email-error');
        expect(errorMessage.props.accessibilityLiveRegion).toBe('assertive');
        expect(errorMessage.props.accessibilityRole).toBe('alert');
      });
    });

    it('should support keyboard navigation', () => {
      const { getByTestId } = render(createTestComponent());

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');

      // Test tab order
      expect(emailInput.props.returnKeyType).toBe('next');
      expect(passwordInput.props.returnKeyType).toBe('done');

      // Test focus management
      fireEvent(emailInput, 'submitEditing');
      expect(passwordInput.props.ref.current.focus).toHaveBeenCalled();
    });
  });

  // ===== Security =====

  describe('🛡️ Security', () => {
    it('should mask password input', () => {
      const { getByTestId } = render(createTestComponent());

      const passwordInput = getByTestId('password-input');
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('should implement rate limiting for login attempts', async () => {
      const credentials = createValidCredentials();
      const authError = createAuthError('RATE_LIMITED', 'Too many login attempts');
      
      mockAuthService.login.mockRejectedValue(authError);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      // Simulate multiple failed attempts
      for (let i = 0; i < 5; i++) {
        fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
        fireEvent.press(getByText('Sign In'));

        await waitFor(() => {
          expect(mockAuthService.login).toHaveBeenCalled();
        });
      }

      // Should show rate limit message
      await waitFor(() => {
        expect(getByTestId('rate-limit-error')).toBeTruthy();
        expect(getByText('Too many login attempts. Please try again later.')).toBeTruthy();
      });
    });

    it('should clear sensitive data on component unmount', () => {
      const { unmount } = render(createTestComponent());

      unmount();

      // Verify sensitive data is cleared
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('temp_credentials');
    });
  });

  // ===== Performance =====

  describe('⚡ Performance', () => {
    it('should render within performance budget', async () => {
      const startTime = Date.now();
      
      render(createTestComponent());
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(100); // 100ms budget
    });

    it('should debounce validation calls', async () => {
      const { getByPlaceholderText } = render(createTestComponent());

      const emailInput = getByPlaceholderText('Email address');
      
      // Rapid typing simulation
      fireEvent.changeText(emailInput, 'u');
      fireEvent.changeText(emailInput, 'us');
      fireEvent.changeText(emailInput, 'use');
      fireEvent.changeText(emailInput, 'user');
      fireEvent.changeText(emailInput, 'user@');
      fireEvent.changeText(emailInput, 'user@domain.com');

      // Fast forward timers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Validation should only be called once after debounce
      await waitFor(() => {
        expect(mockAnalyticsService.trackEvent).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle memory cleanup properly', () => {
      const { unmount } = render(createTestComponent());
      
      // Simulate component unmount
      unmount();
      
      // Verify no memory leaks
      expect(mockNavigation.removeListener).toHaveBeenCalled();
    });
  });

  // ===== Error Handling =====

  describe('🚨 Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      const unexpectedError = new Error('Unexpected error occurred');
      mockAuthService.login.mockRejectedValue(unexpectedError);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByTestId('generic-error')).toBeTruthy();
        expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
      });
    });

    it('should provide error recovery options', async () => {
      const networkError = createAuthError('NETWORK_ERROR', 'Network request failed');
      mockAuthService.login.mockRejectedValue(networkError);

      const { getByPlaceholderText, getByText, getByTestId } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(getByTestId('retry-button')).toBeTruthy();
      });

      // Test retry functionality
      mockAuthService.login.mockResolvedValue(createAuthResponse());
      fireEvent.press(getByTestId('retry-button'));

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ===== Platform-Specific Behavior =====

  describe('📱 Platform-Specific Behavior', () => {
    it('should handle iOS-specific features', () => {
      Platform.OS = 'ios';
      
      const { getByTestId } = render(createTestComponent());
      
      // iOS-specific styling
      const container = getByTestId('login-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingTop: 44, // iOS status bar height
          })
        ])
      );
    });

    it('should handle Android-specific features', () => {
      Platform.OS = 'android';
      
      const { getByTestId } = render(createTestComponent());
      
      // Android-specific behavior
      const passwordInput = getByTestId('password-input');
      expect(passwordInput.props.autoCompleteType).toBe('password');
    });

    it('should handle web-specific features', () => {
      Platform.OS = 'web';
      
      const { getByTestId } = render(createTestComponent());
      
      // Web-specific features
      const emailInput = getByTestId('email-input');
      expect(emailInput.props.autoComplete).toBe('email');
    });
  });

  // ===== Integration Tests =====

  describe('🔗 Integration Tests', () => {
    it('should integrate with AuthContext correctly', async () => {
      const authResponse = createAuthResponse();
      mockAuthService.login.mockResolvedValue(authResponse);

      const { getByPlaceholderText, getByText } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        // Verify AuthContext is updated
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', authResponse.token);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', authResponse.refreshToken);
      });
    });

    it('should handle app state changes during authentication', async () => {
      let resolveAuth: (value: AuthResponse) => void;
      const authPromise = new Promise<AuthResponse>((resolve) => {
        resolveAuth = resolve;
      });
      
      mockAuthService.login.mockReturnValue(authPromise);

      const { getByPlaceholderText, getByText } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      // Simulate app going to background
      fireEvent(screen.getByTestId('login-screen'), 'appStateChange', 'background');

      // Resolve authentication
      act(() => {
        resolveAuth!(createAuthResponse());
      });

      await waitFor(() => {
        // Should still complete authentication
        expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
      });
    });
  });

  // ===== Snapshot Tests =====

  describe('📸 Snapshot Tests', () => {
    it('should match snapshot for default state', () => {
      const tree = render(createTestComponent()).toJSON();
      expect(tree).toMatchSnapshot('login-screen-default');
    });

    it('should match snapshot for loading state', async () => {
      mockAuthService.login.mockImplementation(() => new Promise(() => {}));

      const { getByPlaceholderText, getByText, toJSON } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      expect(toJSON()).toMatchSnapshot('login-screen-loading');
    });

    it('should match snapshot for error state', async () => {
      const authError = createAuthError('INVALID_CREDENTIALS', 'Invalid credentials');
      mockAuthService.login.mockRejectedValue(authError);

      const { getByPlaceholderText, getByText, toJSON } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
      fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(toJSON()).toMatchSnapshot('login-screen-error');
      });
    });
  });

  // ===== Custom Matchers Usage =====

  describe('🧪 Custom Matchers', () => {
    it('should use custom accessibility matchers', () => {
      const { getByTestId } = render(createTestComponent());

      const emailInput = getByTestId('email-input');
      expect(emailInput).toBeAccessible();
      expect(emailInput).toHaveAccessibilityLabel('Email address input');
    });

    it('should use custom performance matchers', async () => {
      const { getByPlaceholderText, getByText } = render(
        createTestComponent()
      );

      const credentials = createValidCredentials();
      
      await expect(async () => {
        fireEvent.changeText(getByPlaceholderText('Email address'), credentials.email);
        fireEvent.changeText(getByPlaceholderText('Password'), credentials.password);
        fireEvent.press(getByText('Sign In'));
      }).toCompleteWithin(1000);
    });
  });
});

// Custom matchers are defined in jest/setupAfterEnv.ts
