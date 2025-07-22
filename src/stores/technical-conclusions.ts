import { create } from 'zustand'
import { toast } from 'sonner'
import { technicalConclusionsService } from '@/services/technical-conclusions'
import {
  TechnicalConclusion,
  TechnicalConclusionCreate,
  TechnicalConclusionUpdate,
  TechnicalConclusionsResponse,
} from '@/types/technical-conclusions'

interface TechnicalConclusionsState {
  technicalConclusions: TechnicalConclusion[]
  currentTechnicalConclusion: TechnicalConclusion | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface TechnicalConclusionsActions {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentTechnicalConclusion: (technicalConclusion: TechnicalConclusion | null) => void
  clearError: () => void

  fetchTechnicalConclusions: (page?: number) => Promise<void>
  fetchTechnicalConclusionById: (id: number) => Promise<void>
  createTechnicalConclusion: (data: TechnicalConclusionCreate) => Promise<TechnicalConclusion>
  updateTechnicalConclusion: (id: number, data: TechnicalConclusionUpdate) => Promise<boolean>
  deleteTechnicalConclusion: (id: number) => Promise<boolean>

  reset: () => void
}

const initialState: TechnicalConclusionsState = {
  technicalConclusions: [],
  currentTechnicalConclusion: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const useTechnicalConclusionsStore = create<TechnicalConclusionsState & TechnicalConclusionsActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentTechnicalConclusion: (technicalConclusion) => set({ currentTechnicalConclusion: technicalConclusion }),
  clearError: () => set({ error: null }),

  fetchTechnicalConclusions: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: TechnicalConclusionsResponse = await technicalConclusionsService.getAll(page)
      set({
        technicalConclusions: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement des conclusions techniques' })
    }
  },

  fetchTechnicalConclusionById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await technicalConclusionsService.getById(id)
      set({ currentTechnicalConclusion: response.data, loading: false })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement de la conclusion technique' })
    }
  },

  createTechnicalConclusion: async (data: TechnicalConclusionCreate) => {
    try {
      set({ loading: true, error: null })
      const response = await technicalConclusionsService.create(data)
      await get().fetchTechnicalConclusions(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Conclusion technique créée avec succès')
      return response.data
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la création de la conclusion technique' })
      throw _error
    }
  },

  updateTechnicalConclusion: async (id: number, data: TechnicalConclusionUpdate) => {
    try {
      set({ loading: true, error: null })
      await technicalConclusionsService.update(id, data)
      await get().fetchTechnicalConclusions(get().pagination.currentPage)
      await get().fetchTechnicalConclusionById(id)
      set({ loading: false })
      toast.success('Conclusion technique mise à jour avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour de la conclusion technique' })
      return false
    }
  },

  deleteTechnicalConclusion: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await technicalConclusionsService.delete(id)
      await get().fetchTechnicalConclusions(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Conclusion technique supprimée avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la suppression de la conclusion technique' })
      return false
    }
  },

  reset: () => set(initialState),
})) 