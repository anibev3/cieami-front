import { create } from 'zustand'
import { User, CreateUserData, UpdateUserData } from '@/types/administration'
import { userService } from '@/services/userService'
import { toast } from 'sonner'

interface UsersState {
  // État
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
  
  // Actions
  fetchUsers: () => Promise<void>
  createUser: (data: CreateUserData) => Promise<void>
  updateUser: (id: number, data: UpdateUserData) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  setSelectedUser: (user: User | null) => void
  clearError: () => void
}

export const useUsersStore = create<UsersState>((set) => ({
  // État initial
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

  // Actions
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null })
      const response = await userService.getAll()
      set({ users: response.data, loading: false })
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

  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user })
  },

  clearError: () => {
    set({ error: null })
  },
})) 