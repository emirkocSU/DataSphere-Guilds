/**
 * @fileoverview Enterprise Authentication System - Main Exports
 */

// Core Services
export { AuthenticationService, createAuthenticationService } from './service';
export { JWTManager, createJWTManager } from './jwt-manager';
export { OAuthProvider, createOAuthProvider } from './oauth-provider';
export { MFAService, createMFAService } from './mfa-service';
export { BiometricAuth, createBiometricAuth } from './biometric-auth';
export { SessionManager, createSessionManager } from './session-manager';
export { PBACEngine, createPBACEngine } from './pbac-engine';

// Types
export type * from './types';