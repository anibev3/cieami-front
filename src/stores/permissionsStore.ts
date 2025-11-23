import { create } from 'zustand'
import { permissionService } from '@/services/permissionService'
import {
  Permission,
  Role,
  GivePermissionToRolePayload,
  RevokePermissionFromRolePayload,
  GivePermissionToUserPayload,
  RevokePermissionFromUserPayload,
} from '@/types/permissions'
import { toast } from 'sonner'

interface PermissionsState {
  // État
  permissions: Permission[]
  roles: Role[]
  loading: boolean
  error: string | null
  selectedRole: Role | null
  selectedUserId: string | null

  // Actions
  fetchPermissions: () => Promise<void>
  fetchRoles: () => Promise<void>
  givePermissionToRole: (
    roleId: string,
    payload: GivePermissionToRolePayload
  ) => Promise<void>
  revokePermissionFromRole: (
    roleId: string,
    payload: RevokePermissionFromRolePayload
  ) => Promise<void>
  givePermissionToUser: (
    userId: string,
    payload: GivePermissionToUserPayload
  ) => Promise<void>
  revokePermissionFromUser: (
    userId: string,
    payload: RevokePermissionFromUserPayload
  ) => Promise<void>
  setSelectedRole: (role: Role | null) => void
  setSelectedUserId: (userId: string | null) => void
  clearError: () => void
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  // État initial
  permissions: [],
  roles: [],
  loading: false,
  error: null,
  selectedRole: null,
  selectedUserId: null,

  // Actions
  fetchPermissions: async () => {
    try {
      set({ loading: true, error: null })
      const response = await permissionService.getAllPermissions()
      set({ permissions: response.data, loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des permissions'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  fetchRoles: async () => {
    try {
      set({ loading: true, error: null })
      const response = await permissionService.getAllRoles()
      set({ roles: response.data, loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des rôles'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  givePermissionToRole: async (roleId, payload) => {
    try {
      set({ loading: true, error: null })
      await permissionService.givePermissionToRole(roleId, payload)
      toast.success('Permissions attribuées avec succès')
      // Rafraîchir les rôles
      await get().fetchRoles()
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de l\'attribution des permissions'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  revokePermissionFromRole: async (roleId, payload) => {
    try {
      set({ loading: true, error: null })
      await permissionService.revokePermissionFromRole(roleId, payload)
      toast.success('Permissions retirées avec succès')
      // Rafraîchir les rôles
      await get().fetchRoles()
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du retrait des permissions'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  givePermissionToUser: async (userId, payload) => {
    try {
      set({ loading: true, error: null })
      await permissionService.givePermissionToUser(userId, payload)
      toast.success('Permissions attribuées avec succès')
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de l\'attribution des permissions'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  revokePermissionFromUser: async (userId, payload) => {
    try {
      set({ loading: true, error: null })
      await permissionService.revokePermissionFromUser(userId, payload)
      toast.success('Permissions retirées avec succès')
      set({ loading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du retrait des permissions'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedRole: (role) => set({ selectedRole: role }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  clearError: () => set({ error: null }),
}))

