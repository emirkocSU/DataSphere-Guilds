/**
 * @fileoverview Enterprise-grade user and permission types.
 * Defines a rich, structured model for Role-Based Access Control (RBAC).
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'LEAD' | 'MEMBER' | 'GUEST';

export interface Permission {
  resource: string; // e.g., 'project', 'billing', 'user'
  action: string;   // e.g., 'create', 'read', 'update', 'delete'
  scope: 'own' | 'team' | 'org' | 'any'; // Defines the scope of the permission
}

export interface UserProfile {
  id: UUID;
  username: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  // Direct permissions are used for fine-grained access control beyond roles.
  directPermissions?: Permission[];
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  lastLogin?: ISOTimestamp;
}

export interface WorkerStats {
  tasksCompleted: number;
  approvalRate: number;
  totalEarnings: MoneyValue;
}
