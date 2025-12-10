import { create } from 'zustand'
import { StatusDeadline, CreateStatusDeadlineData, UpdateStatusDeadlineData } from '@/types/administration'
import { statusDeadlineService } from '@/services/statusDeadlineService'
import { toast } from 'sonner'

interface StatusDeadlinesState {
  // État
  statusDeadlines: StatusDeadline[]
  loading: boolean
  error: string | null
  selectedStatusDeadline: StatusDeadline | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  
  // Actions
  fetchStatusDeadlines: () => Promise<void>
  createStatusDeadline: (data: CreateStatusDeadlineData) => Promise<void>
  updateStatusDeadline: (id: string, data: UpdateStatusDeadlineData) => Promise<void>
  deleteStatusDeadline: (id: string) => Promise<void>
  enableStatusDeadline: (id: string) => Promise<void>
  disableStatusDeadline: (id: string) => Promise<void>
  setSelectedStatusDeadline: (deadline: StatusDeadline | null) => void
  clearError: () => void
}

export const useStatusDeadlinesStore = create<StatusDeadlinesState>((set, get) => ({
  // État initial
  statusDeadlines: [],
  loading: false,
  error: null,
  selectedStatusDeadline: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    from: 1,
    to: 1,
    total: 0,
  },

  // Actions
  fetchStatusDeadlines: async () => {
    try {
      set({ loading: true, error: null })
      const response = await statusDeadlineService.getAll()
      set({ 
        statusDeadlines: response.data, 
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des délais de statuts'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createStatusDeadline: async (data: CreateStatusDeadlineData) => {
    try {
      set({ loading: true })
      await statusDeadlineService.create(data)
      await get().fetchStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateStatusDeadline: async (id: string, data: UpdateStatusDeadlineData) => {
    try {
      set({ loading: true })
      await statusDeadlineService.update(id, data)
      await get().fetchStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await statusDeadlineService.delete(id)
      await get().fetchStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await statusDeadlineService.enable(id)
      await get().fetchStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut activé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await statusDeadlineService.disable(id)
      await get().fetchStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut désactivé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedStatusDeadline: (deadline: StatusDeadline | null) => {
    set({ selectedStatusDeadline: deadline })
  },

  clearError: () => {
    set({ error: null })
  },
}))
