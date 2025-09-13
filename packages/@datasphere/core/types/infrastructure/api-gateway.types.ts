/** @fileoverview Types for API Gateway configuration and routing. */
import { Uuid } from '../../types/common.types';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRoute {
  readonly routeId: Uuid;
  readonly path: string;
  readonly method: RouteMethod;
  readonly targetService: string; // e.g., 'user-service', 'task-service'
  readonly authenticationRequired: boolean;
  readonly authorizationRoles?: string[];
  readonly rateLimit?: { requests: number; perSeconds: number; };
}

export interface GatewayConfig {
  readonly configId: Uuid;
  readonly name: string;
  readonly routes: ApiRoute[];
  readonly globalRateLimit?: { requests: number; perSeconds: number; };
  readonly securityPolicies?: string[]; // e.g., 'IP_WHITELIST', 'JWT_VALIDATION'
}
