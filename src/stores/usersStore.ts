import { create } from 'zustand'
import { User, CreateUserData, UpdateUserData, UserFilters } from '@/types/administration'
import { userService } from '@/services/userService'
import { toast } from 'sonner'

interface UsersState {
  // État
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
  
  // Pagination et filtres
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    from: number
    to: number
  }
  filters: {
    search: string
    entity: string
    role: string
  }
  
  // Actions
  fetchUsers: (filters?: UserFilters) => Promise<void>
  createUser: (data: CreateUserData) => Promise<void>
  updateUser: (id: number, data: UpdateUserData) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  enableUser: (id: number) => Promise<void>
  disableUser: (id: number) => Promise<void>
  resetUser: (id: number) => Promise<void>
  setSelectedUser: (user: User | null) => void
  setFilters: (filters: Partial<UserFilters>) => void
  clearError: () => void
}

export const useUsersStore = create<UsersState>((set) => ({
  // État initial
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  
  // Pagination et filtres
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
    from: 0,
    to: 0
  },
  filters: {
    search: '',
    entity: '',
    role: ''
  },

  // Actions
  fetchUsers: async (filters?: UserFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await userService.getAll(filters)
      set({ 
        users: response.data, 
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
          from: response.meta.from,
          to: response.meta.to
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createUser: async (data: CreateUserData) => {
    try {
      set({ loading: true })
      const newUser = await userService.create(data)
      set(state => ({ 
        users: [...state.users, newUser], 
        loading: false 
      }))
      toast.success('Utilisateur créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateUser: async (id: number, data: UpdateUserData) => {
    try {
      set({ loading: true })
      const updatedUser = await userService.update(id, data)
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? updatedUser : user
        ),
        loading: false
      }))
      toast.success('Utilisateur mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteUser: async (id: number) => {
    try {
      set({ loading: true })
      await userService.delete(id)
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }))
      toast.success('Utilisateur supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableUser: async (id: number) => {
    try {
      set({ loading: true })
      const updatedUser = await userService.enable(id)
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? {
            ...user,
            ...updatedUser,
            // Mettre à jour le statut pour refléter l'activation
            status: {
              ...user.status,
              code: 'active',
              label: 'Actif(ve)',
              description: 'Actif(ve)'
            }
          } : user
        ),
        loading: false
      }))
      toast.success('Utilisateur activé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableUser: async (id: number) => {
    try {
      set({ loading: true })
      const updatedUser = await userService.disable(id)
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? {
            ...user,
            ...updatedUser,
            // Mettre à jour le statut pour refléter la désactivation
            status: {
              ...user.status,
              code: 'inactive',
              label: 'Inactif(ve)',
              description: 'Inactif(ve)'
            }
          } : user
        ),
        loading: false
      }))
      toast.success('Utilisateur désactivé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  resetUser: async (id: number) => {
    try {
      set({ loading: true })
      const updatedUser = await userService.reset(id)
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? {
            ...user,
            ...updatedUser,
            // Mettre à jour le statut pour refléter la réinitialisation (actif par défaut)
            status: {
              ...user.status,
              code: 'active',
              label: 'Actif(ve)',
              description: 'Actif(ve)'
            }
          } : user
        ),
        loading: false
      }))
      toast.success('Utilisateur réinitialisé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réinitialisation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user })
  },

  setFilters: (filters: Partial<UserFilters>) => {
    set(state => {
      const newFilters = { ...state.filters, ...filters }
      
      // Si on change de page, on ne change que la page
      if (filters.page) {
        return {
          pagination: { ...state.pagination, currentPage: filters.page }
        }
      }
      
      // Si on change les filtres de recherche, on revient à la page 1
      if (filters.search !== undefined || filters.entity !== undefined || filters.role !== undefined) {
        return {
          filters: newFilters,
          pagination: { ...state.pagination, currentPage: 1 }
        }
      }
      
      return {
        filters: newFilters
      }
    })
  },

  clearError: () => {
    set({ error: null })
  },
})) 