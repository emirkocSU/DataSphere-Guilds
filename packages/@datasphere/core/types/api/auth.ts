/**
 * =====================================================================================
 * @datasphere/core - Authentication & Authorization API Types
 * =====================================================================================
 * 
 * Enterprise-grade authentication and authorization type definitions
 * Supporting OAuth 2.0, JWT, RBAC, MFA, and zero-trust security architecture
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @license MIT
 * 
 * Security Features:
 * - Zero-trust architecture with continuous verification
 * - Multi-factor authentication (MFA) with multiple methods
 * - Role-based access control (RBAC) with fine-grained permissions
 * - JWT token management with refresh and rotation
 * - OAuth 2.0 / OpenID Connect integration
 * - Biometric authentication support
 * - Device trust and fingerprinting
 * - Session management with security monitoring
 * - Rate limiting and brute force protection
 * - Comprehensive audit logging
 * =====================================================================================
 */

import {
  UUID,
  ISOTimestamp,
  Percentage,
  EmailAddress,
  PhoneNumber,
  BaseRequest,
  BaseResponse,
  ErrorCode,
  RequestMetadata,
  ResponseMetadata,
  DeviceInfo,
  LocationInfo
} from './common';

// ============================= AUTHENTICATION ENUMS =============================

/**
 * Authentication method enumeration
 */
export enum AuthMethod {
  PASSWORD = 'password',
  OAUTH = 'oauth',
  SAML = 'saml',
  JWT = 'jwt',
  API_KEY = 'api_key',
  BIOMETRIC = 'biometric',
  MFA = 'mfa',
  SSO = 'sso',
  DEVICE = 'device',
  CERTIFICATE = 'certificate',
  MAGIC_LINK = 'magic_link',
  SOCIAL = 'social'
}

/**
 * OAuth provider enumeration
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  DISCORD = 'discord',
  SLACK = 'slack',
  OKTA = 'okta',
  AUTH0 = 'auth0',
  CUSTOM = 'custom'
}

/**
 * Multi-factor authentication type
 */
export enum MFAType {
  SMS = 'sms',
  EMAIL = 'email',
  TOTP = 'totp',
  PUSH = 'push',
  BIOMETRIC = 'biometric',
  HARDWARE_TOKEN = 'hardware_token',
  BACKUP_CODES = 'backup_codes',
  VOICE = 'voice',
  WEBAUTHN = 'webauthn'
}

/**
 * Session status enumeration
 */
export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  IDLE = 'idle'
}

/**
 * Permission level enumeration
 */
export enum PermissionLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  UPDATE = 'update',
  DELETE = 'delete',
  ADMIN = 'admin',
  OWNER = 'owner',
  FULL = 'full'
}

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  MFA_INVALID = 'MFA_INVALID',
  MFA_EXPIRED = 'MFA_EXPIRED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DEVICE_NOT_TRUSTED = 'DEVICE_NOT_TRUSTED',
  LOCATION_BLOCKED = 'LOCATION_BLOCKED',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  BIOMETRIC_FAILED = 'BIOMETRIC_FAILED',
  CERTIFICATE_INVALID = 'CERTIFICATE_INVALID',
  SSO_ERROR = 'SSO_ERROR',
  OAUTH_ERROR = 'OAUTH_ERROR'
}

// ============================= AUTHENTICATION REQUESTS =============================

/**
 * Login request payload
 */
export interface LoginRequest extends BaseRequest {
  method: AuthMethod;
  provider?: OAuthProvider;
  credentials: LoginCredentials;
  mfa?: MFAChallenge;
  device?: DeviceFingerprint;
  options?: LoginOptions;
}

/**
 * Login credentials union type
 */
export type LoginCredentials = 
  | PasswordCredentials
  | OAuthCredentials
  | BiometricCredentials
  | CertificateCredentials
  | MagicLinkCredentials
  | APIKeyCredentials;

/**
 * Password-based credentials
 */
export interface PasswordCredentials {
  type: 'password';
  email?: EmailAddress;
  username?: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * OAuth credentials
 */
export interface OAuthCredentials {
  type: 'oauth';
  provider: OAuthProvider;
  code?: string;
  token?: string;
  state?: string;
  scope?: string[];
  redirectUri?: string;
}

/**
 * Biometric credentials
 */
export interface BiometricCredentials {
  type: 'biometric';
  method: 'fingerprint' | 'face' | 'voice' | 'iris' | 'palm' | 'retina';
  data: string;
  confidence: Percentage;
  liveness?: boolean;
  template?: string;
}

/**
 * Certificate credentials
 */
export interface CertificateCredentials {
  type: 'certificate';
  certificate: string;
  privateKey?: string;
  passphrase?: string;
  chain?: string[];
}

/**
 * Magic link credentials
 */
export interface MagicLinkCredentials {
  type: 'magic_link';
  token: string;
  email: EmailAddress;
  expiresAt: ISOTimestamp;
}

/**
 * API key credentials
 */
export interface APIKeyCredentials {
  type: 'api_key';
  apiKey: string;
  secret?: string;
  scope?: string[];
}

/**
 * MFA challenge structure
 */
export interface MFAChallenge {
  challengeId: UUID;
  type: MFAType;
  code: string;
  token?: string;
  backup?: boolean;
  trustDevice?: boolean;
}

/**
 * Login options
 */
export interface LoginOptions {
  rememberMe?: boolean;
  trustDevice?: boolean;
  sessionTimeout?: number;
  skipMFA?: boolean;
  requireMFA?: boolean;
  allowedMethods?: AuthMethod[];
  redirectUri?: string;
  state?: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest extends BaseRequest {
  user: UserRegistration;
  verification: VerificationRequirements;
  consent: ConsentData;
  invitation?: InvitationData;
  options?: RegistrationOptions;
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: EmailAddress;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: PhoneNumber;
  dateOfBirth?: string;
  timezone?: string;
  locale?: string;
  avatar?: string;
  customFields?: Record<string, any>;
}

/**
 * Verification requirements
 */
export interface VerificationRequirements {
  email: boolean;
  phone?: boolean;
  identity?: boolean;
  captcha?: string;
  recaptcha?: string;
  hcaptcha?: string;
}

/**
 * Consent data
 */
export interface ConsentData {
  terms: ConsentItem;
  privacy: ConsentItem;
  marketing?: ConsentItem;
  cookies?: ConsentItem;
  dataProcessing?: ConsentItem;
}

/**
 * Consent item
 */
export interface ConsentItem {
  accepted: boolean;
  version: string;
  timestamp: ISOTimestamp;
  ip: string;
  userAgent: string;
  method: 'click' | 'signature' | 'voice' | 'biometric';
}

/**
 * Invitation data
 */
export interface InvitationData {
  token: string;
  invitedBy: UUID;
  organizationId?: UUID;
  role?: string;
  permissions?: string[];
  expiresAt: ISOTimestamp;
}

/**
 * Registration options
 */
export interface RegistrationOptions {
  autoLogin?: boolean;
  sendWelcomeEmail?: boolean;
  requireVerification?: boolean;
  skipPasswordValidation?: boolean;
  customRedirect?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// ============================= AUTHENTICATION RESPONSES =============================

/**
 * Authentication response
 */
export interface AuthResponse extends BaseResponse<AuthData> {
  tokens?: TokenPair;
  session?: SessionInfo;
  user?: AuthenticatedUser;
  mfa?: MFASetup;
  device?: DeviceStatus;
  security?: SecurityStatus;
  nextStep?: AuthStep;
}

/**
 * Authentication data
 */
export interface AuthData {
  authenticated: boolean;
  userId: UUID;
  sessionId: UUID;
  method: AuthMethod;
  provider?: OAuthProvider;
  mfaEnabled: boolean;
  deviceTrusted: boolean;
  firstLogin: boolean;
  lastLogin?: ISOTimestamp;
  expiresAt: ISOTimestamp;
}

/**
 * Token pair for JWT authentication
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn: number;
  scope: string[];
  issuedAt: ISOTimestamp;
  expiresAt: ISOTimestamp;
  refreshExpiresAt: ISOTimestamp;
  jti: UUID;
}

/**
 * Session information
 */
export interface SessionInfo {
  sessionId: UUID;
  userId: UUID;
  status: SessionStatus;
  device: DeviceInfo;
  location: LocationInfo;
  ipAddress: string;
  userAgent: string;
  fingerprint: string;
  startTime: ISOTimestamp;
  lastActivity: ISOTimestamp;
  expiresAt: ISOTimestamp;
  idleTimeout: number;
  maxDuration: number;
  trusted: boolean;
  mfaVerified: boolean;
  riskScore: number;
  flags: string[];
  metadata: Record<string, any>;
}

/**
 * Authenticated user information
 */
export interface AuthenticatedUser {
  id: UUID;
  email: EmailAddress;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: string;
  permissions: Permission[];
  organizations: UserOrganization[];
  preferences: UserPreferences;
  security: UserSecurity;
  profile: UserProfile;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: ISOTimestamp;
  lastPasswordChange?: ISOTimestamp;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * MFA setup information
 */
export interface MFASetup {
  enabled: boolean;
  methods: MFAMethod[];
  backupCodes: string[];
  recoveryOptions: RecoveryOption[];
  nextVerification?: ISOTimestamp;
  grace: boolean;
  graceExpiresAt?: ISOTimestamp;
}

/**
 * MFA method configuration
 */
export interface MFAMethod {
  type: MFAType;
  enabled: boolean;
  verified: boolean;
  identifier: string;
  qrCode?: string;
  secret?: string;
  setupAt: ISOTimestamp;
  lastUsed?: ISOTimestamp;
  backupCodes?: string[];
  trustLevel: number;
  metadata: Record<string, any>;
}

/**
 * Recovery option
 */
export interface RecoveryOption {
  type: 'email' | 'sms' | 'security_questions' | 'backup_codes' | 'admin_override';
  enabled: boolean;
  identifier?: string;
  verified: boolean;
  lastUsed?: ISOTimestamp;
}

/**
 * Device status
 */
export interface DeviceStatus {
  trusted: boolean;
  recognized: boolean;
  firstSeen: ISOTimestamp;
  lastSeen: ISOTimestamp;
  riskScore: number;
  flags: string[];
  metadata: Record<string, any>;
}

/**
 * Security status
 */
export interface SecurityStatus {
  riskScore: number;
  threats: SecurityThreat[];
  recommendations: SecurityRecommendation[];
  compliance: ComplianceStatus;
  audit: AuditSummary;
  monitoring: MonitoringStatus;
}

/**
 * Authentication step for multi-step flows
 */
export interface AuthStep {
  step: string;
  required: boolean;
  completed: boolean;
  data?: Record<string, any>;
  nextUrl?: string;
  expiresAt?: ISOTimestamp;
}

// ============================= AUTHORIZATION TYPES =============================

/**
 * Permission definition
 */
export interface Permission {
  id: UUID;
  name: string;
  resource: string;
  action: string;
  level: PermissionLevel;
  scope?: string;
  conditions?: PermissionCondition[];
  inherited?: boolean;
  grantedBy?: UUID;
  grantedAt?: ISOTimestamp;
  expiresAt?: ISOTimestamp;
  metadata: Record<string, any>;
}

/**
 * Permission condition for conditional access
 */
export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater' | 'less' | 'regex';
  value: any;
  logicalOperator?: 'and' | 'or';
  caseSensitive?: boolean;
}

/**
 * Role definition
 */
export interface Role {
  id: UUID;
  name: string;
  displayName: string;
  description: string;
  permissions: UUID[];
  inherits?: UUID[];
  level: number;
  scope: 'global' | 'organization' | 'project' | 'custom';
  isDefault: boolean;
  isSystem: boolean;
  assignable: boolean;
  deletable: boolean;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  metadata: Record<string, any>;
}

/**
 * Authorization request
 */
export interface AuthorizationRequest extends BaseRequest {
  userId: UUID;
  resource: string;
  action: string;
  context?: AuthorizationContext;
  options?: AuthorizationOptions;
}

/**
 * Authorization context
 */
export interface AuthorizationContext {
  organizationId?: UUID;
  projectId?: UUID;
  resourceId?: string;
  resourceType?: string;
  environment?: string;
  ip?: string;
  userAgent?: string;
  time?: ISOTimestamp;
  location?: LocationInfo;
  device?: DeviceInfo;
  session?: SessionInfo;
  attributes?: Record<string, any>;
}

/**
 * Authorization options
 */
export interface AuthorizationOptions {
  checkInherited?: boolean;
  checkDelegated?: boolean;
  includeExpired?: boolean;
  reasonRequired?: boolean;
  auditLog?: boolean;
  riskAssessment?: boolean;
  cacheResult?: boolean;
  cacheTtl?: number;
}

/**
 * Authorization response
 */
export interface AuthorizationResponse extends BaseResponse<AuthorizationData> {
  granted: boolean;
  permissions: Permission[];
  roles: Role[];
  reason?: string;
  evidence?: AuthorizationEvidence;
  restrictions?: AuthorizationRestriction[];
  audit?: AuditInfo;
  risk?: RiskAssessment;
}

/**
 * Authorization data
 */
export interface AuthorizationData {
  allowed: boolean;
  level: PermissionLevel;
  scope: string[];
  conditions: PermissionCondition[];
  expires?: ISOTimestamp;
  delegated?: boolean;
  inherited?: boolean;
  source: 'role' | 'permission' | 'policy' | 'override';
}

/**
 * Authorization evidence
 */
export interface AuthorizationEvidence {
  source: string;
  type: 'role' | 'permission' | 'policy' | 'rule' | 'override';
  id: UUID;
  name: string;
  level: PermissionLevel;
  conditions: PermissionCondition[];
  metadata: Record<string, any>;
}

/**
 * Authorization restriction
 */
export interface AuthorizationRestriction {
  type: 'time' | 'location' | 'device' | 'ip' | 'context' | 'quota' | 'rate';
  condition: string;
  value: any;
  message: string;
  active: boolean;
  expiresAt?: ISOTimestamp;
}

// ============================= SECURITY TYPES =============================

/**
 * Device fingerprint for tracking and trust
 */
export interface DeviceFingerprint {
  deviceId: string;
  fingerprint: string;
  components: FingerprintComponent[];
  confidence: Percentage;
  stable: boolean;
  entropy: number;
  version: string;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Fingerprint component
 */
export interface FingerprintComponent {
  key: string;
  value: string;
  weight: number;
  stable: boolean;
  entropy: number;
}

/**
 * Security threat
 */
export interface SecurityThreat {
  id: UUID;
  type: 'brute_force' | 'credential_stuffing' | 'account_takeover' | 'suspicious_login' | 'malware' | 'phishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  indicators: ThreatIndicator[];
  mitigation: string[];
  status: 'active' | 'mitigated' | 'false_positive' | 'investigating';
  detectedAt: ISOTimestamp;
  resolvedAt?: ISOTimestamp;
  metadata: Record<string, any>;
}

/**
 * Threat indicator
 */
export interface ThreatIndicator {
  type: 'ip' | 'user_agent' | 'geolocation' | 'device' | 'behavior' | 'pattern';
  value: string;
  confidence: Percentage;
  source: string;
  timestamp: ISOTimestamp;
}

/**
 * Security recommendation
 */
export interface SecurityRecommendation {
  id: UUID;
  type: 'enable_mfa' | 'update_password' | 'verify_device' | 'review_sessions' | 'security_audit';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  actions: RecommendationAction[];
  deadline?: ISOTimestamp;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Recommendation action
 */
export interface RecommendationAction {
  id: UUID;
  type: string;
  title: string;
  description: string;
  url?: string;
  parameters?: Record<string, any>;
  required: boolean;
  completed: boolean;
  completedAt?: ISOTimestamp;
}

/**
 * Compliance status
 */
export interface ComplianceStatus {
  overall: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  frameworks: ComplianceFramework[];
  score: Percentage;
  lastAssessment: ISOTimestamp;
  nextAssessment?: ISOTimestamp;
  violations: ComplianceViolation[];
  recommendations: ComplianceRecommendation[];
}

/**
 * Compliance framework
 */
export interface ComplianceFramework {
  name: string;
  version: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'unknown';
  score: Percentage;
  controls: ComplianceControl[];
  lastAssessment: ISOTimestamp;
  certificate?: string;
  expiresAt?: ISOTimestamp;
}

/**
 * Compliance control
 */
export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'partial' | 'not_applicable';
  evidence: string[];
  lastCheck: ISOTimestamp;
  nextCheck?: ISOTimestamp;
  responsible?: UUID;
  remediation?: string;
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  id: UUID;
  framework: string;
  control: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  impact: string;
  remediation: string;
  deadline?: ISOTimestamp;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
  assignedTo?: UUID;
  detectedAt: ISOTimestamp;
  resolvedAt?: ISOTimestamp;
}

/**
 * Compliance recommendation
 */
export interface ComplianceRecommendation {
  id: UUID;
  framework: string;
  control: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  benefit: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  timeline: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: UUID;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Audit summary
 */
export interface AuditSummary {
  total: number;
  recent: number;
  failed: number;
  suspicious: number;
  categories: AuditCategory[];
  trends: AuditTrend[];
  alerts: AuditAlert[];
}

/**
 * Audit category
 */
export interface AuditCategory {
  name: string;
  count: number;
  percentage: Percentage;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Audit trend
 */
export interface AuditTrend {
  period: string;
  count: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Audit alert
 */
export interface AuditAlert {
  id: UUID;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  count: number;
  threshold: number;
  status: 'active' | 'resolved' | 'suppressed';
  createdAt: ISOTimestamp;
  resolvedAt?: ISOTimestamp;
}

/**
 * Monitoring status
 */
export interface MonitoringStatus {
  enabled: boolean;
  coverage: Percentage;
  alerts: number;
  incidents: number;
  uptime: Percentage;
  responseTime: number;
  errorRate: Percentage;
  lastCheck: ISOTimestamp;
  nextCheck?: ISOTimestamp;
  metrics: MonitoringMetric[];
}

/**
 * Monitoring metric
 */
export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'degrading' | 'stable';
  timestamp: ISOTimestamp;
}

/**
 * Audit information
 */
export interface AuditInfo {
  logged: boolean;
  logId?: UUID;
  timestamp: ISOTimestamp;
  userId: UUID;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'partial';
  details: Record<string, any>;
}

/**
 * Risk assessment
 */
export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigation: string[];
  monitoring: boolean;
  expiresAt?: ISOTimestamp;
  assessedAt: ISOTimestamp;
  assessedBy: string;
}

/**
 * Risk factor
 */
export interface RiskFactor {
  type: string;
  description: string;
  impact: number;
  probability: number;
  score: number;
  weight: number;
  evidence: string[];
  mitigation?: string;
}

// ============================= ADDITIONAL TYPES =============================

/**
 * User organization membership
 */
export interface UserOrganization {
  id: UUID;
  name: string;
  slug: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinedAt: ISOTimestamp;
  lastActive?: ISOTimestamp;
  settings: OrganizationSettings;
}

/**
 * Organization settings
 */
export interface OrganizationSettings {
  notifications: boolean;
  visibility: 'public' | 'private' | 'internal';
  permissions: string[];
  restrictions: string[];
  preferences: Record<string, any>;
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  security: SecurityPreferences;
  accessibility: AccessibilityPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  security: boolean;
  marketing: boolean;
  digest: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'connections';
  activityVisibility: 'public' | 'private' | 'connections';
  searchVisibility: boolean;
  analyticsOptOut: boolean;
  dataProcessingConsent: boolean;
  thirdPartySharing: boolean;
}

/**
 * Security preferences
 */
export interface SecurityPreferences {
  sessionTimeout: number;
  mfaReminder: boolean;
  loginNotifications: boolean;
  deviceTrust: boolean;
  locationTracking: boolean;
  passwordReminder: boolean;
  securityEmails: boolean;
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  screenReader: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceControl: boolean;
  colorBlind: boolean;
  dyslexiaFont: boolean;
}

/**
 * User security configuration
 */
export interface UserSecurity {
  twoFactorEnabled: boolean;
  twoFactorMethods: MFAType[];
  trustedDevices: number;
  activeSessions: number;
  lastPasswordChange: ISOTimestamp;
  passwordStrength: 'weak' | 'fair' | 'good' | 'strong';
  securityQuestions: boolean;
  recoveryEmail?: EmailAddress;
  recoveryPhone?: PhoneNumber;
  loginAttempts: number;
  lockedUntil?: ISOTimestamp;
  riskScore: number;
  flags: SecurityFlag[];
}

/**
 * Security flag
 */
export interface SecurityFlag {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: ISOTimestamp;
  resolved: boolean;
  resolvedAt?: ISOTimestamp;
  resolvedBy?: UUID;
}

/**
 * User profile summary
 */
export interface UserProfile {
  completeness: Percentage;
  verified: boolean;
  publicFields: string[];
  privateFields: string[];
  lastUpdated: ISOTimestamp;
  profileViews: number;
  connectionCount: number;
  badges: string[];
  achievements: string[];
}

// ============================= EXPORTS =============================

export * from './auth-utils';
export * from './auth-validators';
export * from './auth-constants'; 