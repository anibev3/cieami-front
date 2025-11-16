import { ReactNode } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission, UserRole } from '@/types/auth'
import { EntityTypeEnum } from '@/types/global-types'

/**
 * Options pour protéger une route
 */
export interface RouteProtectionOptions {
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
  requiredEntityType?: string
  requiredEntityTypes?: string[]
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Helper pour créer un composant de route protégé
 * 
 * @example
 * ```tsx
 * export const Route = createFileRoute('/_authenticated/assignments/')({
 *   component: createProtectedRoute(AssignmentsPage, {
 *     requiredPermission: Permission.VIEW_ASSIGNMENT,
 *     requiredEntityTypes: [EntityTypeEnum.MAIN_ORGANIZATION, EntityTypeEnum.ORGANIZATION]
 *   })
 * })
 * ```
 */
export function createProtectedRoute(
  Component: React.ComponentType,
  options: RouteProtectionOptions
) {
  return function ProtectedRouteComponent() {
    return (
      <ProtectedRoute
        requiredPermission={options.requiredPermission}
        requiredPermissions={options.requiredPermissions}
        requireAllPermissions={options.requireAllPermissions}
        requiredRole={options.requiredRole}
        requiredRoles={options.requiredRoles}
        requireAllRoles={options.requireAllRoles}
        requiredEntityType={options.requiredEntityType}
        requiredEntityTypes={options.requiredEntityTypes}
        fallback={options.fallback}
        redirectTo={options.redirectTo}
      >
        <Component />
      </ProtectedRoute>
    )
  }
}

/**
 * Helper pour créer une route protégée avec une permission
 */
export function createPermissionProtectedRoute(
  Component: React.ComponentType,
  permission: Permission,
  options?: Omit<RouteProtectionOptions, 'requiredPermission'>
) {
  return createProtectedRoute(Component, {
    requiredPermission: permission,
    ...options
  })
}

/**
 * Helper pour créer une route protégée avec plusieurs permissions (au moins une)
 */
export function createAnyPermissionProtectedRoute(
  Component: React.ComponentType,
  permissions: Permission[],
  options?: Omit<RouteProtectionOptions, 'requiredPermissions' | 'requireAllPermissions'>
) {
  return createProtectedRoute(Component, {
    requiredPermissions: permissions,
    requireAllPermissions: false,
    ...options
  })
}

/**
 * Helper pour créer une route protégée avec plusieurs permissions (toutes requises)
 */
export function createAllPermissionsProtectedRoute(
  Component: React.ComponentType,
  permissions: Permission[],
  options?: Omit<RouteProtectionOptions, 'requiredPermissions' | 'requireAllPermissions'>
) {
  return createProtectedRoute(Component, {
    requiredPermissions: permissions,
    requireAllPermissions: true,
    ...options
  })
}

/**
 * Helper pour créer une route protégée avec un rôle
 */
export function createRoleProtectedRoute(
  Component: React.ComponentType,
  role: UserRole,
  options?: Omit<RouteProtectionOptions, 'requiredRole'>
) {
  return createProtectedRoute(Component, {
    requiredRole: role,
    ...options
  })
}

/**
 * Helper pour créer une route protégée avec plusieurs rôles (au moins un)
 */
export function createAnyRoleProtectedRoute(
  Component: React.ComponentType,
  roles: UserRole[],
  options?: Omit<RouteProtectionOptions, 'requiredRoles' | 'requireAllRoles'>
) {
  return createProtectedRoute(Component, {
    requiredRoles: roles,
    requireAllRoles: false,
    ...options
  })
}

// Re-exports pour faciliter l'utilisation
export { Permission, UserRole } from '@/types/auth'
export { EntityTypeEnum } from '@/types/global-types'

