import { create } from 'zustand'
import { toast } from 'sonner'
import { paintTypesService } from '@/services/paint-types'
import {
  PaintType,
  PaintTypeCreate,
  PaintTypeUpdate,
  PaintTypesResponse,
} from '@/types/paint-types'

interface PaintTypesState {
  paintTypes: PaintType[]
  currentPaintType: PaintType | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface PaintTypesActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentPaintType: (paintType: PaintType | null) => void
  clearError: () => void

  // Actions CRUD
  fetchPaintTypes: (page?: number, search?: string) => Promise<void>
  fetchPaintTypeById: (id: number) => Promise<void>
  createPaintType: (data: PaintTypeCreate) => Promise<boolean>
  updatePaintType: (id: number, data: PaintTypeUpdate) => Promise<boolean>
  deletePaintType: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: PaintTypesState = {
  paintTypes: [],
  currentPaintType: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const usePaintTypesStore = create<PaintTypesState & PaintTypesActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPaintType: (paintType) => set({ currentPaintType: paintType }),
  clearError: () => set({ error: null }),

  fetchPaintTypes: async (page = 1, search = '') => {
    try {
      set({ loading: true, error: null })
      const response: PaintTypesResponse = await paintTypesService.getAll(page, search)
      
      set({
        paintTypes: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement des types de peinture' })
    }
  },

  fetchPaintTypeById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await paintTypesService.getById(id)
      set({ currentPaintType: response.data, loading: false })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement du type de peinture' })
    }
  },

  createPaintType: async (data: PaintTypeCreate) => {
    try {
      set({ loading: true, error: null })
      await paintTypesService.create(data)
      
      // Recharger la liste
      await get().fetchPaintTypes(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Type de peinture créé avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la création du type de peinture' })
      return false
    }
  },

  updatePaintType: async (id: number, data: PaintTypeUpdate) => {
    try {
      set({ loading: true, error: null })
      await paintTypesService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchPaintTypes(get().pagination.currentPage)
      await get().fetchPaintTypeById(id)
      
      set({ loading: false })
      
      toast.success('Type de peinture mis à jour avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour du type de peinture' })
      return false
    }
  },

  deletePaintType: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await paintTypesService.delete(id)
      
      // Recharger la liste
      await get().fetchPaintTypes(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Type de peinture supprimé avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la suppression du type de peinture' })
      return false
    }
  },

  reset: () => set(initialState),
})) 