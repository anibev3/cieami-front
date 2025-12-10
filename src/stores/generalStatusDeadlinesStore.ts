import { create } from 'zustand'
import { GeneralStatusDeadline, CreateGeneralStatusDeadlineData, UpdateGeneralStatusDeadlineData } from '@/types/administration'
import { generalStatusDeadlineService } from '@/services/generalStatusDeadlineService'
import { toast } from 'sonner'

interface GeneralStatusDeadlinesState {
  // État
  generalStatusDeadlines: GeneralStatusDeadline[]
  loading: boolean
  error: string | null
  selectedGeneralStatusDeadline: GeneralStatusDeadline | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  
  // Actions
  fetchGeneralStatusDeadlines: () => Promise<void>
  createGeneralStatusDeadline: (data: CreateGeneralStatusDeadlineData) => Promise<void>
  updateGeneralStatusDeadline: (id: string, data: UpdateGeneralStatusDeadlineData) => Promise<void>
  deleteGeneralStatusDeadline: (id: string) => Promise<void>
  enableGeneralStatusDeadline: (id: string) => Promise<void>
  disableGeneralStatusDeadline: (id: string) => Promise<void>
  setSelectedGeneralStatusDeadline: (deadline: GeneralStatusDeadline | null) => void
  clearError: () => void
}

export const useGeneralStatusDeadlinesStore = create<GeneralStatusDeadlinesState>((set, get) => ({
  // État initial
  generalStatusDeadlines: [],
  loading: false,
  error: null,
  selectedGeneralStatusDeadline: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    from: 1,
    to: 1,
    total: 0,
  },

  // Actions
  fetchGeneralStatusDeadlines: async () => {
    try {
      set({ loading: true, error: null })
      const response = await generalStatusDeadlineService.getAll()
      set({ 
        generalStatusDeadlines: response.data, 
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des délais de statuts généraux'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createGeneralStatusDeadline: async (data: CreateGeneralStatusDeadlineData) => {
    try {
      set({ loading: true })
      await generalStatusDeadlineService.create(data)
      await get().fetchGeneralStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut général créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateGeneralStatusDeadline: async (id: string, data: UpdateGeneralStatusDeadlineData) => {
    try {
      set({ loading: true })
      await generalStatusDeadlineService.update(id, data)
      await get().fetchGeneralStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut général mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteGeneralStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await generalStatusDeadlineService.delete(id)
      await get().fetchGeneralStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut général supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableGeneralStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await generalStatusDeadlineService.enable(id)
      await get().fetchGeneralStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut général activé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableGeneralStatusDeadline: async (id: string) => {
    try {
      set({ loading: true })
      await generalStatusDeadlineService.disable(id)
      await get().fetchGeneralStatusDeadlines()
      set({ loading: false })
      toast.success('Délai de statut général désactivé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedGeneralStatusDeadline: (deadline: GeneralStatusDeadline | null) => {
    set({ selectedGeneralStatusDeadline: deadline })
  },

  clearError: () => {
    set({ error: null })
  },
}))
