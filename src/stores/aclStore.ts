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
      userEntityType: null,
      isInitialized: false,

      // Actions
      setUserRole: (role: UserRole) => {
        set({ userRole: role })
      },

      setUserPermissions: (permissions: Permission[]) => {
        set({ userPermissions: permissions })
      },

      setUserEntityType: (entityType: string) => {
        set({ userEntityType: entityType })
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

      hasEntityType: (entityType: string): boolean => {
        const { userEntityType } = get()
        return userEntityType === entityType
      },

      hasAnyEntityType: (entityTypes: string[]): boolean => {
        const { userEntityType } = get()
        return userEntityType ? entityTypes.includes(userEntityType) : false
      },

      clearACL: () => {
        set({
          userRole: null,
          userPermissions: [],
          userEntityType: null,
          isInitialized: false
        })
      },

      initializeACL: (user: User) => {
        // Déterminer le rôle de l'utilisateur
        const userRole = user.role?.name as UserRole || null
        
        // Convertir les permissions string en enum Permission
        const userPermissions = user.permissions?.map(p => p as Permission) || []
        
        // Déterminer le type d'entité de l'utilisateur
        const userEntityType = user.entity?.entity_type?.code || null
        
        set({
          userRole,
          userPermissions,
          userEntityType,
          isInitialized: true
        })
      }
    }),
    {
      name: 'expert_0001_acl_storage',
      partialize: (state) => ({
        userRole: state.userRole,
        userPermissions: state.userPermissions,
        userEntityType: state.userEntityType,
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

// Hooks pour vérifier les types d'entités
export const useUserEntityType = () => useACLStore((state) => state.userEntityType)

export const useHasEntityType = (entityType: string) => {
  return useACLStore((state) => state.hasEntityType(entityType))
}

export const useHasAnyEntityType = (entityTypes: string[]) => {
  return useACLStore((state) => state.hasAnyEntityType(entityTypes))
}

// Re-exports des types pour faciliter l'import
export { Permission, UserRole } from '@/types/auth'
export { EntityTypeEnum } from '@/types/global-types' 