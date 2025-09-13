/**
 * @fileoverview Enterprise-grade permission checker with RBAC and resource ownership.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UserProfile, Permission, UserRole } from '../../types/business/user.types';
import { EnrichedSecurityContext } from '../../types/security/auth.types';
import { CacheManager } from '../cache/manager';

// In a real system, this would be a more sophisticated service that fetches
// role-to-permission mappings from a database or a configuration service.
class RoleService {
  private rolePermissions: Map<UserRole, Permission[]>;

  constructor() {
    // This is a mock configuration for demonstration.
    this.rolePermissions = new Map([
      ['SUPER_ADMIN', [{ resource: '*', action: '*', scope: 'any' }]],
      ['ADMIN', [
        { resource: 'user', action: '*', scope: 'org' },
        { resource: 'project', action: '*', scope: 'org' },
      ]],
      ['MANAGER', [
        { resource: 'project', action: 'read', scope: 'team' },
        { resource: 'project', action: 'update', scope: 'team' },
      ]],
      ['MEMBER', [{ resource: 'project', action: 'read', scope: 'own' }]],
    ]);
  }

  async getPermissionsForRoles(roles: UserRole[]): Promise<Permission[]> {
    const permissions: Permission[] = [];
    for (const role of roles) {
      permissions.push(...(this.rolePermissions.get(role) || []));
    }
    return permissions;
  }
}

export class PermissionChecker {
  private roleService: RoleService;
  private cache: CacheManager;

  constructor(cacheManager: CacheManager) {
    this.roleService = new RoleService();
    this.cache = cacheManager;
  }

  public async getEffectivePermissions(securityContext: EnrichedSecurityContext): Promise<Set<Permission>> {
    const cacheKey = `permissions:${securityContext.user.id}`;
    const cachedPermissions = await this.cache.get<Permission[]>(cacheKey);

    if (cachedPermissions) {
      return new Set(cachedPermissions);
    }

    const rolePermissions = await this.roleService.getPermissionsForRoles(
      Array.from(securityContext.roles)
    );
    const directPermissions = securityContext.user.directPermissions || [];
    
    const allPermissions = [...rolePermissions, ...directPermissions];
    await this.cache.set(cacheKey, allPermissions, 3600); // Cache for 1 hour

    return new Set(allPermissions);
  }

  public async hasPermission(
    securityContext: EnrichedSecurityContext,
    required: Permission
  ): Promise<boolean> {
    const effectivePermissions = await this.getEffectivePermissions(securityContext);

    for (const p of effectivePermissions) {
      const resourceMatch = p.resource === '*' || p.resource === required.resource;
      const actionMatch = p.action === '*' || p.action === required.action;
      const scopeMatch = p.scope === 'any' || p.scope === required.scope;

      if (resourceMatch && actionMatch && scopeMatch) {
        return true;
      }
    }

    return false;
  }

  public async canAccessResource(
    securityContext: EnrichedSecurityContext,
    resourceType: string,
    resourceId: string,
    action: string
  ): Promise<boolean> {
    // Check for general permission first.
    const hasGeneralPermission = await this.hasPermission(securityContext, {
      resource: resourceType,
      action,
      scope: 'any', // This check is simplified; a real system would be more granular.
    });

    if (hasGeneralPermission) {
      return true;
    }

    // TODO: Implement ownership-based access control.
    // This would involve fetching the resource from a database and checking
    // if the user is the owner or part of the team that owns the resource.
    
    return false;
  }
} 