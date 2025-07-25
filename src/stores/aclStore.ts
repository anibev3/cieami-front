import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole, Permission, ACLState, ACLActions, User } from '@/types/auth'
import { aclService } from '@/services/aclService'

interface ACLStore extends ACLState, ACLActions {}

export const useACLStore = create<ACLStore>()(
  persist(
    (set, get) => ({
      // État initial
      userRole: null,
      userPermissions: [],
      isInitialized: false,

      // Actions
      setUserRole: (role: UserRole) => {
        set({ userRole: role })
      },

      setUserPermissions: (permissions: Permission[]) => {
        set({ userPermissions: permissions })
      },

      hasPermission: (permission: Permission): boolean => {
        const { userPermissions } = get()
        return aclService.hasPermission(userPermissions, permission)
      },

      hasAnyPermission: (permissions: Permission[]): boolean => {
        const { userPermissions } = get()
        return aclService.hasAnyPermission(userPermissions, permissions)
      },

      hasAllPermissions: (permissions: Permission[]): boolean => {
        const { userPermissions } = get()
        return aclService.hasAllPermissions(userPermissions, permissions)
      },

      hasRole: (role: UserRole): boolean => {
        const { userRole } = get()
        return aclService.hasRole(userRole, role)
      },

      hasAnyRole: (roles: UserRole[]): boolean => {
        const { userRole } = get()
        return aclService.hasAnyRole(userRole, roles)
      },

      hasAllRoles: (roles: UserRole[]): boolean => {
        const { userRole } = get()
        return userRole ? roles.includes(userRole) : false
      },

      clearACL: () => {
        set({
          userRole: null,
          userPermissions: [],
          isInitialized: false
        })
      },

      initializeACL: (user: User) => {
        // Déterminer le rôle de l'utilisateur
        const userRole = user.role?.name as UserRole || null
        
        // Convertir les permissions string en enum Permission
        const userPermissions = user.permissions?.map(p => p as Permission) || []
        
        set({
          userRole,
          userPermissions,
          isInitialized: true
        })
      }
    }),
    {
      name: 'expert_0001_acl_storage',
      partialize: (state) => ({
        userRole: state.userRole,
        userPermissions: state.userPermissions,
        isInitialized: state.isInitialized
      })
    }
  )
)

// Hooks utilitaires pour l'ACL
export const useACL = () => useACLStore((state) => state)
export const useUserRole = () => useACLStore((state) => state.userRole)
export const useUserPermissions = () => useACLStore((state) => state.userPermissions)
export const useIsACLInitialized = () => useACLStore((state) => state.isInitialized)

// Hooks pour vérifier les permissions
export const useHasPermission = (permission: Permission) => {
  return useACLStore((state) => state.hasPermission(permission))
}

export const useHasAnyPermission = (permissions: Permission[]) => {
  return useACLStore((state) => state.hasAnyPermission(permissions))
}

export const useHasAllPermissions = (permissions: Permission[]) => {
  return useACLStore((state) => state.hasAllPermissions(permissions))
}

// Hooks pour vérifier les rôles
export const useHasRole = (role: UserRole) => {
  return useACLStore((state) => state.hasRole(role))
}

export const useHasAnyRole = (roles: UserRole[]) => {
  return useACLStore((state) => state.hasAnyRole(roles))
}

export const useHasAllRoles = (roles: UserRole[]) => {
  return useACLStore((state) => state.hasAllRoles(roles))
}

// Re-exports des types pour faciliter l'import
export { Permission, UserRole } from '@/types/auth' 