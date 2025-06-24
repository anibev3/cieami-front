import { create } from 'zustand'
import { Status, CreateStatusData, UpdateStatusData } from '@/types/administration'
import { statusService } from '@/services/statusService'
import { toast } from 'sonner'

interface StatusesState {
  // État
  statuses: Status[]
  loading: boolean
  error: string | null
  selectedStatus: Status | null
  
  // Actions
  fetchStatuses: () => Promise<void>
  createStatus: (data: CreateStatusData) => Promise<void>
  updateStatus: (id: number, data: UpdateStatusData) => Promise<void>
  deleteStatus: (id: number) => Promise<void>
  setSelectedStatus: (status: Status | null) => void
  clearError: () => void
}

export const useStatusesStore = create<StatusesState>((set) => ({
  // État initial
  statuses: [],
  loading: false,
  error: null,
  selectedStatus: null,

  // Actions
  fetchStatuses: async () => {
    try {
      set({ loading: true, error: null })
      const response = await statusService.getAll()
      set({ statuses: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statuts'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createStatus: async (data: CreateStatusData) => {
    try {
      set({ loading: true })
      const newStatus = await statusService.create(data)
      set(state => ({ 
        statuses: [...state.statuses, newStatus], 
        loading: false 
      }))
      toast.success('Statut créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateStatus: async (id: number, data: UpdateStatusData) => {
    try {
      set({ loading: true })
      const updatedStatus = await statusService.update(id, data)
      set(state => ({
        statuses: state.statuses.map(status =>
          status.id === id ? updatedStatus : status
        ),
        loading: false
      }))
      toast.success('Statut mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteStatus: async (id: number) => {
    try {
      set({ loading: true })
      await statusService.delete(id)
      set(state => ({
        statuses: state.statuses.filter(status => status.id !== id),
        loading: false
      }))
      toast.success('Statut supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedStatus: (status: Status | null) => {
    set({ selectedStatus: status })
  },

  clearError: () => {
    set({ error: null })
  },
})) 