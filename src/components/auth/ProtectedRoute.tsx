import { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useIsAuthenticated, useUser } from '@/stores/authStore'
import { useHasPermission, useHasAnyPermission, useHasAllPermissions, useHasRole, useHasAnyRole, useHasAllRoles, useHasEntityType, useHasAnyEntityType, Permission, UserRole } from '@/stores/aclStore'
import Forbidden from '@/features/errors/forbidden'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
  requiredEntityType?: string
  requiredEntityTypes?: string[]
  requireAllEntityTypes?: boolean
  fallback?: ReactNode
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = false,
  requiredRole,
  requiredRoles,
  requireAllRoles = false,
  requiredEntityType,
  requiredEntityTypes,
  requireAllEntityTypes = false,
  fallback,
  redirectTo = '/sign-in'
}: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated()
  const user = useUser()
  
  // Hooks ACL
  const hasPermission = useHasPermission(requiredPermission!)
  const hasAnyPermission = useHasAnyPermission(requiredPermissions || [])
  const hasAllPermissions = useHasAllPermissions(requiredPermissions || [])
  const hasRole = useHasRole(requiredRole!)
  const hasAnyRole = useHasAnyRole(requiredRoles || [])
  const hasAllRoles = useHasAllRoles(requiredRoles || [])
  const hasEntityType = useHasEntityType(requiredEntityType!)
  const hasAnyEntityType = useHasAnyEntityType(requiredEntityTypes || [])

  // Vérifier l'authentification
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />
  }

  // Vérifier les permissions
  if (requiredPermission && !hasPermission) {
    return fallback ? <>{fallback}</> : <Forbidden />
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAllPermissions && !hasAllPermissions) {
      return fallback ? <>{fallback}</> : <Forbidden />
    }
    if (!requireAllPermissions && !hasAnyPermission) {
      return fallback ? <>{fallback}</> : <Forbidden />
    }
  }

  // Vérifier les rôles
  if (requiredRole && !hasRole) {
    return fallback ? <>{fallback}</> : <Forbidden />
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (requireAllRoles && !hasAllRoles) {
      return fallback ? <>{fallback}</> : <Forbidden />
    }
    if (!requireAllRoles && !hasAnyRole) {
      return fallback ? <>{fallback}</> : <Forbidden />
    }
  }

  // Vérifier les types d'entités
  if (requiredEntityType && !hasEntityType) {
    return fallback ? <>{fallback}</> : <Forbidden />
  }

  if (requiredEntityTypes && requiredEntityTypes.length > 0) {
    // requireAllEntityTypes = false signifie "au moins un des types" (par défaut)
    // requireAllEntityTypes = true n'a pas de sens car un utilisateur n'a qu'un seul type d'entité
    // Donc on traite toujours comme "au moins un des types"
    if (!hasAnyEntityType) {
      return fallback ? <>{fallback}</> : <Forbidden />
    }
  }

  return <>{children}</>
}

// Composants utilitaires pour des cas d'usage courants
export const RequirePermission = ({ permission, children, ...props }: Omit<ProtectedRouteProps, 'requiredPermission'> & { permission: Permission }) => (
  <ProtectedRoute requiredPermission={permission} {...props}>
    {children}
  </ProtectedRoute>
)

export const RequireAnyPermission = ({ permissions, children, ...props }: Omit<ProtectedRouteProps, 'requiredPermissions'> & { permissions: Permission[] }) => (
  <ProtectedRoute requiredPermissions={permissions} requireAllPermissions={false} {...props}>
    {children}
  </ProtectedRoute>
)

export const RequireAllPermissions = ({ permissions, children, ...props }: Omit<ProtectedRouteProps, 'requiredPermissions'> & { permissions: Permission[] }) => (
  <ProtectedRoute requiredPermissions={permissions} requireAllPermissions={true} {...props}>
    {children}
  </ProtectedRoute>
)

export const RequireRole = ({ role, children, ...props }: Omit<ProtectedRouteProps, 'requiredRole'> & { role: UserRole }) => (
  <ProtectedRoute requiredRole={role} {...props}>
    {children}
  </ProtectedRoute>
)

export const RequireAnyRole = ({ roles, children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'> & { roles: UserRole[] }) => (
  <ProtectedRoute requiredRoles={roles} requireAllRoles={false} {...props}>
    {children}
  </ProtectedRoute>
)

export const RequireAllRoles = ({ roles, children, ...props }: Omit<ProtectedRouteProps, 'requiredRoles'> & { roles: UserRole[] }) => (
  <ProtectedRoute requiredRoles={roles} requireAllRoles={true} {...props}>
    {children}
  </ProtectedRoute>
) 