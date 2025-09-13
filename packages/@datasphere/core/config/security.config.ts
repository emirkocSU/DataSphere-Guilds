
import { z } from 'zod';

/**
 * Schema for CORS (Cross-Origin Resource Sharing) configuration.
 */
const CorsConfigSchema = z.object({
  /** Origins that are allowed to make requests. Use '["*"]' for public APIs (with caution). */
  allowedOrigins: z.array(z.string()),
  /** HTTP methods that are allowed. */
  allowedMethods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
  /** HTTP headers that can be used in the actual request. */
  allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization']),
  /** Whether to allow credentials (e.g., cookies, authorization headers). */
  allowCredentials: z.boolean().default(true),
});

/**
 * Schema for JWT (JSON Web Token) configuration.
 */
const JwtConfigSchema = z.object({
  /** The secret key used to sign the tokens. Should be a long, random string. */
  secret: z.string(),
  /** The issuer of the token (e.g., 'datasphere-api'). */
  issuer: z.string(),
  /** The audience of the token (e.g., 'datasphere-app'). */
  audience: z.string(),
  /** Expiration time for the access token (e.g., '15m', '1h'). */
  accessTokenExpiresIn: z.string(),
  /** Expiration time for the refresh token (e.g., '7d', '30d'). */
  refreshTokenExpiresIn: z.string(),
});

/**
 * Schema for password policy configuration.
 */
const PasswordPolicySchema = z.object({
  minLength: z.number().int().min(8).default(12),
  requireUppercase: z.boolean().default(true),
  requireLowercase: z.boolean().default(true),
  requireNumber: z.boolean().default(true),
  requireSymbol: z.boolean().default(true),
});

/**
 * Main schema for the security configuration file.
 */
export const SecurityConfigSchema = z.object({
  cors: CorsConfigSchema,
  jwt: JwtConfigSchema,
  passwordPolicy: PasswordPolicySchema,
  /** Number of salt rounds for bcrypt hashing. */
  saltRounds: z.number().int().min(10).default(12),
});

export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;

/**
 * Default security configuration.
 * Provides a strong baseline. IMPORTANT: Override sensitive values like jwt.secret
 * and cors.allowedOrigins in environment-specific configurations.
 */
export const defaultSecurityConfig: SecurityConfig = {
  cors: {
    allowedOrigins: ['http://localhost:3000', 'https://app.datasphere.com'], // Example, should be overridden
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    allowCredentials: true,
  },
  jwt: {
    secret: 'REPLACE_THIS_WITH_A_SECURE_SECRET_FROM_ENV', // CRITICAL: Override this
    issuer: 'datasphere-api',
    audience: 'datasphere-app',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
  },
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSymbol: true,
  },
  saltRounds: 12,
};
