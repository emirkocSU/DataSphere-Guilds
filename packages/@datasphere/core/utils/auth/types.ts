/**
 * @fileoverview Enterprise Authentication Types - Comprehensive Auth Type System
 * 
 * Complete type definitions for enterprise-grade authentication system including
 * JWT, OAuth2/OIDC, MFA, biometric auth, session management, and Policy-Based
 * Access Control (PBAC) for unicorn-level security infrastructure.
 */

import { UUID, ISOTimestamp } from '../../types/common.types';

/** Authentication session identifier */
export type SessionId = UUID;

/** User identifier */
export type UserId = UUID;

/** Token identifier */
export type TokenId = UUID;

/** Device identifier for device-based authentication */
export type DeviceId = UUID;

/** Policy identifier for PBAC */
export type PolicyId = UUID;

/** Role identifier */
export type RoleId = UUID;

/** Permission identifier */
export type PermissionId = UUID;

/** Authentication methods supported by the system */
export enum AuthMethod {
  PASSWORD = 'PASSWORD',
  EMAIL_OTP = 'EMAIL_OTP',
  SMS_OTP = 'SMS_OTP',
  TOTP = 'TOTP', // Time-based One-Time Password
  HOTP = 'HOTP', // HMAC-based One-Time Password
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  BIOMETRIC_FINGERPRINT = 'BIOMETRIC_FINGERPRINT',
  BIOMETRIC_FACE = 'BIOMETRIC_FACE',
  BIOMETRIC_VOICE = 'BIOMETRIC_VOICE',
  BIOMETRIC_RETINA = 'BIOMETRIC_RETINA',
  HARDWARE_TOKEN = 'HARDWARE_TOKEN',
  WEBAUTHN = 'WEBAUTHN',
  OAUTH2_GOOGLE = 'OAUTH2_GOOGLE',
  OAUTH2_MICROSOFT = 'OAUTH2_MICROSOFT',
  OAUTH2_GITHUB = 'OAUTH2_GITHUB',
  OAUTH2_APPLE = 'OAUTH2_APPLE',
  OAUTH2_FACEBOOK = 'OAUTH2_FACEBOOK',
  SAML = 'SAML',
  LDAP = 'LDAP',
  CERTIFICATE = 'CERTIFICATE'
}

/** Authentication status */
export enum AuthStatus {
  PENDING = 'PENDING',
  AUTHENTICATED = 'AUTHENTICATED',
  REQUIRES_MFA = 'REQUIRES_MFA',
  REQUIRES_DEVICE_VERIFICATION = 'REQUIRES_DEVICE_VERIFICATION',
  REQUIRES_PASSWORD_RESET = 'REQUIRES_PASSWORD_RESET',
  LOCKED = 'LOCKED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  REVOKED = 'REVOKED'
}

/** Session status */
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  INVALID = 'INVALID'
}

/** Token types */
export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ID_TOKEN = 'ID_TOKEN',
  AUTHORIZATION_CODE = 'AUTHORIZATION_CODE',
  DEVICE_CODE = 'DEVICE_CODE',
  API_KEY = 'API_KEY',
  TEMPORARY_TOKEN = 'TEMPORARY_TOKEN'
}

/** MFA challenge types */
export enum MFAChallenge {
  SMS_CODE = 'SMS_CODE',
  EMAIL_CODE = 'EMAIL_CODE',
  TOTP_CODE = 'TOTP_CODE',
  PUSH_APPROVE = 'PUSH_APPROVE',
  BIOMETRIC_SCAN = 'BIOMETRIC_SCAN',
  HARDWARE_TOKEN = 'HARDWARE_TOKEN',
  BACKUP_CODE = 'BACKUP_CODE',
  SECURITY_QUESTION = 'SECURITY_QUESTION'
}

/** Biometric types */
export enum BiometricType {
  FINGERPRINT = 'FINGERPRINT',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  VOICE_RECOGNITION = 'VOICE_RECOGNITION',
  RETINA_SCAN = 'RETINA_SCAN',
  IRIS_SCAN = 'IRIS_SCAN',
  PALM_PRINT = 'PALM_PRINT',
  BEHAVIORAL_BIOMETRIC = 'BEHAVIORAL_BIOMETRIC'
}

/** OAuth2 grant types */
export enum OAuth2GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  IMPLICIT = 'implicit',
  PASSWORD = 'password',
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
  DEVICE_CODE = 'urn:ietf:params:oauth:grant-type:device_code',
  JWT_BEARER = 'urn:ietf:params:oauth:grant-type:jwt-bearer'
}

/** PBAC decision types */
export enum AccessDecision {
  PERMIT = 'PERMIT',
  DENY = 'DENY',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  INDETERMINATE = 'INDETERMINATE'
}

/** Policy effect types */
export enum PolicyEffect {
  ALLOW = 'ALLOW',
  DENY = 'DENY'
}

/** Authentication context */
export interface AuthContext {
  /** Session identifier */
  sessionId: SessionId;
  
  /** User making the request */
  userId: UserId;
  
  /** Device information */
  device: DeviceInfo;
  
  /** Network information */
  network: NetworkInfo;
  
  /** Request information */
  request: RequestInfo;
  
  /** Authentication metadata */
  metadata: {
    userAgent: string;
    timestamp: ISOTimestamp;
    correlationId: string;
    riskScore?: number;
    geoLocation?: GeoLocation;
    previousLogins?: AuthenticationAttempt[];
  };
}

/** Device information */
export interface DeviceInfo {
  /** Unique device identifier */
  deviceId: DeviceId;
  
  /** Device fingerprint */
  fingerprint: string;
  
  /** Device type */
  type: 'desktop' | 'mobile' | 'tablet' | 'server' | 'iot' | 'unknown';
  
  /** Operating system */
  os: {
    name: string;
    version: string;
    platform: string;
  };
  
  /** Browser information */
  browser?: {
    name: string;
    version: string;
    engine: string;
  };
  
  /** Device trust level */
  trustLevel: 'trusted' | 'recognized' | 'unknown' | 'suspicious';
  
  /** Last seen timestamp */
  lastSeen: ISOTimestamp;
  
  /** Device capabilities */
  capabilities: {
    biometric: BiometricType[];
    pushNotifications: boolean;
    webauthn: boolean;
    geolocation: boolean;
  };
}

/** Network information */
export interface NetworkInfo {
  /** IP address */
  ipAddress: string;
  
  /** IP version */
  ipVersion: 'IPv4' | 'IPv6';
  
  /** IP type */
  ipType: 'public' | 'private' | 'vpn' | 'tor' | 'proxy';
  
  /** ISP information */
  isp?: string;
  
  /** Geographic location */
  geoLocation?: GeoLocation;
  
  /** Risk indicators */
  riskIndicators: {
    isVpn: boolean;
    isTor: boolean;
    isProxy: boolean;
    isMalicious: boolean;
    isDataCenter: boolean;
  };
}

/** Geographic location */
export interface GeoLocation {
  /** Country code */
  country: string;
  
  /** Region/state */
  region?: string;
  
  /** City */
  city?: string;
  
  /** Latitude */
  latitude?: number;
  
  /** Longitude */
  longitude?: number;
  
  /** Timezone */
  timezone?: string;
}

/** Request information */
export interface RequestInfo {
  /** HTTP method */
  method: string;
  
  /** Request URL */
  url: string;
  
  /** Request headers */
  headers: Record<string, string>;
  
  /** Request timestamp */
  timestamp: ISOTimestamp;
  
  /** Request ID for tracing */
  requestId: string;
}

/** User authentication profile */
export interface UserAuthProfile {
  /** User identifier */
  userId: UserId;
  
  /** Primary authentication methods */
  primaryMethods: AuthMethod[];
  
  /** MFA configuration */
  mfaConfig: MFAConfiguration;
  
  /** Biometric enrollment */
  biometricEnrollment: BiometricEnrollment[];
  
  /** Device registrations */
  registeredDevices: RegisteredDevice[];
  
  /** Authentication preferences */
  preferences: AuthPreferences;
  
  /** Security settings */
  securitySettings: SecuritySettings;
  
  /** Account status */
  status: 'active' | 'suspended' | 'locked' | 'pending_verification';
  
  /** Password policy compliance */
  passwordPolicy: PasswordPolicyStatus;
  
  /** Last authentication */
  lastAuthentication?: AuthenticationAttempt;
  
  /** Risk assessment */
  riskProfile: UserRiskProfile;
}

/** MFA configuration */
export interface MFAConfiguration {
  /** MFA enabled status */
  enabled: boolean;
  
  /** Required MFA methods */
  requiredMethods: AuthMethod[];
  
  /** Backup methods */
  backupMethods: AuthMethod[];
  
  /** MFA enforcement rules */
  enforcement: {
    highRiskOperations: boolean;
    newDeviceLogin: boolean;
    suspiciousActivity: boolean;
    geographicAnomaly: boolean;
    timeBasedRules: TimeBasedRule[];
  };
  
  /** Enrolled MFA devices */
  enrolledDevices: MFADevice[];
  
  /** Backup codes */
  backupCodes: {
    available: number;
    lastGenerated: ISOTimestamp;
    expiresAt?: ISOTimestamp;
  };
}

/** MFA device */
export interface MFADevice {
  /** Device identifier */
  deviceId: DeviceId;
  
  /** MFA method */
  method: AuthMethod;
  
  /** Device name/label */
  name: string;
  
  /** Enrollment date */
  enrolledAt: ISOTimestamp;
  
  /** Last used */
  lastUsed?: ISOTimestamp;
  
  /** Device status */
  status: 'active' | 'inactive' | 'suspended';
  
  /** Device-specific configuration */
  config: Record<string, unknown>;
}

/** Biometric enrollment */
export interface BiometricEnrollment {
  /** Enrollment identifier */
  enrollmentId: UUID;
  
  /** Biometric type */
  type: BiometricType;
  
  /** Enrollment timestamp */
  enrolledAt: ISOTimestamp;
  
  /** Device used for enrollment */
  deviceId: DeviceId;
  
  /** Enrollment quality score */
  qualityScore: number;
  
  /** Template hash (never store actual biometric data) */
  templateHash: string;
  
  /** Enrollment status */
  status: 'active' | 'inactive' | 'expired';
  
  /** Expiration date */
  expiresAt?: ISOTimestamp;
}

/** Registered device */
export interface RegisteredDevice {
  /** Device registration */
  device: DeviceInfo;
  
  /** Registration timestamp */
  registeredAt: ISOTimestamp;
  
  /** Last activity */
  lastActivity: ISOTimestamp;
  
  /** Device status */
  status: 'trusted' | 'recognized' | 'pending' | 'revoked';
  
  /** Authentication count */
  authCount: number;
  
  /** Device nickname */
  nickname?: string;
}

/** Authentication preferences */
export interface AuthPreferences {
  /** Preferred MFA method */
  preferredMFA: AuthMethod;
  
  /** Remember device duration */
  rememberDevice: number; // in seconds
  
  /** Session timeout preferences */
  sessionTimeout: number; // in seconds
  
  /** Notification preferences */
  notifications: {
    newDeviceLogin: boolean;
    suspiciousActivity: boolean;
    mfaEnabled: boolean;
    passwordChanged: boolean;
  };
  
  /** Privacy settings */
  privacy: {
    shareLocationData: boolean;
    shareDeviceInfo: boolean;
    shareUsageAnalytics: boolean;
  };
}

/** Security settings */
export interface SecuritySettings {
  /** Force password reset on next login */
  forcePasswordReset: boolean;
  
  /** Account lockout policy */
  lockoutPolicy: {
    enabled: boolean;
    maxAttempts: number;
    lockoutDuration: number; // in seconds
    progressiveLockout: boolean;
  };
  
  /** Session management */
  sessionManagement: {
    maxConcurrentSessions: number;
    timeoutWarning: number; // seconds before timeout
    idleTimeout: number; // seconds
    absoluteTimeout: number; // seconds
  };
  
  /** IP restrictions */
  ipRestrictions: {
    enabled: boolean;
    allowedIPs: string[];
    deniedIPs: string[];
  };
  
  /** Time-based restrictions */
  timeRestrictions: TimeBasedRule[];
}

/** Time-based rule */
export interface TimeBasedRule {
  /** Rule identifier */
  ruleId: UUID;
  
  /** Rule name */
  name: string;
  
  /** Days of week (0-6, Sunday=0) */
  daysOfWeek: number[];
  
  /** Start time (HH:MM format) */
  startTime: string;
  
  /** End time (HH:MM format) */
  endTime: string;
  
  /** Timezone */
  timezone: string;
  
  /** Rule action */
  action: 'allow' | 'deny' | 'require_mfa';
}

/** Password policy status */
export interface PasswordPolicyStatus {
  /** Policy compliance */
  compliant: boolean;
  
  /** Last password change */
  lastChanged: ISOTimestamp;
  
  /** Password expiry */
  expiresAt?: ISOTimestamp;
  
  /** Password strength score */
  strengthScore: number;
  
  /** Policy violations */
  violations: string[];
  
  /** Password history count */
  historyCount: number;
}

/** User risk profile */
export interface UserRiskProfile {
  /** Current risk score (0-100) */
  currentRiskScore: number;
  
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  /** Risk factors */
  riskFactors: RiskFactor[];
  
  /** Behavioral patterns */
  behavioralPattern: BehavioralPattern;
  
  /** Anomaly indicators */
  anomalies: AnomalyIndicator[];
  
  /** Last risk assessment */
  lastAssessment: ISOTimestamp;
}

/** Risk factor */
export interface RiskFactor {
  /** Factor type */
  type: 'device' | 'location' | 'behavior' | 'time' | 'network' | 'credential';
  
  /** Risk score contribution */
  score: number;
  
  /** Factor description */
  description: string;
  
  /** Confidence level */
  confidence: number;
}

/** Behavioral pattern */
export interface BehavioralPattern {
  /** Typical login times */
  loginTimes: {
    hoursOfDay: number[];
    daysOfWeek: number[];
    timezone: string;
  };
  
  /** Typical locations */
  typicalLocations: GeoLocation[];
  
  /** Typical devices */
  typicalDevices: DeviceId[];
  
  /** Usage patterns */
  usagePatterns: {
    averageSessionDuration: number;
    typicalActions: string[];
    accessFrequency: 'low' | 'medium' | 'high';
  };
}

/** Anomaly indicator */
export interface AnomalyIndicator {
  /** Anomaly type */
  type: 'location' | 'device' | 'time' | 'behavior' | 'velocity' | 'impossible_travel';
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Anomaly description */
  description: string;
  
  /** Detection timestamp */
  detectedAt: ISOTimestamp;
  
  /** Associated data */
  data: Record<string, unknown>;
}

/** Authentication attempt */
export interface AuthenticationAttempt {
  /** Attempt identifier */
  attemptId: UUID;
  
  /** User identifier */
  userId: UserId;
  
  /** Authentication method used */
  method: AuthMethod;
  
  /** Attempt timestamp */
  timestamp: ISOTimestamp;
  
  /** Success status */
  success: boolean;
  
  /** Failure reason */
  failureReason?: string;
  
  /** Device information */
  device: DeviceInfo;
  
  /** Network information */
  network: NetworkInfo;
  
  /** Session created */
  sessionId?: SessionId;
  
  /** MFA completed */
  mfaCompleted: boolean;
  
  /** Risk score at time of attempt */
  riskScore: number;
  
  /** Additional metadata */
  metadata: Record<string, unknown>;
}

/** JWT token payload */
export interface JWTPayload {
  /** Subject (user ID) */
  sub: UserId;
  
  /** Issuer */
  iss: string;
  
  /** Audience */
  aud: string | string[];
  
  /** Expiration time */
  exp: number;
  
  /** Not before */
  nbf?: number;
  
  /** Issued at */
  iat: number;
  
  /** JWT ID */
  jti: TokenId;
  
  /** Session ID */
  sid: SessionId;
  
  /** Authentication time */
  auth_time: number;
  
  /** Authentication methods references */
  amr: AuthMethod[];
  
  /** Authentication Context Class Reference */
  acr: string;
  
  /** Custom claims */
  [key: string]: unknown;
}

/** OAuth2 token response */
export interface OAuth2TokenResponse {
  /** Access token */
  access_token: string;
  
  /** Token type */
  token_type: 'Bearer' | 'MAC';
  
  /** Expires in seconds */
  expires_in?: number;
  
  /** Refresh token */
  refresh_token?: string;
  
  /** Scope */
  scope?: string;
  
  /** ID token (OIDC) */
  id_token?: string;
  
  /** Additional parameters */
  [key: string]: unknown;
}

/** Session data */
export interface SessionData {
  /** Session identifier */
  sessionId: SessionId;
  
  /** User identifier */
  userId: UserId;
  
  /** Session status */
  status: SessionStatus;
  
  /** Creation timestamp */
  createdAt: ISOTimestamp;
  
  /** Last activity timestamp */
  lastActivity: ISOTimestamp;
  
  /** Expiration timestamp */
  expiresAt: ISOTimestamp;
  
  /** Device information */
  device: DeviceInfo;
  
  /** Network information */
  network: NetworkInfo;
  
  /** Authentication context */
  authContext: AuthContext;
  
  /** Session attributes */
  attributes: Record<string, unknown>;
  
  /** Security context */
  securityContext: {
    riskScore: number;
    trustLevel: 'high' | 'medium' | 'low';
    mfaVerified: boolean;
    deviceTrusted: boolean;
  };
}

/** PBAC policy */
export interface PBACPolicy {
  /** Policy identifier */
  policyId: PolicyId;
  
  /** Policy name */
  name: string;
  
  /** Policy description */
  description: string;
  
  /** Policy version */
  version: string;
  
  /** Policy effect */
  effect: PolicyEffect;
  
  /** Target resources */
  target: PolicyTarget;
  
  /** Policy rules */
  rules: PolicyRule[];
  
  /** Policy conditions */
  conditions: PolicyCondition[];
  
  /** Policy status */
  status: 'active' | 'inactive' | 'draft';
  
  /** Creation timestamp */
  createdAt: ISOTimestamp;
  
  /** Last modified */
  modifiedAt: ISOTimestamp;
  
  /** Policy metadata */
  metadata: {
    owner: string;
    tags: string[];
    priority: number;
  };
}

/** Policy target */
export interface PolicyTarget {
  /** Subject (who) */
  subject: {
    users?: UserId[];
    roles?: RoleId[];
    groups?: string[];
    attributes?: AttributeMatch[];
  };
  
  /** Resource (what) */
  resource: {
    types?: string[];
    ids?: string[];
    attributes?: AttributeMatch[];
    patterns?: string[];
  };
  
  /** Action (how) */
  action: {
    operations?: string[];
    methods?: string[];
    patterns?: string[];
  };
  
  /** Environment (when/where) */
  environment?: {
    time?: TimeConstraint;
    location?: LocationConstraint;
    network?: NetworkConstraint;
  };
}

/** Policy rule */
export interface PolicyRule {
  /** Rule identifier */
  ruleId: UUID;
  
  /** Rule name */
  name: string;
  
  /** Rule condition */
  condition: string; // Expression language
  
  /** Rule effect */
  effect: PolicyEffect;
  
  /** Rule priority */
  priority: number;
}

/** Policy condition */
export interface PolicyCondition {
  /** Condition identifier */
  conditionId: UUID;
  
  /** Condition type */
  type: 'attribute' | 'time' | 'location' | 'device' | 'risk' | 'custom';
  
  /** Condition expression */
  expression: string;
  
  /** Condition parameters */
  parameters: Record<string, unknown>;
}

/** Attribute match */
export interface AttributeMatch {
  /** Attribute name */
  name: string;
  
  /** Match operator */
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'regex';
  
  /** Expected value(s) */
  value: string | string[] | number | boolean;
}

/** Time constraint */
export interface TimeConstraint {
  /** Start time */
  start?: string; // ISO time or cron expression
  
  /** End time */
  end?: string; // ISO time or cron expression
  
  /** Days of week */
  daysOfWeek?: number[];
  
  /** Timezone */
  timezone?: string;
}

/** Location constraint */
export interface LocationConstraint {
  /** Allowed countries */
  allowedCountries?: string[];
  
  /** Denied countries */
  deniedCountries?: string[];
  
  /** Geofence areas */
  geofences?: GeofenceArea[];
}

/** Geofence area */
export interface GeofenceArea {
  /** Area name */
  name: string;
  
  /** Center point */
  center: {
    latitude: number;
    longitude: number;
  };
  
  /** Radius in meters */
  radius: number;
  
  /** Area type */
  type: 'allow' | 'deny';
}

/** Network constraint */
export interface NetworkConstraint {
  /** Allowed IP ranges */
  allowedIPs?: string[];
  
  /** Denied IP ranges */
  deniedIPs?: string[];
  
  /** Network types */
  allowedNetworkTypes?: ('public' | 'private' | 'vpn')[];
}

/** PBAC evaluation request */
export interface PBACRequest {
  /** Request identifier */
  requestId: string;
  
  /** Subject information */
  subject: {
    userId: UserId;
    roles: RoleId[];
    attributes: Record<string, unknown>;
  };
  
  /** Resource information */
  resource: {
    type: string;
    id: string;
    attributes: Record<string, unknown>;
  };
  
  /** Action information */
  action: {
    operation: string;
    method?: string;
  };
  
  /** Environment context */
  environment: {
    timestamp: ISOTimestamp;
    device: DeviceInfo;
    network: NetworkInfo;
    riskScore: number;
  };
}

/** PBAC evaluation response */
export interface PBACResponse {
  /** Request identifier */
  requestId: string;
  
  /** Access decision */
  decision: AccessDecision;
  
  /** Applied policies */
  appliedPolicies: PolicyId[];
  
  /** Evaluation details */
  evaluation: {
    duration: number;
    policyCount: number;
    ruleCount: number;
  };
  
  /** Obligations (additional requirements) */
  obligations?: Obligation[];
  
  /** Advice (recommendations) */
  advice?: Advice[];
  
  /** Evaluation timestamp */
  timestamp: ISOTimestamp;
}

/** Obligation */
export interface Obligation {
  /** Obligation identifier */
  id: string;
  
  /** Obligation type */
  type: 'log_access' | 'notify_admin' | 'require_approval' | 'limit_time' | 'audit_trail';
  
  /** Obligation parameters */
  parameters: Record<string, unknown>;
}

/** Advice */
export interface Advice {
  /** Advice identifier */
  id: string;
  
  /** Advice type */
  type: 'security_warning' | 'recommend_mfa' | 'suggest_training' | 'policy_update';
  
  /** Advice message */
  message: string;
  
  /** Advice parameters */
  parameters: Record<string, unknown>;
}

/** Authentication configuration */
export interface AuthConfig {
  /** Service configuration */
  service: {
    name: string;
    version: string;
    environment: string;
  };
  
  /** JWT configuration */
  jwt: {
    issuer: string;
    audience: string[];
    secretKey: string;
    algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';
    accessTokenTTL: number; // seconds
    refreshTokenTTL: number; // seconds
    idTokenTTL: number; // seconds
  };
  
  /** OAuth2 configuration */
  oauth2: {
    authorizationServer: string;
    clientId: string;
    clientSecret: string;
    redirectUris: string[];
    scopes: string[];
    responseTypes: string[];
    grantTypes: OAuth2GrantType[];
  };
  
  /** MFA configuration */
  mfa: {
    enabled: boolean;
    requiredMethods: AuthMethod[];
    gracePeriod: number; // seconds
    backupCodeCount: number;
    totpIssuer: string;
    smsProvider: {
      provider: 'twilio' | 'aws_sns' | 'custom';
      config: Record<string, unknown>;
    };
    emailProvider: {
      provider: 'sendgrid' | 'aws_ses' | 'custom';
      config: Record<string, unknown>;
    };
  };
  
  /** Session configuration */
  session: {
    defaultTimeout: number; // seconds
    maxTimeout: number; // seconds
    maxConcurrentSessions: number;
    storage: 'memory' | 'redis' | 'database';
    cookieSettings: {
      name: string;
      domain?: string;
      path: string;
      secure: boolean;
      httpOnly: boolean;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  
  /** PBAC configuration */
  pbac: {
    enabled: boolean;
    defaultDecision: AccessDecision;
    policyEngine: 'simple' | 'xacml' | 'opa';
    policyStorage: 'memory' | 'database' | 'file';
    evaluationCache: {
      enabled: boolean;
      ttl: number; // seconds
    };
  };
  
  /** Security configuration */
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireDigits: boolean;
      requireSpecialChars: boolean;
      forbidCommonPasswords: boolean;
      maxAge: number; // days
      historySize: number;
    };
    rateLimit: {
      loginAttempts: {
        maxAttempts: number;
        windowMs: number;
        blockDurationMs: number;
      };
      apiRequests: {
        maxRequests: number;
        windowMs: number;
      };
    };
    encryption: {
      algorithm: string;
      keySize: number;
      ivSize: number;
    };
  };
  
  /** Integration configuration */
  integrations: {
    database: {
      provider: 'postgresql' | 'mysql' | 'mongodb';
      config: Record<string, unknown>;
    };
    cache: {
      provider: 'redis' | 'memcached' | 'memory';
      config: Record<string, unknown>;
    };
    monitoring: {
      enabled: boolean;
      providers: ('datadog' | 'newrelic' | 'prometheus')[];
    };
    audit: {
      enabled: boolean;
      destination: 'database' | 'file' | 'siem';
      config: Record<string, unknown>;
    };
  };
}

/** Authentication events */
export interface AuthEvent {
  /** Event identifier */
  eventId: UUID;
  
  /** Event type */
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'mfa_challenge' | 'mfa_success' | 'mfa_failure' | 'session_expired' | 'password_reset' | 'account_locked' | 'permission_denied';
  
  /** Event timestamp */
  timestamp: ISOTimestamp;
  
  /** User identifier */
  userId?: UserId;
  
  /** Session identifier */
  sessionId?: SessionId;
  
  /** Event data */
  data: Record<string, unknown>;
  
  /** Event source */
  source: {
    service: string;
    component: string;
    version: string;
  };
  
  /** Event metadata */
  metadata: {
    correlationId: string;
    requestId: string;
    userAgent: string;
    ipAddress: string;
  };
}

/** Audit log entry */
export interface AuditLogEntry {
  /** Log entry identifier */
  entryId: UUID;
  
  /** Timestamp */
  timestamp: ISOTimestamp;
  
  /** Event type */
  eventType: string;
  
  /** Actor (who performed the action) */
  actor: {
    userId?: UserId;
    type: 'user' | 'system' | 'service';
    identifier: string;
  };
  
  /** Target (what was acted upon) */
  target: {
    type: string;
    identifier: string;
    attributes?: Record<string, unknown>;
  };
  
  /** Action performed */
  action: string;
  
  /** Result of the action */
  result: 'success' | 'failure' | 'partial';
  
  /** Additional details */
  details: Record<string, unknown>;
  
  /** Risk assessment */
  riskAssessment?: {
    score: number;
    factors: string[];
  };
  
  /** Geolocation */
  location?: GeoLocation;
  
  /** Device information */
  device?: DeviceInfo;
}

/** WebAuthn registration options */
export interface WebAuthnRegistrationOptions {
  /** Challenge */
  challenge: string;
  
  /** Relying party */
  rp: {
    name: string;
    id: string;
  };
  
  /** User information */
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  
  /** Public key credential parameters */
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  
  /** Authenticator selection */
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    userVerification?: 'required' | 'preferred' | 'discouraged';
    requireResidentKey?: boolean;
  };
  
  /** Timeout */
  timeout?: number;
  
  /** Attestation */
  attestation?: 'none' | 'indirect' | 'direct';
  
  /** Excluded credentials */
  excludeCredentials?: Array<{
    type: 'public-key';
    id: string;
  }>;
}

/** WebAuthn authentication options */
export interface WebAuthnAuthenticationOptions {
  /** Challenge */
  challenge: string;
  
  /** Timeout */
  timeout?: number;
  
  /** Relying party ID */
  rpId?: string;
  
  /** Allowed credentials */
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
    transports?: ('usb' | 'nfc' | 'ble' | 'internal')[];
  }>;
  
  /** User verification */
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

/** Export all types for external use */
export type {
  SessionId,
  UserId,
  TokenId,
  DeviceId,
  PolicyId,
  RoleId,
  PermissionId
};