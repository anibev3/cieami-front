import { ReactNode } from 'react'
import { useHasPermission, useHasAnyPermission, useHasAllPermissions, useHasRole, useHasAnyRole, useHasAllRoles, Permission, UserRole } from '@/stores/aclStore'

interface PermissionGateProps {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAllPermissions?: boolean
  role?: UserRole
  roles?: UserRole[]
  requireAllRoles?: boolean
  fallback?: ReactNode
}

export const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAllPermissions = false,
  role,
  roles,
  requireAllRoles = false,
  fallback = null
}: PermissionGateProps) => {
  // Hooks ACL
  const hasPermission = useHasPermission(permission!)
  const hasAnyPermission = useHasAnyPermission(permissions || [])
  const hasAllPermissions = useHasAllPermissions(permissions || [])
  const hasRole = useHasRole(role!)
  const hasAnyRole = useHasAnyRole(roles || [])
  const hasAllRoles = useHasAllRoles(roles || [])

  // Vérifier les permissions
  if (permission && !hasPermission) {
    return <div className="">{fallback}</div>
  }

  if (permissions && permissions.length > 0) {
    if (requireAllPermissions && !hasAllPermissions) {
      return <div className="">{fallback}</div>
    }
    if (!requireAllPermissions && !hasAnyPermission) {
      return <div className="">{fallback}</div>
    }
  }

  // Vérifier les rôles
  if (role && !hasRole) {
    return <div className="">{fallback}</div>
  }

  if (roles && roles.length > 0) {
    if (requireAllRoles && !hasAllRoles) {
      return <div className="">{fallback}</div>
    }
    if (!requireAllRoles && !hasAnyRole) {
      return <div className="">{fallback}</div>
    }
  }

  return <div className="">{children}</div>
}

// Composants utilitaires pour des cas d'usage courants
export const RequirePermissionGate = ({ permission, children, ...props }: Omit<PermissionGateProps, 'permission'> & { permission: Permission }) => (
  <PermissionGate permission={permission} {...props}>
    {children}
  </PermissionGate>
)

export const RequireAnyPermissionGate = ({ permissions, children, ...props }: Omit<PermissionGateProps, 'permissions'> & { permissions: Permission[] }) => (
  <PermissionGate permissions={permissions} requireAllPermissions={false} {...props}>
    {children}
  </PermissionGate>
)

export const RequireAllPermissionsGate = ({ permissions, children, ...props }: Omit<PermissionGateProps, 'permissions'> & { permissions: Permission[] }) => (
  <PermissionGate permissions={permissions} requireAllPermissions={true} {...props}>
    {children}
  </PermissionGate>
)

export const RequireRoleGate = ({ role, children, ...props }: Omit<PermissionGateProps, 'role'> & { role: UserRole }) => (
  <PermissionGate role={role} {...props}>
    {children}
  </PermissionGate>
)

export const RequireAnyRoleGate = ({ roles, children, ...props }: Omit<PermissionGateProps, 'roles'> & { roles: UserRole[] }) => (
  <PermissionGate roles={roles} requireAllRoles={false} {...props}>
    {children}
  </PermissionGate>
)

export const RequireAllRolesGate = ({ roles, children, ...props }: Omit<PermissionGateProps, 'roles'> & { roles: UserRole[] }) => (
  <PermissionGate roles={roles} requireAllRoles={true} {...props}>
    {children}
  </PermissionGate>
) 