/**
 * @fileoverview Enterprise Authentication Service - Main Orchestrator
 */

import { EventEmitter } from 'events';
import { 
  UserId, 
  SessionId, 
  AuthMethod, 
  AuthStatus,
  AuthContext,
  SessionData,
  OAuth2TokenResponse,
  UserAuthProfile,
  PBACRequest,
  AccessDecision 
} from './types';

import { JWTManager, createJWTManager } from './jwt-manager';
import { OAuthProvider, createOAuthProvider } from './oauth-provider';
import { MFAService, createMFAService } from './mfa-service';
import { BiometricAuth, createBiometricAuth } from './biometric-auth';
import { SessionManager, createSessionManager } from './session-manager';
import { PBACEngine, createPBACEngine } from './pbac-engine';

interface AuthServiceConfig {
  jwt: any;
  oauth: any;
  mfa: any;
  biometric: any;
  session: any;
  pbac: any;
}

interface AuthResult {
  success: boolean;
  status: AuthStatus;
  sessionId?: SessionId;
  tokens?: OAuth2TokenResponse;
  mfaRequired?: boolean;
  challengeId?: string;
  error?: string;
}

export class AuthenticationService extends EventEmitter {
  private static instance: AuthenticationService;
  private config: AuthServiceConfig;
  private jwtManager: JWTManager;
  private oauthProvider: OAuthProvider;
  private mfaService: MFAService;
  private biometricAuth: BiometricAuth;
  private sessionManager: SessionManager;
  private pbacEngine: PBACEngine;

  private constructor(config: AuthServiceConfig) {
    super();
    this.config = config;
    this.initializeComponents();
  }

  static getInstance(config?: AuthServiceConfig): AuthenticationService {
    if (!AuthenticationService.instance) {
      if (!config) throw new Error('AuthenticationService requires configuration');
      AuthenticationService.instance = new AuthenticationService(config);
    }
    return AuthenticationService.instance;
  }

  async authenticate(
    method: AuthMethod,
    credentials: any,
    context: AuthContext
  ): Promise<AuthResult> {
    try {
      switch (method) {
        case AuthMethod.PASSWORD:
          return await this.authenticatePassword(credentials, context);
        case AuthMethod.OAUTH2_GOOGLE:
        case AuthMethod.OAUTH2_MICROSOFT:
          return await this.authenticateOAuth(method, credentials, context);
        case AuthMethod.BIOMETRIC_FINGERPRINT:
          return await this.authenticateBiometric(credentials, context);
        default:
          return { success: false, status: AuthStatus.FAILED, error: 'Unsupported method' };
      }
    } catch (error) {
      this.emit('auth-error', { method, error, context });
      return { 
        success: false, 
        status: AuthStatus.FAILED, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  async createSession(userId: UserId, context: AuthContext): Promise<SessionData> {
    const session = await this.sessionManager.createSession(userId, context);
    this.emit('session-created', { sessionId: session.sessionId, userId });
    return session;
  }

  async generateTokens(userId: UserId, sessionId: SessionId, authMethods: AuthMethod[]): Promise<OAuth2TokenResponse> {
    return this.jwtManager.generateTokenSet({
      userId,
      sessionId,
      authMethods
    });
  }

  async validateAccess(request: PBACRequest): Promise<AccessDecision> {
    const response = await this.pbacEngine.evaluate(request);
    return response.decision;
  }

  async initiateOAuth(provider: string, options: any = {}): Promise<{ url: string; state: string }> {
    return await this.oauthProvider.generateAuthorizationUrl(provider, options);
  }

  async completeOAuth(code: string, state: string): Promise<AuthResult> {
    try {
      const result = await this.oauthProvider.exchangeCodeForTokens(code, state, state);
      
      // Create session for user
      const mockContext: AuthContext = {
        sessionId: result.session.sessionId,
        userId: result.userProfile.id as UserId,
        device: {} as any,
        network: {} as any,
        request: {} as any,
        metadata: {}
      };

      const session = await this.createSession(result.userProfile.id as UserId, mockContext);
      
      return {
        success: true,
        status: AuthStatus.AUTHENTICATED,
        sessionId: session.sessionId,
        tokens: result.tokens
      };
    } catch (error) {
      return { 
        success: false, 
        status: AuthStatus.FAILED, 
        error: error instanceof Error ? error.message : 'OAuth failed' 
      };
    }
  }

  async initiateMFA(userId: UserId, method: AuthMethod): Promise<string> {
    return await this.mfaService.createChallenge(userId, method);
  }

  async verifyMFA(challengeId: string, code: string): Promise<boolean> {
    return await this.mfaService.verifyChallenge(challengeId, code);
  }

  async enrollBiometric(userId: UserId, deviceId: any, type: any, data: ArrayBuffer): Promise<string> {
    return await this.biometricAuth.enrollBiometric(userId, deviceId, type, data);
  }

  async logout(sessionId: SessionId): Promise<void> {
    await this.sessionManager.terminateSession(sessionId);
    this.emit('user-logout', { sessionId });
  }

  async logoutAllSessions(userId: UserId): Promise<number> {
    const count = await this.sessionManager.terminateUserSessions(userId);
    this.emit('user-logout-all', { userId, sessionCount: count });
    return count;
  }

  private async authenticatePassword(credentials: any, context: AuthContext): Promise<AuthResult> {
    // Simplified password authentication
    const { username, password } = credentials;
    
    // Mock validation
    if (password === 'valid') {
      const session = await this.createSession(username as UserId, context);
      const tokens = await this.generateTokens(username as UserId, session.sessionId, [AuthMethod.PASSWORD]);
      
      return {
        success: true,
        status: AuthStatus.AUTHENTICATED,
        sessionId: session.sessionId,
        tokens
      };
    }
    
    return { success: false, status: AuthStatus.FAILED, error: 'Invalid credentials' };
  }

  private async authenticateOAuth(method: AuthMethod, credentials: any, context: AuthContext): Promise<AuthResult> {
    const { code, state } = credentials;
    return await this.completeOAuth(code, state);
  }

  private async authenticateBiometric(credentials: any, context: AuthContext): Promise<AuthResult> {
    const { userId, biometricData, type } = credentials;
    const verified = await this.biometricAuth.verifyBiometric(userId, type, biometricData);
    
    if (verified) {
      const session = await this.createSession(userId, context);
      const tokens = await this.generateTokens(userId, session.sessionId, [AuthMethod.BIOMETRIC_FINGERPRINT]);
      
      return {
        success: true,
        status: AuthStatus.AUTHENTICATED,
        sessionId: session.sessionId,
        tokens
      };
    }
    
    return { success: false, status: AuthStatus.FAILED, error: 'Biometric verification failed' };
  }

  private initializeComponents(): void {
    this.jwtManager = createJWTManager(this.config.jwt);
    this.oauthProvider = createOAuthProvider(this.config.oauth);
    this.mfaService = createMFAService(this.config.mfa);
    this.biometricAuth = createBiometricAuth(this.config.biometric);
    this.sessionManager = createSessionManager(this.config.session);
    this.pbacEngine = createPBACEngine(this.config.pbac);
  }
}

export const createAuthenticationService = (config: Partial<AuthServiceConfig> = {}): AuthenticationService => {
  const defaultConfig: AuthServiceConfig = {
    jwt: config.jwt || {},
    oauth: config.oauth || {},
    mfa: config.mfa || {},
    biometric: config.biometric || {},
    session: config.session || {},
    pbac: config.pbac || {}
  };

  return AuthenticationService.getInstance(defaultConfig);
};

export default AuthenticationService;