/**
 * AuthService Tests - Enterprise Edition
 * 
 * Comprehensive test suite for authentication services in DataSphere Guilds
 * Covers all authentication flows, security features, and edge cases
 * 
 * @version 4.0.0
 * @author DataSphere Team
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as Apple from 'expo-auth-session/providers/apple';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import * as authService from '@services/authService';
import * as analyticsService from '@services/analyticsService';
import * as notificationService from '@services/notificationService';
import type { 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData,
  AuthError,
  BiometricAuthResult,
  SocialAuthResult,
  RefreshTokenResult,
  MFAChallenge,
  DeviceInfo
} from '@types';

// ===== Mock Dependencies =====

jest.mock('axios');
jest.mock('expo-secure-store');
jest.mock('expo-local-authentication');
jest.mock('expo-auth-session/providers/google');
jest.mock('expo-auth-session/providers/apple');
jest.mock('expo-crypto');
jest.mock('expo-device');
jest.mock('expo-network');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@services/analyticsService');
jest.mock('@services/notificationService');

// Mock implementations
const mockAxios = axios as jest.Mocked<typeof axios>;
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockLocalAuth = LocalAuthentication as jest.Mocked<typeof LocalAuthentication>;
const mockGoogle = Google as jest.Mocked<typeof Google>;
const mockApple = Apple as jest.Mocked<typeof Apple>;
const mockCrypto = Crypto as jest.Mocked<typeof Crypto>;
const mockDevice = Device as jest.Mocked<typeof Device>;
const mockNetwork = Network as jest.Mocked<typeof Network>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockAnalytics = analyticsService as jest.Mocked<typeof analyticsService>;
const mockNotifications = notificationService as jest.Mocked<typeof notificationService>;

// ===== Test Data Factories =====

const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'worker@datasphereguilds.com',
  name: 'John Doe',
  role: 'worker',
  reputation: 4.8,
  completedTasks: 156,
  isVerified: true,
  isActive: true,
  preferences: {
    language: 'en',
    notifications: true,
    biometricAuth: true,
    mfaEnabled: false,
  },
  profile: {
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Experienced data collector',
    skills: ['image-labeling', 'audio-transcription'],
    location: 'New York, USA',
    timezone: 'America/New_York',
  },
  stats: {
    totalEarnings: 2450.75,
    pendingEarnings: 125.50,
    averageRating: 4.8,
    completionRate: 0.96,
    responseTime: 2.5,
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  lastLoginAt: '2024-01-15T10:30:00Z',
  ...overrides,
});

const createAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
  user: createUser(),
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsInJvbGUiOiJ3b3JrZXIiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MTAwMjQwMH0.signature',
  refreshToken: 'refresh_token_abc123',
  expiresIn: 3600,
  tokenType: 'Bearer',
  scope: 'read write',
  ...overrides,
});

const createLoginCredentials = (overrides: Partial<LoginCredentials> = {}): LoginCredentials => ({
  email: 'worker@datasphereguilds.com',
  password: 'DataSphere2024!',
  rememberMe: false,
  deviceId: 'device-123',
  ...overrides,
});

const createRegisterData = (overrides: Partial<RegisterData> = {}): RegisterData => ({
  email: 'newworker@datasphereguilds.com',
  password: 'NewWorker2024!',
  confirmPassword: 'NewWorker2024!',
  name: 'Jane Smith',
  phone: '+1234567890',
  acceptTerms: true,
  acceptPrivacy: true,
  marketingConsent: false,
  referralCode: 'REFER123',
  ...overrides,
});

const createAuthError = (
  type: string, 
  message: string, 
  code: number = 400,
  details?: any
): AuthError => ({
  type,
  message,
  code: `AUTH_${type.toUpperCase()}`,
  statusCode: code,
  details,
  timestamp: new Date().toISOString(),
  requestId: 'req-123',
});

const createDeviceInfo = (): DeviceInfo => ({
  deviceId: 'device-123',
  deviceName: 'iPhone 14 Pro',
  deviceType: Device.DeviceType.PHONE,
  platform: Platform.OS,
  osVersion: '16.0',
  appVersion: '1.0.0',
  buildNumber: '100',
  locale: 'en-US',
  timezone: 'America/New_York',
  screenDimensions: { width: 393, height: 852 },
  isEmulator: false,
  hasNotch: true,
  supportsBiometrics: true,
  biometricTypes: ['FaceID'],
});

// ===== Test Setup =====

describe('AuthService - Enterprise Edition', () => {
  const API_BASE_URL = 'https://api.datasphereguilds.com/v1';
  const TIMEOUT_MS = 10000;

  beforeAll(() => {
    // Set environment variables
    process.env.API_BASE_URL = API_BASE_URL;
    process.env.NODE_ENV = 'test';
    
    // Mock console to reduce noise
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    // Default mock implementations
    mockAxios.create.mockReturnValue(mockAxios);
    mockAxios.defaults = { timeout: TIMEOUT_MS };
    
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    mockSecureStore.setItemAsync.mockResolvedValue();
    mockSecureStore.deleteItemAsync.mockResolvedValue();
    mockSecureStore.isAvailableAsync.mockResolvedValue(true);
    
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
    
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    mockLocalAuth.supportedAuthenticationTypesAsync.mockResolvedValue([
      LocalAuthentication.AuthenticationType.FACE_ID,
      LocalAuthentication.AuthenticationType.FINGERPRINT,
    ]);
    
    mockDevice.deviceType = Device.DeviceType.PHONE;
    mockDevice.isDevice = true;
    mockDevice.osName = Platform.OS;
    mockDevice.osVersion = '16.0';
    
    mockNetwork.getNetworkStateAsync.mockResolvedValue({
      type: Network.NetworkStateType.WIFI,
      isConnected: true,
      isInternetReachable: true,
    });
    
    mockCrypto.randomUUID.mockReturnValue('uuid-123');
    mockCrypto.digestStringAsync.mockResolvedValue('hashed-value');
    
    mockAnalytics.trackEvent.mockResolvedValue();
    mockNotifications.scheduleNotification.mockResolvedValue('notification-id');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ===== Token Management =====

  describe('🔑 Token Management', () => {
    describe('getAccessToken()', () => {
      it('should retrieve access token from secure storage', async () => {
        const token = 'access_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(token);

        const result = await authService.getAccessToken();

        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(result).toBe(token);
      });

      it('should return null when no token exists', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        const result = await authService.getAccessToken();

        expect(result).toBeNull();
      });

      it('should handle SecureStore errors gracefully', async () => {
        mockSecureStore.getItemAsync.mockRejectedValue(new Error('SecureStore error'));

        const result = await authService.getAccessToken();

        expect(result).toBeNull();
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('token_retrieval_error', {
          error: 'SecureStore error',
          tokenType: 'access',
        });
      });
    });

    describe('getRefreshToken()', () => {
      it('should retrieve refresh token from secure storage', async () => {
        const token = 'refresh_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(token);

        const result = await authService.getRefreshToken();

        expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        expect(result).toBe(token);
      });

      it('should return null when no token exists', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        const result = await authService.getRefreshToken();

        expect(result).toBeNull();
      });
    });

    describe('storeTokens()', () => {
      it('should store tokens in correct order (refresh first)', async () => {
        const tokens = {
          accessToken: 'access_123',
          refreshToken: 'refresh_123',
        };

        await authService.storeTokens(tokens);

        expect(mockSecureStore.setItemAsync).toHaveBeenCalledTimes(2);
        expect(mockSecureStore.setItemAsync).toHaveBeenNthCalledWith(
          1,
          'auth_refresh_token',
          tokens.refreshToken
        );
        expect(mockSecureStore.setItemAsync).toHaveBeenNthCalledWith(
          2,
          'auth_access_token',
          tokens.accessToken
        );
      });

      it('should handle storage errors and rollback', async () => {
        const tokens = {
          accessToken: 'access_123',
          refreshToken: 'refresh_123',
        };

        mockSecureStore.setItemAsync
          .mockResolvedValueOnce() // refresh token succeeds
          .mockRejectedValueOnce(new Error('Storage full')); // access token fails

        await expect(authService.storeTokens(tokens)).rejects.toThrow('Storage full');

        // Should rollback refresh token
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
      });
    });

    describe('clearTokens()', () => {
      it('should clear both tokens even if one fails', async () => {
        mockSecureStore.deleteItemAsync
          .mockResolvedValueOnce() // access token succeeds
          .mockRejectedValueOnce(new Error('Delete error')); // refresh token fails

        await authService.clearTokens();

        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('token_clear_error', {
          error: 'Delete error',
        });
      });

      it('should clear associated user data', async () => {
        await authService.clearTokens();

        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('device_id');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('last_login');
      });
    });

    describe('isTokenValid()', () => {
      it('should validate token format and expiration', async () => {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImV4cCI6OTk5OTk5OTk5OX0.signature';
        
        const isValid = await authService.isTokenValid(validToken);

        expect(isValid).toBe(true);
      });

      it('should return false for expired tokens', async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImV4cCI6MTAwMDAwMDAwMH0.signature';
        
        const isValid = await authService.isTokenValid(expiredToken);

        expect(isValid).toBe(false);
      });

      it('should return false for malformed tokens', async () => {
        const malformedToken = 'invalid.token.format';
        
        const isValid = await authService.isTokenValid(malformedToken);

        expect(isValid).toBe(false);
      });
    });
  });

  // ===== Authentication Flow =====

  describe('🔐 Authentication Flow', () => {
    describe('login()', () => {
      const credentials = createLoginCredentials();
      const authResponse = createAuthResponse();

      it('should successfully login with valid credentials', async () => {
        mockAxios.post.mockResolvedValue({ 
          data: authResponse,
          status: 200,
          statusText: 'OK',
        } as AxiosResponse);

        const result = await authService.login(credentials);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', {
          email: credentials.email,
          password: credentials.password,
          deviceId: credentials.deviceId,
          rememberMe: credentials.rememberMe,
          deviceInfo: expect.objectContaining({
            platform: Platform.OS,
            deviceType: Device.DeviceType.PHONE,
          }),
        });

        expect(result).toEqual(authResponse);
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('login_success', {
          method: 'email',
          userId: authResponse.user.id,
          userRole: authResponse.user.role,
        });
      });

      it('should handle invalid credentials error', async () => {
        const authError = createAuthError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        mockAxios.post.mockRejectedValue({
          response: { status: 401, data: authError },
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('login_error', {
          error: 'INVALID_CREDENTIALS',
          method: 'email',
        });
      });

      it('should handle account locked error', async () => {
        const authError = createAuthError('ACCOUNT_LOCKED', 'Account locked due to too many failed attempts', 423);
        mockAxios.post.mockRejectedValue({
          response: { status: 423, data: authError },
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Account locked due to too many failed attempts');
      });

      it('should handle network errors', async () => {
        mockNetwork.getNetworkStateAsync.mockResolvedValue({
          type: Network.NetworkStateType.NONE,
          isConnected: false,
          isInternetReachable: false,
        });

        mockAxios.post.mockRejectedValue({
          code: 'NETWORK_ERROR',
          message: 'Network Error',
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Network Error');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('login_network_error', {
          networkType: Network.NetworkStateType.NONE,
          isConnected: false,
        });
      });

      it('should implement rate limiting', async () => {
        // Simulate multiple rapid login attempts
        const promises = Array.from({ length: 5 }, () => 
          authService.login(credentials)
        );

        mockAxios.post.mockRejectedValue({
          response: { status: 429, data: createAuthError('RATE_LIMITED', 'Too many attempts', 429) },
          isAxiosError: true,
        });

        await expect(Promise.all(promises)).rejects.toThrow('Too many attempts');
      });

      it('should store device information on successful login', async () => {
        mockAxios.post.mockResolvedValue({ 
          data: authResponse,
          status: 200,
        } as AxiosResponse);

        await authService.login(credentials);

        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          'device_info',
          expect.stringContaining('device-123')
        );
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
          'last_login',
          expect.any(String)
        );
      });
    });

    describe('register()', () => {
      const registerData = createRegisterData();
      const authResponse = createAuthResponse({
        user: createUser({ email: registerData.email, name: registerData.name }),
      });

      it('should successfully register new user', async () => {
        mockAxios.post.mockResolvedValue({ 
          data: authResponse,
          status: 201,
        } as AxiosResponse);

        const result = await authService.register(registerData);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/register', {
          email: registerData.email,
          password: registerData.password,
          name: registerData.name,
          phone: registerData.phone,
          acceptTerms: registerData.acceptTerms,
          acceptPrivacy: registerData.acceptPrivacy,
          marketingConsent: registerData.marketingConsent,
          referralCode: registerData.referralCode,
          deviceInfo: expect.any(Object),
        });

        expect(result).toEqual(authResponse);
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('registration_success', {
          method: 'email',
          userId: authResponse.user.id,
          hasReferral: !!registerData.referralCode,
        });
      });

      it('should handle email already exists error', async () => {
        const authError = createAuthError('EMAIL_EXISTS', 'Email already registered', 409);
        mockAxios.post.mockRejectedValue({
          response: { status: 409, data: authError },
          isAxiosError: true,
        });

        await expect(authService.register(registerData)).rejects.toThrow('Email already registered');
      });

      it('should handle validation errors', async () => {
        const validationError = createAuthError('VALIDATION_ERROR', 'Invalid data', 422, {
          fields: {
            email: 'Invalid email format',
            password: 'Password too weak',
          },
        });

        mockAxios.post.mockRejectedValue({
          response: { status: 422, data: validationError },
          isAxiosError: true,
        });

        await expect(authService.register(registerData)).rejects.toThrow('Invalid data');
      });

      it('should validate password confirmation', async () => {
        const invalidData = { ...registerData, confirmPassword: 'different' };

        await expect(authService.register(invalidData)).rejects.toThrow('Passwords do not match');
      });

      it('should validate terms acceptance', async () => {
        const invalidData = { ...registerData, acceptTerms: false };

        await expect(authService.register(invalidData)).rejects.toThrow('Terms and conditions must be accepted');
      });

      it('should send welcome notification on successful registration', async () => {
        mockAxios.post.mockResolvedValue({ 
          data: authResponse,
          status: 201,
        } as AxiosResponse);

        await authService.register(registerData);

        expect(mockNotifications.scheduleNotification).toHaveBeenCalledWith({
          title: 'Welcome to DataSphere Guilds!',
          body: 'Your account has been created successfully. Start earning by completing tasks!',
          data: { type: 'welcome', userId: authResponse.user.id },
        });
      });
    });

    describe('logout()', () => {
      it('should successfully logout and clear all data', async () => {
        const refreshToken = 'refresh_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockResolvedValue({ status: 200 } as AxiosResponse);

        await authService.logout();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/logout', {
          refreshToken,
        });

        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('logout_success', {
          method: 'manual',
        });
      });

      it('should clear local data even if server logout fails', async () => {
        const refreshToken = 'refresh_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockRejectedValue(new Error('Server error'));

        await authService.logout();

        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
      });

      it('should handle missing refresh token gracefully', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        await authService.logout();

        expect(mockAxios.post).not.toHaveBeenCalled();
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
      });
    });
  });

  // ===== Token Refresh =====

  describe('🔄 Token Refresh', () => {
    describe('refreshToken()', () => {
      const refreshToken = 'refresh_token_123';
      const newTokens = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      it('should successfully refresh tokens', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockResolvedValue({ 
          data: newTokens,
          status: 200,
        } as AxiosResponse);

        const result = await authService.refreshToken();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/refresh', {
          refreshToken,
          deviceId: expect.any(String),
        });

        expect(result).toEqual(newTokens);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_refresh_token', newTokens.refreshToken);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('auth_access_token', newTokens.accessToken);
      });

      it('should handle invalid refresh token', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockRejectedValue({
          response: { status: 401, data: createAuthError('INVALID_REFRESH_TOKEN', 'Refresh token expired', 401) },
          isAxiosError: true,
        });

        await expect(authService.refreshToken()).rejects.toThrow('Refresh token expired');
        
        // Should clear tokens on invalid refresh token
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
      });

      it('should handle missing refresh token', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
      });

      it('should implement automatic retry with exponential backoff', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post
          .mockRejectedValueOnce({ code: 'NETWORK_ERROR' })
          .mockRejectedValueOnce({ code: 'NETWORK_ERROR' })
          .mockResolvedValueOnce({ data: newTokens, status: 200 });

        const result = await authService.refreshToken();

        expect(mockAxios.post).toHaveBeenCalledTimes(3);
        expect(result).toEqual(newTokens);
      });
    });

    describe('autoRefreshToken()', () => {
      it('should automatically refresh token before expiration', async () => {
        const expiringToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImV4cCI6MTY0MTAwMjQwMH0.signature';
        mockSecureStore.getItemAsync.mockResolvedValue(expiringToken);

        // Mock Date.now to simulate token near expiration
        const mockNow = 1641002100000; // 5 minutes before expiration
        jest.spyOn(Date, 'now').mockReturnValue(mockNow);

        const refreshSpy = jest.spyOn(authService, 'refreshToken').mockResolvedValue({
          accessToken: 'new_token',
          refreshToken: 'new_refresh',
        });

        await authService.autoRefreshToken();

        expect(refreshSpy).toHaveBeenCalled();
      });

      it('should not refresh token if still valid', async () => {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImV4cCI6OTk5OTk5OTk5OX0.signature';
        mockSecureStore.getItemAsync.mockResolvedValue(validToken);

        const refreshSpy = jest.spyOn(authService, 'refreshToken');

        await authService.autoRefreshToken();

        expect(refreshSpy).not.toHaveBeenCalled();
      });
    });
  });

  // ===== Biometric Authentication =====

  describe('🔒 Biometric Authentication', () => {
    describe('isBiometricAvailable()', () => {
      it('should return true when biometrics are available', async () => {
        mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
        mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);

        const result = await authService.isBiometricAvailable();

        expect(result).toBe(true);
        expect(mockLocalAuth.hasHardwareAsync).toHaveBeenCalled();
        expect(mockLocalAuth.isEnrolledAsync).toHaveBeenCalled();
      });

      it('should return false when no hardware available', async () => {
        mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);

        const result = await authService.isBiometricAvailable();

        expect(result).toBe(false);
      });

      it('should return false when no biometrics enrolled', async () => {
        mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
        mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);

        const result = await authService.isBiometricAvailable();

        expect(result).toBe(false);
      });
    });

    describe('enableBiometricAuth()', () => {
      const credentials = createLoginCredentials();

      it('should enable biometric authentication', async () => {
        mockLocalAuth.authenticateAsync.mockResolvedValue({
          success: true,
          error: undefined,
          warning: undefined,
        });

        await authService.enableBiometricAuth(credentials);

        expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith({
          promptMessage: 'Enable biometric authentication for DataSphere Guilds',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Password',
          requireConfirmation: true,
        });

        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('biometric_email', credentials.email);
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('biometric_password_hash', expect.any(String));
      });

      it('should handle biometric authentication failure', async () => {
        mockLocalAuth.authenticateAsync.mockResolvedValue({
          success: false,
          error: 'user_cancel',
          warning: undefined,
        });

        await expect(authService.enableBiometricAuth(credentials)).rejects.toThrow('Biometric authentication cancelled');
      });

      it('should hash password before storing', async () => {
        mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });
        mockCrypto.digestStringAsync.mockResolvedValue('hashed_password');

        await authService.enableBiometricAuth(credentials);

        expect(mockCrypto.digestStringAsync).toHaveBeenCalledWith(
          Crypto.CryptoDigestAlgorithm.SHA256,
          credentials.password
        );
        expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('biometric_password_hash', 'hashed_password');
      });
    });

    describe('authenticateWithBiometrics()', () => {
      it('should authenticate with biometrics successfully', async () => {
        const storedEmail = 'worker@datasphereguilds.com';
        const storedPasswordHash = 'hashed_password';
        const authResponse = createAuthResponse();

        mockSecureStore.getItemAsync
          .mockResolvedValueOnce(storedEmail)
          .mockResolvedValueOnce(storedPasswordHash);

        mockLocalAuth.authenticateAsync.mockResolvedValue({
          success: true,
          error: undefined,
          warning: undefined,
        });

        mockAxios.post.mockResolvedValue({ data: authResponse, status: 200 });

        const result = await authService.authenticateWithBiometrics();

        expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith({
          promptMessage: 'Sign in to DataSphere Guilds',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Password',
        });

        expect(result).toEqual(authResponse);
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('biometric_login_success', {
          biometricType: expect.any(String),
        });
      });

      it('should handle no stored credentials', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue(null);

        await expect(authService.authenticateWithBiometrics()).rejects.toThrow('No biometric credentials stored');
      });

      it('should handle biometric authentication failure', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue('email@test.com');
        mockLocalAuth.authenticateAsync.mockResolvedValue({
          success: false,
          error: 'authentication_failed',
          warning: undefined,
        });

        await expect(authService.authenticateWithBiometrics()).rejects.toThrow('Biometric authentication failed');
      });
    });

    describe('disableBiometricAuth()', () => {
      it('should disable biometric authentication', async () => {
        await authService.disableBiometricAuth();

        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('biometric_email');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('biometric_password_hash');
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('biometric_auth_disabled');
      });
    });
  });

  // ===== Social Authentication =====

  describe('🌐 Social Authentication', () => {
    describe('signInWithGoogle()', () => {
      const googleResponse = {
        type: 'success',
        accessToken: 'google_access_token',
        idToken: 'google_id_token',
        user: {
          id: 'google_user_123',
          email: 'user@gmail.com',
          name: 'Google User',
          picture: 'https://lh3.googleusercontent.com/photo.jpg',
        },
      };

      it('should authenticate with Google successfully', async () => {
        const authResponse = createAuthResponse({
          user: createUser({ email: googleResponse.user.email, name: googleResponse.user.name }),
        });

        mockGoogle.useAuthRequest.mockReturnValue([
          null,
          { type: 'success', ...googleResponse },
          jest.fn().mockResolvedValue(googleResponse),
        ]);

        mockAxios.post.mockResolvedValue({ data: authResponse, status: 200 });

        const result = await authService.signInWithGoogle();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/social/google', {
          accessToken: googleResponse.accessToken,
          idToken: googleResponse.idToken,
          provider: 'google',
          deviceInfo: expect.any(Object),
        });

        expect(result).toEqual(authResponse);
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('social_login_success', {
          provider: 'google',
          userId: authResponse.user.id,
        });
      });

      it('should handle Google authentication cancellation', async () => {
        mockGoogle.useAuthRequest.mockReturnValue([
          null,
          { type: 'cancel' },
          jest.fn(),
        ]);

        await expect(authService.signInWithGoogle()).rejects.toThrow('Google authentication cancelled');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('social_login_cancelled', {
          provider: 'google',
        });
      });

      it('should handle Google authentication error', async () => {
        mockGoogle.useAuthRequest.mockReturnValue([
          { message: 'Google auth error' },
          null,
          jest.fn(),
        ]);

        await expect(authService.signInWithGoogle()).rejects.toThrow('Google auth error');
      });

      it('should handle server-side Google auth error', async () => {
        mockGoogle.useAuthRequest.mockReturnValue([
          null,
          { type: 'success', ...googleResponse },
          jest.fn().mockResolvedValue(googleResponse),
        ]);

        mockAxios.post.mockRejectedValue({
          response: { status: 400, data: createAuthError('INVALID_GOOGLE_TOKEN', 'Invalid Google token', 400) },
          isAxiosError: true,
        });

        await expect(authService.signInWithGoogle()).rejects.toThrow('Invalid Google token');
      });
    });

    describe('signInWithApple()', () => {
      const appleResponse = {
        type: 'success',
        identityToken: 'apple_identity_token',
        authorizationCode: 'apple_auth_code',
        user: {
          email: 'user@privaterelay.appleid.com',
          name: { firstName: 'Apple', lastName: 'User' },
        },
      };

      it('should authenticate with Apple successfully', async () => {
        const authResponse = createAuthResponse({
          user: createUser({ 
            email: appleResponse.user.email, 
            name: `${appleResponse.user.name.firstName} ${appleResponse.user.name.lastName}` 
          }),
        });

        mockApple.useAuthRequest.mockReturnValue([
          null,
          { type: 'success', ...appleResponse },
          jest.fn().mockResolvedValue(appleResponse),
        ]);

        mockAxios.post.mockResolvedValue({ data: authResponse, status: 200 });

        const result = await authService.signInWithApple();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/social/apple', {
          identityToken: appleResponse.identityToken,
          authorizationCode: appleResponse.authorizationCode,
          provider: 'apple',
          deviceInfo: expect.any(Object),
        });

        expect(result).toEqual(authResponse);
      });

      it('should handle Apple authentication cancellation', async () => {
        mockApple.useAuthRequest.mockReturnValue([
          null,
          { type: 'cancel' },
          jest.fn(),
        ]);

        await expect(authService.signInWithApple()).rejects.toThrow('Apple authentication cancelled');
      });

      it('should only be available on iOS', async () => {
        Platform.OS = 'android';

        await expect(authService.signInWithApple()).rejects.toThrow('Apple Sign-In is only available on iOS');
      });
    });
  });

  // ===== Multi-Factor Authentication =====

  describe('🛡️ Multi-Factor Authentication', () => {
    describe('enableMFA()', () => {
      it('should enable MFA and return QR code', async () => {
        const mfaResponse = {
          secret: 'JBSWY3DPEHPK3PXP',
          qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
          backupCodes: ['123456', '789012', '345678'],
        };

        mockAxios.post.mockResolvedValue({ data: mfaResponse, status: 200 });

        const result = await authService.enableMFA();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/mfa/enable');
        expect(result).toEqual(mfaResponse);
      });

      it('should handle MFA already enabled error', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 409, data: createAuthError('MFA_ALREADY_ENABLED', 'MFA already enabled', 409) },
          isAxiosError: true,
        });

        await expect(authService.enableMFA()).rejects.toThrow('MFA already enabled');
      });
    });

    describe('verifyMFA()', () => {
      const token = '123456';

      it('should verify MFA token successfully', async () => {
        mockAxios.post.mockResolvedValue({ data: { verified: true }, status: 200 });

        const result = await authService.verifyMFA(token);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/mfa/verify', { token });
        expect(result).toBe(true);
      });

      it('should handle invalid MFA token', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 400, data: createAuthError('INVALID_MFA_TOKEN', 'Invalid MFA token', 400) },
          isAxiosError: true,
        });

        await expect(authService.verifyMFA(token)).rejects.toThrow('Invalid MFA token');
      });

      it('should handle expired MFA token', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 410, data: createAuthError('MFA_TOKEN_EXPIRED', 'MFA token expired', 410) },
          isAxiosError: true,
        });

        await expect(authService.verifyMFA(token)).rejects.toThrow('MFA token expired');
      });
    });

    describe('disableMFA()', () => {
      const token = '123456';

      it('should disable MFA successfully', async () => {
        mockAxios.post.mockResolvedValue({ data: { disabled: true }, status: 200 });

        await authService.disableMFA(token);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/mfa/disable', { token });
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('mfa_disabled');
      });
    });

    describe('generateBackupCodes()', () => {
      it('should generate new backup codes', async () => {
        const backupCodes = ['123456', '789012', '345678', '901234', '567890'];
        mockAxios.post.mockResolvedValue({ data: { backupCodes }, status: 200 });

        const result = await authService.generateBackupCodes();

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/mfa/backup-codes');
        expect(result).toEqual(backupCodes);
      });
    });
  });

  // ===== Device Management =====

  describe('📱 Device Management', () => {
    describe('registerDevice()', () => {
      const deviceInfo = createDeviceInfo();

      it('should register device successfully', async () => {
        const deviceResponse = {
          deviceId: deviceInfo.deviceId,
          registered: true,
          trustedDevice: false,
        };

        mockAxios.post.mockResolvedValue({ data: deviceResponse, status: 201 });

        const result = await authService.registerDevice(deviceInfo);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/devices', deviceInfo);
        expect(result).toEqual(deviceResponse);
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('device_id', deviceInfo.deviceId);
      });

      it('should handle device already registered', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 409, data: createAuthError('DEVICE_ALREADY_REGISTERED', 'Device already registered', 409) },
          isAxiosError: true,
        });

        await expect(authService.registerDevice(deviceInfo)).rejects.toThrow('Device already registered');
      });
    });

    describe('getDevices()', () => {
      it('should retrieve user devices', async () => {
        const devices = [
          { id: 'device-1', name: 'iPhone 14 Pro', lastUsed: '2024-01-15T10:30:00Z', trusted: true },
          { id: 'device-2', name: 'MacBook Pro', lastUsed: '2024-01-14T15:20:00Z', trusted: false },
        ];

        mockAxios.get.mockResolvedValue({ data: { devices }, status: 200 });

        const result = await authService.getDevices();

        expect(mockAxios.get).toHaveBeenCalledWith('/auth/devices');
        expect(result).toEqual(devices);
      });
    });

    describe('removeDevice()', () => {
      const deviceId = 'device-123';

      it('should remove device successfully', async () => {
        mockAxios.delete.mockResolvedValue({ status: 204 });

        await authService.removeDevice(deviceId);

        expect(mockAxios.delete).toHaveBeenCalledWith(`/auth/devices/${deviceId}`);
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('device_removed', { deviceId });
      });

      it('should handle device not found', async () => {
        mockAxios.delete.mockRejectedValue({
          response: { status: 404, data: createAuthError('DEVICE_NOT_FOUND', 'Device not found', 404) },
          isAxiosError: true,
        });

        await expect(authService.removeDevice(deviceId)).rejects.toThrow('Device not found');
      });
    });

    describe('trustDevice()', () => {
      const deviceId = 'device-123';

      it('should trust device successfully', async () => {
        mockAxios.put.mockResolvedValue({ data: { trusted: true }, status: 200 });

        const result = await authService.trustDevice(deviceId);

        expect(mockAxios.put).toHaveBeenCalledWith(`/auth/devices/${deviceId}/trust`);
        expect(result).toBe(true);
      });
    });
  });

  // ===== Password Management =====

  describe('🔐 Password Management', () => {
    describe('changePassword()', () => {
      const passwordData = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
        confirmPassword: 'NewPassword456!',
      };

      it('should change password successfully', async () => {
        mockAxios.put.mockResolvedValue({ data: { changed: true }, status: 200 });

        await authService.changePassword(passwordData);

        expect(mockAxios.put).toHaveBeenCalledWith('/auth/password/change', {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });

        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('password_changed');
      });

      it('should validate password confirmation', async () => {
        const invalidData = { ...passwordData, confirmPassword: 'different' };

        await expect(authService.changePassword(invalidData)).rejects.toThrow('Passwords do not match');
      });

      it('should handle incorrect current password', async () => {
        mockAxios.put.mockRejectedValue({
          response: { status: 400, data: createAuthError('INCORRECT_PASSWORD', 'Current password is incorrect', 400) },
          isAxiosError: true,
        });

        await expect(authService.changePassword(passwordData)).rejects.toThrow('Current password is incorrect');
      });
    });

    describe('requestPasswordReset()', () => {
      const email = 'worker@datasphereguilds.com';

      it('should request password reset successfully', async () => {
        mockAxios.post.mockResolvedValue({ data: { sent: true }, status: 200 });

        await authService.requestPasswordReset(email);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/password/reset-request', { email });
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('password_reset_requested', { email });
      });

      it('should handle email not found', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 404, data: createAuthError('EMAIL_NOT_FOUND', 'Email not found', 404) },
          isAxiosError: true,
        });

        await expect(authService.requestPasswordReset(email)).rejects.toThrow('Email not found');
      });
    });

    describe('resetPassword()', () => {
      const resetData = {
        token: 'reset_token_123',
        password: 'NewPassword789!',
        confirmPassword: 'NewPassword789!',
      };

      it('should reset password successfully', async () => {
        mockAxios.post.mockResolvedValue({ data: { reset: true }, status: 200 });

        await authService.resetPassword(resetData);

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/password/reset', {
          token: resetData.token,
          password: resetData.password,
        });

        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('password_reset_completed');
      });

      it('should validate password confirmation', async () => {
        const invalidData = { ...resetData, confirmPassword: 'different' };

        await expect(authService.resetPassword(invalidData)).rejects.toThrow('Passwords do not match');
      });

      it('should handle invalid reset token', async () => {
        mockAxios.post.mockRejectedValue({
          response: { status: 400, data: createAuthError('INVALID_RESET_TOKEN', 'Invalid or expired reset token', 400) },
          isAxiosError: true,
        });

        await expect(authService.resetPassword(resetData)).rejects.toThrow('Invalid or expired reset token');
      });
    });
  });

  // ===== Performance & Security =====

  describe('⚡ Performance & Security', () => {
    describe('Performance Tests', () => {
      it('should complete login within performance budget', async () => {
        const credentials = createLoginCredentials();
        const authResponse = createAuthResponse();
        
        mockAxios.post.mockResolvedValue({ data: authResponse, status: 200 });

        const startTime = Date.now();
        await authService.login(credentials);
        const duration = Date.now() - startTime;

        expect(duration).toBeLessThan(2000); // 2 second budget
      });

      it('should handle concurrent login attempts safely', async () => {
        const credentials = createLoginCredentials();
        const authResponse = createAuthResponse();
        
        mockAxios.post.mockResolvedValue({ data: authResponse, status: 200 });

        const promises = Array.from({ length: 10 }, () => authService.login(credentials));
        
        await expect(Promise.all(promises)).resolves.toBeDefined();
        expect(mockAxios.post).toHaveBeenCalledTimes(10);
      });

      it('should implement request deduplication', async () => {
        const credentials = createLoginCredentials();
        const authResponse = createAuthResponse();
        
        mockAxios.post.mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve({ data: authResponse, status: 200 }), 100))
        );

        // Make multiple identical requests simultaneously
        const promises = Array.from({ length: 5 }, () => authService.login(credentials));
        
        await Promise.all(promises);
        
        // Should only make one actual request due to deduplication
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
      });
    });

    describe('Security Tests', () => {
      it('should implement rate limiting for failed login attempts', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue({
          response: { status: 401, data: createAuthError('INVALID_CREDENTIALS', 'Invalid credentials', 401) },
          isAxiosError: true,
        });

        // Attempt multiple failed logins
        for (let i = 0; i < 5; i++) {
          try {
            await authService.login(credentials);
          } catch (error) {
            // Expected to fail
          }
        }

        // Should track failed attempts
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('login_error', expect.any(Object));
      });

      it('should sanitize sensitive data in logs', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue(new Error('Network error'));

        try {
          await authService.login(credentials);
        } catch (error) {
          // Verify password is not logged
          expect(mockAnalytics.trackEvent).not.toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({ password: credentials.password })
          );
        }
      });

      it('should validate input parameters', async () => {
        await expect(authService.login({ email: '', password: '' } as any)).rejects.toThrow('Email is required');
        await expect(authService.login({ email: 'invalid', password: 'weak' } as any)).rejects.toThrow('Invalid email format');
      });

      it('should implement CSRF protection', async () => {
        const credentials = createLoginCredentials();
        mockAxios.post.mockResolvedValue({ data: createAuthResponse(), status: 200 });

        await authService.login(credentials);

        expect(mockAxios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            _csrf: expect.any(String),
          })
        );
      });
    });

    describe('Memory Management', () => {
      it('should clean up resources on logout', async () => {
        const refreshToken = 'refresh_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockResolvedValue({ status: 200 });

        await authService.logout();

        // Verify all sensitive data is cleared
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_access_token');
        expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_refresh_token');
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
      });

      it('should not leak sensitive data in error messages', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue({
          response: { 
            status: 500, 
            data: { error: 'Internal server error', debug: { password: credentials.password } }
          },
          isAxiosError: true,
        });

        try {
          await authService.login(credentials);
        } catch (error) {
          expect(error.message).not.toContain(credentials.password);
        }
      });
    });
  });

  // ===== Error Handling & Edge Cases =====

  describe('🌍 Error Handling & Edge Cases', () => {
    describe('Network Error Handling', () => {
      it('should handle network timeout', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue({
          code: 'ECONNABORTED',
          message: 'timeout of 10000ms exceeded',
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Request timeout');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('network_timeout', {
          endpoint: '/auth/login',
          timeout: 10000,
        });
      });

      it('should handle DNS resolution failure', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue({
          code: 'ENOTFOUND',
          message: 'getaddrinfo ENOTFOUND api.datasphereguilds.com',
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Network connection failed');
      });

      it('should implement exponential backoff for retries', async () => {
        const credentials = createLoginCredentials();
        const authResponse = createAuthResponse();
        
        mockAxios.post
          .mockRejectedValueOnce({ code: 'ECONNRESET' })
          .mockRejectedValueOnce({ code: 'ECONNRESET' })
          .mockResolvedValueOnce({ data: authResponse, status: 200 });

        const result = await authService.login(credentials);

        expect(mockAxios.post).toHaveBeenCalledTimes(3);
        expect(result).toEqual(authResponse);
      });
    });

    describe('Platform-Specific Error Handling', () => {
      it('should handle iOS keychain errors', async () => {
        Platform.OS = 'ios';
        
        mockSecureStore.setItemAsync.mockRejectedValue({
          code: 'UserCancel',
          message: 'User canceled the operation',
        });

        const tokens = { accessToken: 'access', refreshToken: 'refresh' };
        
        await expect(authService.storeTokens(tokens)).rejects.toThrow('User canceled the operation');
      });

      it('should handle Android keystore errors', async () => {
        Platform.OS = 'android';
        
        mockSecureStore.setItemAsync.mockRejectedValue({
          code: 'KeystoreAccessError',
          message: 'Could not access Android keystore',
        });

        const tokens = { accessToken: 'access', refreshToken: 'refresh' };
        
        await expect(authService.storeTokens(tokens)).rejects.toThrow('Could not access Android keystore');
      });

      it('should handle web storage quota exceeded', async () => {
        Platform.OS = 'web';
        
        mockAsyncStorage.setItem.mockRejectedValue({
          name: 'QuotaExceededError',
          message: 'Storage quota exceeded',
        });

        await expect(authService.cacheUserData(createUser())).rejects.toThrow('Storage quota exceeded');
      });
    });

    describe('Data Corruption Handling', () => {
      it('should handle corrupted token data', async () => {
        mockSecureStore.getItemAsync.mockResolvedValue('corrupted_token_data');

        const result = await authService.getAccessToken();

        expect(result).toBeNull();
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('token_corruption_detected', {
          tokenType: 'access',
        });
      });

      it('should handle invalid JSON in stored user data', async () => {
        mockAsyncStorage.getItem.mockResolvedValue('invalid_json{');

        const result = await authService.getCachedUser();

        expect(result).toBeNull();
        expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user_data');
      });
    });

    describe('Concurrent Operation Handling', () => {
      it('should handle concurrent token refresh attempts', async () => {
        const refreshToken = 'refresh_token_123';
        const newTokens = { accessToken: 'new_access', refreshToken: 'new_refresh' };
        
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockResolvedValue({ data: newTokens, status: 200 });

        // Simulate concurrent refresh attempts
        const promises = Array.from({ length: 3 }, () => authService.refreshToken());
        
        const results = await Promise.all(promises);
        
        // Should only make one actual request
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        results.forEach(result => expect(result).toEqual(newTokens));
      });

      it('should handle concurrent logout attempts', async () => {
        const refreshToken = 'refresh_token_123';
        mockSecureStore.getItemAsync.mockResolvedValue(refreshToken);
        mockAxios.post.mockResolvedValue({ status: 200 });

        // Simulate concurrent logout attempts
        const promises = Array.from({ length: 3 }, () => authService.logout());
        
        await Promise.all(promises);
        
        // Should only make one actual request
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
      });
    });

    describe('Edge Case Scenarios', () => {
      it('should handle empty server responses', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockResolvedValue({ data: null, status: 200 });

        await expect(authService.login(credentials)).rejects.toThrow('Invalid server response');
      });

      it('should handle malformed server responses', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockResolvedValue({ data: 'not_json', status: 200 });

        await expect(authService.login(credentials)).rejects.toThrow('Invalid server response format');
      });

      it('should handle device clock skew', async () => {
        const credentials = createLoginCredentials();
        
        mockAxios.post.mockRejectedValue({
          response: { 
            status: 400, 
            data: createAuthError('CLOCK_SKEW', 'Device clock is out of sync', 400),
            headers: { 'server-time': '2024-01-15T12:00:00Z' }
          },
          isAxiosError: true,
        });

        await expect(authService.login(credentials)).rejects.toThrow('Device clock is out of sync');
        
        expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('clock_skew_detected', {
          serverTime: '2024-01-15T12:00:00Z',
          clientTime: expect.any(String),
        });
      });
    });
  });
});
