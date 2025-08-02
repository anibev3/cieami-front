import { create } from 'zustand'
import { toast } from 'sonner'
import { bodyworksService } from '@/services/bodyworks'
import {
  Bodywork,
  BodyworkCreate,
  BodyworkUpdate,
  BodyworksResponse,
  BodyworkFilters,
} from '@/types/bodyworks'

interface BodyworksState {
  bodyworks: Bodywork[]
  currentBodywork: Bodywork | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface BodyworksActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentBodywork: (bodywork: Bodywork | null) => void
  clearError: () => void

  // Actions CRUD
  fetchBodyworks: (page?: number, filters?: BodyworkFilters) => Promise<void>
  fetchBodyworkById: (id: number) => Promise<void>
  createBodywork: (data: BodyworkCreate) => Promise<boolean>
  updateBodywork: (id: number, data: BodyworkUpdate) => Promise<boolean>
  deleteBodywork: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: BodyworksState = {
  bodyworks: [],
  currentBodywork: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const useBodyworksStore = create<BodyworksState & BodyworksActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentBodywork: (bodywork) => set({ currentBodywork: bodywork }),
  clearError: () => set({ error: null }),

  fetchBodyworks: async (page = 1, filters) => {
    try {
      set({ loading: true, error: null })
      const response: BodyworksResponse = await bodyworksService.getAll(page, filters)
      
      set({
        bodyworks: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement des carrosseries' })
    }
  },

  fetchBodyworkById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await bodyworksService.getById(id)
      set({ currentBodywork: response.data, loading: false })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement de la carrosserie' })
    }
  },

  createBodywork: async (data: BodyworkCreate) => {
    try {
      set({ loading: true, error: null })
      await bodyworksService.create(data)
      
      // Recharger la liste
      await get().fetchBodyworks(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Carrosserie créée avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la création de la carrosserie' })
      return false
    }
  },

  updateBodywork: async (id: number, data: BodyworkUpdate) => {
    try {
      set({ loading: true, error: null })
      await bodyworksService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchBodyworks(get().pagination.currentPage)
      await get().fetchBodyworkById(id)
      
      set({ loading: false })
      toast.success('Carrosserie mise à jour avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour de la carrosserie' })
      return false
    }
  },

  deleteBodywork: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await bodyworksService.delete(id)
      
      // Recharger la liste
      await get().fetchBodyworks(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Carrosserie supprimée avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la suppression de la carrosserie' })
      return false
    }
  },

  reset: () => set(initialState),
})) 