import { create } from 'zustand'
import { toast } from 'sonner'
import { numberPaintElementsService } from '@/services/number-paint-elements'
import {
  NumberPaintElement,
  NumberPaintElementCreate,
  NumberPaintElementUpdate,
  NumberPaintElementsResponse,
} from '@/types/number-paint-elements'

interface NumberPaintElementsState {
  numberPaintElements: NumberPaintElement[]
  currentNumberPaintElement: NumberPaintElement | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface NumberPaintElementsActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentNumberPaintElement: (numberPaintElement: NumberPaintElement | null) => void
  clearError: () => void

  // Actions CRUD
  fetchNumberPaintElements: (page?: number) => Promise<void>
  fetchNumberPaintElementById: (id: number) => Promise<void>
  createNumberPaintElement: (data: NumberPaintElementCreate) => Promise<boolean>
  updateNumberPaintElement: (id: number, data: NumberPaintElementUpdate) => Promise<boolean>
  deleteNumberPaintElement: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: NumberPaintElementsState = {
  numberPaintElements: [],
  currentNumberPaintElement: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const useNumberPaintElementsStore = create<NumberPaintElementsState & NumberPaintElementsActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentNumberPaintElement: (numberPaintElement) => set({ currentNumberPaintElement: numberPaintElement }),
  clearError: () => set({ error: null }),

  fetchNumberPaintElements: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: NumberPaintElementsResponse = await numberPaintElementsService.getAll(page)
      
      set({
        numberPaintElements: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement des éléments' })
    }
  },

  fetchNumberPaintElementById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await numberPaintElementsService.getById(id)
      set({ currentNumberPaintElement: response.data, loading: false })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement de l\'élément' })
    }
  },

  createNumberPaintElement: async (data: NumberPaintElementCreate) => {
    try {
      set({ loading: true, error: null })
      await numberPaintElementsService.create(data)
      
      // Recharger la liste
      await get().fetchNumberPaintElements(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Élément créé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la création de l\'élément' })
      return false
    }
  },

  updateNumberPaintElement: async (id: number, data: NumberPaintElementUpdate) => {
    try {
      set({ loading: true, error: null })
      await numberPaintElementsService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchNumberPaintElements(get().pagination.currentPage)
      await get().fetchNumberPaintElementById(id)
      
      set({ loading: false })
      toast.success('Élément mis à jour avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour de l\'élément' })
      return false
    }
  },

  deleteNumberPaintElement: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await numberPaintElementsService.delete(id)
      
      // Recharger la liste
      await get().fetchNumberPaintElements(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Élément supprimé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la suppression de l\'élément' })
      return false
    }
  },

  reset: () => set(initialState),
})) 