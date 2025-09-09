import { create } from 'zustand'
import { Role, RoleFilters, roleService } from '@/services/roleService'
import { toast } from 'sonner'

interface RoleState {
  // État
  roles: Role[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchRoles: (filters?: RoleFilters) => Promise<void>
  clearError: () => void
}

export const useRoleStore = create<RoleState>((set, get) => ({
  // État initial
  roles: [],
  loading: false,
  error: null,

  // Actions
  fetchRoles: async (filters?: RoleFilters) => {
    try {
      set({ loading: true, error: null })
      const roles = await roleService.getAllRoles(filters)
      set({ roles, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des rôles'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  clearError: () => set({ error: null })
}))
