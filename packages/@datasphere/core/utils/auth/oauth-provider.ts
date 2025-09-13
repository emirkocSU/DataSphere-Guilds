/**
 * @fileoverview Enterprise OAuth2/OIDC Provider - Multi-Provider Integration
 * 
 * Comprehensive OAuth2 and OpenID Connect provider integration system supporting
 * multiple identity providers (Google, Microsoft, GitHub, Apple, Facebook, etc.)
 * with enterprise features including provider discovery, token exchange, and
 * user profile mapping for unicorn-level authentication infrastructure.
 */

import { EventEmitter } from 'events';
import { randomBytes, createHash } from 'crypto';
import {
  OAuth2GrantType,
  OAuth2TokenResponse,
  AuthMethod,
  UserId,
  SessionId,
  TokenId,
  ISOTimestamp,
  AuthContext,
  UserAuthProfile,
  AuthConfig
} from './types';

interface OAuthProviderConfig {
  enabled: boolean;
  providers: {
    google?: GoogleConfig;
    microsoft?: MicrosoftConfig;
    github?: GitHubConfig;
    apple?: AppleConfig;
    facebook?: FacebookConfig;
    custom?: CustomProviderConfig[];
  };
  security: {
    enablePKCE: boolean;
    enableState: boolean;
    enableNonce: boolean;
    encryptTokens: boolean;
    validateIssuer: boolean;
    clockSkewSeconds: number;
  };
  tokenExchange: {
    enabled: boolean;
    allowedAudiences: string[];
    defaultTTL: number;
  };
  userMapping: {
    autoCreateUsers: boolean;
    defaultRoles: string[];
    attributeMapping: Record<string, string>;
  };
}

interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  hostedDomain?: string;
  discoveryUrl: string;
}

interface MicrosoftConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  tenant: string;
  discoveryUrl: string;
}

interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

interface AppleConfig {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
  redirectUri: string;
  scopes: string[];
}

interface FacebookConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  version: string;
}

interface CustomProviderConfig {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  discoveryUrl?: string;
  endpoints: {
    authorization: string;
    token: string;
    userinfo: string;
    revocation?: string;
  };
  userMapping: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

interface AuthorizationRequest {
  provider: string;
  responseType: 'code' | 'token' | 'id_token';
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  nonce?: string;
  codeChallenge?: string;
  codeChallengeMethod?: 'S256' | 'plain';
  prompt?: 'none' | 'login' | 'consent' | 'select_account';
  maxAge?: number;
  loginHint?: string;
  acrValues?: string;
}

interface TokenExchangeRequest {
  grantType: OAuth2GrantType;
  code?: string;
  redirectUri?: string;
  clientId: string;
  clientSecret?: string;
  codeVerifier?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
  assertion?: string;
  assertionType?: string;
  audience?: string;
  scope?: string;
}

interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  locale?: string;
  timezone?: string;
  provider: string;
  rawProfile: Record<string, unknown>;
}

interface ProviderDiscovery {
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userinfoEndpoint: string;
  jwksUri: string;
  registrationEndpoint?: string;
  revocationEndpoint?: string;
  introspectionEndpoint?: string;
  responseTypesSupported: string[];
  grantTypesSupported: string[];
  subjectTypesSupported: string[];
  idTokenSigningAlgValuesSupported: string[];
  scopesSupported: string[];
  claimsSupported: string[];
  codeChallengeMethodsSupported?: string[];
}

interface OAuthSession {
  sessionId: SessionId;
  provider: string;
  state: string;
  nonce?: string;
  codeVerifier?: string;
  redirectUri: string;
  scopes: string[];
  createdAt: ISOTimestamp;
  expiresAt: ISOTimestamp;
  metadata: Record<string, unknown>;
}

interface ProviderMetrics {
  totalAuthorizations: number;
  totalTokenExchanges: number;
  totalUserProfiles: number;
  providerStats: Record<string, {
    authorizations: number;
    tokenExchanges: number;
    errors: number;
    averageResponseTime: number;
  }>;
  errorStats: {
    authorizationErrors: number;
    tokenErrors: number;
    userProfileErrors: number;
    validationErrors: number;
  };
}

/**
 * Enterprise OAuth2/OIDC Provider
 * 
 * Comprehensive OAuth2 and OpenID Connect integration supporting multiple
 * identity providers with enterprise security and user management features.
 */
export class OAuthProvider extends EventEmitter {
  private static instance: OAuthProvider;
  private config: OAuthProviderConfig;
  private sessions: Map<string, OAuthSession> = new Map();
  private discoveries: Map<string, ProviderDiscovery> = new Map();
  private metrics: ProviderMetrics;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor(config: OAuthProviderConfig) {
    super();
    this.config = config;
    this.metrics = {
      totalAuthorizations: 0,
      totalTokenExchanges: 0,
      totalUserProfiles: 0,
      providerStats: {},
      errorStats: {
        authorizationErrors: 0,
        tokenErrors: 0,
        userProfileErrors: 0,
        validationErrors: 0
      }
    };

    this.initializeProviders();
    this.startCleanupTimer();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: OAuthProviderConfig): OAuthProvider {
    if (!OAuthProvider.instance) {
      if (!config) {
        throw new Error('OAuthProvider requires configuration on first instantiation');
      }
      OAuthProvider.instance = new OAuthProvider(config);
    }
    return OAuthProvider.instance;
  }

  /**
   * Generate authorization URL
   */
  public async generateAuthorizationUrl(
    provider: string,
    options: {
      scopes?: string[];
      state?: string;
      nonce?: string;
      prompt?: string;
      loginHint?: string;
      maxAge?: number;
      acrValues?: string;
      redirectUri?: string;
    } = {}
  ): Promise<{
    url: string;
    state: string;
    nonce?: string;
    codeVerifier?: string;
    sessionId: SessionId;
  }> {
    const providerConfig = this.getProviderConfig(provider);
    if (!providerConfig) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const sessionId = this.generateSessionId();
    const state = options.state || this.generateState();
    const nonce = this.config.security.enableNonce ? (options.nonce || this.generateNonce()) : undefined;
    
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;
    
    if (this.config.security.enablePKCE) {
      codeVerifier = this.generateCodeVerifier();
      codeChallenge = this.generateCodeChallenge(codeVerifier);
    }

    const scopes = options.scopes || providerConfig.scopes || ['openid', 'email', 'profile'];
    const redirectUri = options.redirectUri || providerConfig.redirectUri;

    // Store session
    const session: OAuthSession = {
      sessionId,
      provider,
      state,
      nonce,
      codeVerifier,
      redirectUri,
      scopes,
      createdAt: new Date().toISOString() as ISOTimestamp,
      expiresAt: new Date(Date.now() + 600000).toISOString() as ISOTimestamp, // 10 minutes
      metadata: { options }
    };

    this.sessions.set(state, session);

    // Build authorization URL
    const authUrl = await this.buildAuthorizationUrl(provider, {
      provider,
      responseType: 'code',
      clientId: providerConfig.clientId,
      redirectUri,
      scope: scopes.join(' '),
      state,
      nonce,
      codeChallenge,
      codeChallengeMethod: codeChallenge ? 'S256' : undefined,
      prompt: options.prompt as any,
      maxAge: options.maxAge,
      loginHint: options.loginHint,
      acrValues: options.acrValues
    });

    this.metrics.totalAuthorizations++;
    this.updateProviderStats(provider, 'authorizations');

    this.emit('authorization-initiated', {
      sessionId,
      provider,
      state,
      redirectUri,
      scopes,
      timestamp: new Date().toISOString()
    });

    return {
      url: authUrl,
      state,
      nonce,
      codeVerifier,
      sessionId
    };
  }

  /**
   * Exchange authorization code for tokens
   */
  public async exchangeCodeForTokens(
    code: string,
    state: string,
    receivedState?: string
  ): Promise<{
    tokens: OAuth2TokenResponse;
    userProfile: UserProfile;
    session: OAuthSession;
  }> {
    // Validate state
    if (this.config.security.enableState && state !== receivedState) {
      this.metrics.errorStats.validationErrors++;
      throw new Error('Invalid state parameter');
    }

    const session = this.sessions.get(state);
    if (!session) {
      this.metrics.errorStats.validationErrors++;
      throw new Error('Session not found or expired');
    }

    // Check session expiry
    if (new Date() > new Date(session.expiresAt)) {
      this.sessions.delete(state);
      this.metrics.errorStats.validationErrors++;
      throw new Error('Session expired');
    }

    const providerConfig = this.getProviderConfig(session.provider);
    if (!providerConfig) {
      throw new Error(`Provider ${session.provider} not configured`);
    }

    try {
      // Exchange code for tokens
      const tokens = await this.performTokenExchange(session.provider, {
        grantType: OAuth2GrantType.AUTHORIZATION_CODE,
        code,
        redirectUri: session.redirectUri,
        clientId: providerConfig.clientId,
        clientSecret: providerConfig.clientSecret,
        codeVerifier: session.codeVerifier
      });

      // Get user profile
      const userProfile = await this.getUserProfile(session.provider, tokens.access_token);

      // Clean up session
      this.sessions.delete(state);

      this.metrics.totalTokenExchanges++;
      this.metrics.totalUserProfiles++;
      this.updateProviderStats(session.provider, 'tokenExchanges');

      this.emit('token-exchange-completed', {
        sessionId: session.sessionId,
        provider: session.provider,
        userId: userProfile.id,
        email: userProfile.email,
        timestamp: new Date().toISOString()
      });

      return {
        tokens,
        userProfile,
        session
      };

    } catch (error) {
      this.metrics.errorStats.tokenErrors++;
      this.updateProviderStats(session.provider, 'errors');
      
      this.emit('token-exchange-failed', {
        sessionId: session.sessionId,
        provider: session.provider,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Refresh access token
   */
  public async refreshToken(
    provider: string,
    refreshToken: string
  ): Promise<OAuth2TokenResponse> {
    const providerConfig = this.getProviderConfig(provider);
    if (!providerConfig) {
      throw new Error(`Provider ${provider} not configured`);
    }

    try {
      const tokens = await this.performTokenExchange(provider, {
        grantType: OAuth2GrantType.REFRESH_TOKEN,
        refreshToken,
        clientId: providerConfig.clientId,
        clientSecret: providerConfig.clientSecret
      });

      this.emit('token-refreshed', {
        provider,
        timestamp: new Date().toISOString()
      });

      return tokens;

    } catch (error) {
      this.metrics.errorStats.tokenErrors++;
      this.updateProviderStats(provider, 'errors');
      
      this.emit('token-refresh-failed', {
        provider,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Revoke token
   */
  public async revokeToken(
    provider: string,
    token: string,
    tokenType: 'access_token' | 'refresh_token' = 'access_token'
  ): Promise<void> {
    const discovery = this.discoveries.get(provider);
    if (!discovery?.revocationEndpoint) {
      throw new Error(`Provider ${provider} does not support token revocation`);
    }

    const providerConfig = this.getProviderConfig(provider);
    if (!providerConfig) {
      throw new Error(`Provider ${provider} not configured`);
    }

    try {
      const response = await fetch(discovery.revocationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${providerConfig.clientId}:${providerConfig.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          token,
          token_type_hint: tokenType
        })
      });

      if (!response.ok) {
        throw new Error(`Token revocation failed: ${response.statusText}`);
      }

      this.emit('token-revoked', {
        provider,
        tokenType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.emit('token-revocation-failed', {
        provider,
        tokenType,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Get user profile from provider
   */
  public async getUserProfile(provider: string, accessToken: string): Promise<UserProfile> {
    try {
      const rawProfile = await this.fetchUserProfile(provider, accessToken);
      const mappedProfile = this.mapUserProfile(provider, rawProfile);

      this.emit('user-profile-fetched', {
        provider,
        userId: mappedProfile.id,
        email: mappedProfile.email,
        timestamp: new Date().toISOString()
      });

      return mappedProfile;

    } catch (error) {
      this.metrics.errorStats.userProfileErrors++;
      this.updateProviderStats(provider, 'errors');
      
      this.emit('user-profile-failed', {
        provider,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Get provider discovery information
   */
  public async getProviderDiscovery(provider: string): Promise<ProviderDiscovery> {
    if (this.discoveries.has(provider)) {
      return this.discoveries.get(provider)!;
    }

    const discoveryUrl = this.getDiscoveryUrl(provider);
    if (!discoveryUrl) {
      throw new Error(`Discovery not supported for provider ${provider}`);
    }

    try {
      const response = await fetch(discoveryUrl);
      if (!response.ok) {
        throw new Error(`Discovery failed: ${response.statusText}`);
      }

      const discovery = await response.json() as ProviderDiscovery;
      this.discoveries.set(provider, discovery);

      this.emit('discovery-updated', {
        provider,
        discovery,
        timestamp: new Date().toISOString()
      });

      return discovery;

    } catch (error) {
      this.emit('discovery-failed', {
        provider,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  /**
   * Validate provider configuration
   */
  public validateProviderConfig(provider: string): boolean {
    const config = this.getProviderConfig(provider);
    if (!config) {
      return false;
    }

    const required = ['clientId', 'clientSecret', 'redirectUri'];
    return required.every(field => field in config && config[field as keyof typeof config]);
  }

  /**
   * Get metrics
   */
  public getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<OAuthProviderConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', { config: this.config, timestamp: new Date().toISOString() });
  }

  /**
   * Cleanup expired sessions
   */
  public cleanup(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [state, session] of this.sessions) {
      if (now > new Date(session.expiresAt)) {
        this.sessions.delete(state);
        cleaned++;
      }
    }

    this.emit('cleanup-completed', {
      cleanedSessions: cleaned,
      activeSessions: this.sessions.size,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Shutdown provider
   */
  public shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.emit('shutdown', {
      finalMetrics: this.getMetrics(),
      activeSessions: this.sessions.size,
      discoveredProviders: this.discoveries.size,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Initialize providers and perform discovery
   */
  private async initializeProviders(): Promise<void> {
    const providers = Object.keys(this.config.providers);
    
    for (const provider of providers) {
      try {
        await this.getProviderDiscovery(provider);
        this.initializeProviderStats(provider);
      } catch (error) {
        this.emit('provider-initialization-failed', {
          provider,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  /**
   * Initialize provider statistics
   */
  private initializeProviderStats(provider: string): void {
    if (!this.metrics.providerStats[provider]) {
      this.metrics.providerStats[provider] = {
        authorizations: 0,
        tokenExchanges: 0,
        errors: 0,
        averageResponseTime: 0
      };
    }
  }

  /**
   * Update provider statistics
   */
  private updateProviderStats(provider: string, metric: keyof ProviderMetrics['providerStats'][string]): void {
    this.initializeProviderStats(provider);
    (this.metrics.providerStats[provider][metric] as number)++;
  }

  /**
   * Get provider configuration
   */
  private getProviderConfig(provider: string): any {
    const providerConfigs = this.config.providers as any;
    return providerConfigs[provider];
  }

  /**
   * Get discovery URL for provider
   */
  private getDiscoveryUrl(provider: string): string | undefined {
    const config = this.getProviderConfig(provider);
    if (!config) return undefined;

    if (config.discoveryUrl) {
      return config.discoveryUrl;
    }

    // Standard discovery URLs
    switch (provider) {
      case 'google':
        return 'https://accounts.google.com/.well-known/openid_configuration';
      case 'microsoft':
        return `https://login.microsoftonline.com/${config.tenant}/v2.0/.well-known/openid_configuration`;
      default:
        return undefined;
    }
  }

  /**
   * Build authorization URL
   */
  private async buildAuthorizationUrl(provider: string, request: AuthorizationRequest): Promise<string> {
    const discovery = await this.getProviderDiscovery(provider);
    const url = new URL(discovery.authorizationEndpoint);

    // Add standard parameters
    url.searchParams.set('response_type', request.responseType);
    url.searchParams.set('client_id', request.clientId);
    url.searchParams.set('redirect_uri', request.redirectUri);
    url.searchParams.set('scope', request.scope);
    
    if (request.state) url.searchParams.set('state', request.state);
    if (request.nonce) url.searchParams.set('nonce', request.nonce);
    if (request.codeChallenge) {
      url.searchParams.set('code_challenge', request.codeChallenge);
      url.searchParams.set('code_challenge_method', request.codeChallengeMethod || 'S256');
    }
    if (request.prompt) url.searchParams.set('prompt', request.prompt);
    if (request.maxAge) url.searchParams.set('max_age', request.maxAge.toString());
    if (request.loginHint) url.searchParams.set('login_hint', request.loginHint);
    if (request.acrValues) url.searchParams.set('acr_values', request.acrValues);

    return url.toString();
  }

  /**
   * Perform token exchange
   */
  private async performTokenExchange(provider: string, request: TokenExchangeRequest): Promise<OAuth2TokenResponse> {
    const discovery = await this.getProviderDiscovery(provider);
    
    const body = new URLSearchParams();
    body.set('grant_type', request.grantType);
    body.set('client_id', request.clientId);
    
    if (request.clientSecret) body.set('client_secret', request.clientSecret);
    if (request.code) body.set('code', request.code);
    if (request.redirectUri) body.set('redirect_uri', request.redirectUri);
    if (request.codeVerifier) body.set('code_verifier', request.codeVerifier);
    if (request.refreshToken) body.set('refresh_token', request.refreshToken);
    if (request.username) body.set('username', request.username);
    if (request.password) body.set('password', request.password);
    if (request.assertion) body.set('assertion', request.assertion);
    if (request.assertionType) body.set('assertion_type', request.assertionType);
    if (request.audience) body.set('audience', request.audience);
    if (request.scope) body.set('scope', request.scope);

    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_description || `Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch user profile from provider
   */
  private async fetchUserProfile(provider: string, accessToken: string): Promise<Record<string, unknown>> {
    const discovery = await this.getProviderDiscovery(provider);
    
    const response = await fetch(discovery.userinfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`User profile fetch failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Map provider-specific user profile to standard format
   */
  private mapUserProfile(provider: string, rawProfile: Record<string, unknown>): UserProfile {
    const config = this.getProviderConfig(provider);
    const mapping = config?.userMapping || this.getDefaultUserMapping(provider);

    return {
      id: this.extractValue(rawProfile, mapping.id) as string,
      email: this.extractValue(rawProfile, mapping.email) as string,
      emailVerified: this.extractValue(rawProfile, mapping.emailVerified, false) as boolean,
      name: this.extractValue(rawProfile, mapping.name) as string,
      givenName: this.extractValue(rawProfile, mapping.givenName) as string,
      familyName: this.extractValue(rawProfile, mapping.familyName) as string,
      picture: this.extractValue(rawProfile, mapping.picture) as string,
      locale: this.extractValue(rawProfile, mapping.locale) as string,
      timezone: this.extractValue(rawProfile, mapping.timezone) as string,
      provider,
      rawProfile
    };
  }

  /**
   * Get default user profile mapping for provider
   */
  private getDefaultUserMapping(provider: string): Record<string, string> {
    const mappings: Record<string, Record<string, string>> = {
      google: {
        id: 'sub',
        email: 'email',
        emailVerified: 'email_verified',
        name: 'name',
        givenName: 'given_name',
        familyName: 'family_name',
        picture: 'picture',
        locale: 'locale'
      },
      microsoft: {
        id: 'sub',
        email: 'email',
        emailVerified: 'email_verified',
        name: 'name',
        givenName: 'given_name',
        familyName: 'family_name',
        picture: 'picture'
      },
      github: {
        id: 'id',
        email: 'email',
        name: 'name',
        picture: 'avatar_url',
        givenName: 'name',
        familyName: 'name'
      }
    };

    return mappings[provider] || mappings.google;
  }

  /**
   * Extract value from object using path
   */
  private extractValue(obj: Record<string, unknown>, path: string, defaultValue?: unknown): unknown {
    if (!path) return defaultValue;
    
    const keys = path.split('.');
    let value: any = obj;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): SessionId {
    return `oauth_${Date.now()}_${randomBytes(16).toString('hex')}` as SessionId;
  }

  /**
   * Generate state parameter
   */
  private generateState(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * Generate nonce parameter
   */
  private generateNonce(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * Generate PKCE code verifier
   */
  private generateCodeVerifier(): string {
    return randomBytes(32).toString('base64url');
  }

  /**
   * Generate PKCE code challenge
   */
  private generateCodeChallenge(verifier: string): string {
    return createHash('sha256').update(verifier).digest('base64url');
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }
}

/**
 * Create OAuth provider instance
 */
export const createOAuthProvider = (config: Partial<OAuthProviderConfig> = {}): OAuthProvider => {
  const defaultConfig: OAuthProviderConfig = {
    enabled: config.enabled ?? true,
    providers: config.providers || {},
    security: {
      enablePKCE: config.security?.enablePKCE ?? true,
      enableState: config.security?.enableState ?? true,
      enableNonce: config.security?.enableNonce ?? true,
      encryptTokens: config.security?.encryptTokens ?? false,
      validateIssuer: config.security?.validateIssuer ?? true,
      clockSkewSeconds: config.security?.clockSkewSeconds || 300
    },
    tokenExchange: {
      enabled: config.tokenExchange?.enabled ?? true,
      allowedAudiences: config.tokenExchange?.allowedAudiences || [],
      defaultTTL: config.tokenExchange?.defaultTTL || 3600
    },
    userMapping: {
      autoCreateUsers: config.userMapping?.autoCreateUsers ?? true,
      defaultRoles: config.userMapping?.defaultRoles || ['user'],
      attributeMapping: config.userMapping?.attributeMapping || {}
    }
  };

  return OAuthProvider.getInstance({ ...defaultConfig, ...config });
};

// Default export
export default OAuthProvider;