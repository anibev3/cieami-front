import { create } from 'zustand'
import { toast } from 'sonner'
import { paintingPricesService } from '@/services/painting-prices'
import {
  PaintingPrice,
  PaintingPriceCreate,
  PaintingPriceUpdate,
  PaintingPricesResponse,
} from '@/types/painting-prices'

interface PaintingPricesState {
  paintingPrices: PaintingPrice[]
  currentPaintingPrice: PaintingPrice | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface PaintingPricesActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentPaintingPrice: (paintingPrice: PaintingPrice | null) => void
  clearError: () => void

  // Actions CRUD
  fetchPaintingPrices: (page?: number) => Promise<void>
  fetchPaintingPriceById: (id: number) => Promise<void>
  createPaintingPrice: (data: PaintingPriceCreate) => Promise<boolean>
  updatePaintingPrice: (id: number, data: PaintingPriceUpdate) => Promise<boolean>
  deletePaintingPrice: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: PaintingPricesState = {
  paintingPrices: [],
  currentPaintingPrice: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const usePaintingPricesStore = create<PaintingPricesState & PaintingPricesActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPaintingPrice: (paintingPrice) => set({ currentPaintingPrice: paintingPrice }),
  clearError: () => set({ error: null }),

  fetchPaintingPrices: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: PaintingPricesResponse = await paintingPricesService.getAll(page)
      
      set({
        paintingPrices: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement des prix de peinture' })
    }
  },

  fetchPaintingPriceById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await paintingPricesService.getById(id)
      set({ currentPaintingPrice: response.data, loading: false })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement du prix de peinture' })
    }
  },

  createPaintingPrice: async (data: PaintingPriceCreate) => {
    try {
      set({ loading: true, error: null })
      await paintingPricesService.create(data)
      
      // Recharger la liste
      await get().fetchPaintingPrices(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Prix de peinture créé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la création du prix de peinture' })
      return false
    }
  },

  updatePaintingPrice: async (id: number, data: PaintingPriceUpdate) => {
    try {
      set({ loading: true, error: null })
      await paintingPricesService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchPaintingPrices(get().pagination.currentPage)
      await get().fetchPaintingPriceById(id)
      
      set({ loading: false })
      toast.success('Prix de peinture mis à jour avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour du prix de peinture' })
      return false
    }
  },

  deletePaintingPrice: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await paintingPricesService.delete(id)
      
      // Recharger la liste
      await get().fetchPaintingPrices(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Prix de peinture supprimé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la suppression du prix de peinture' })
      return false
    }
  },

  reset: () => set(initialState),
})) 