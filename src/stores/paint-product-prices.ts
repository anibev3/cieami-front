import { create } from 'zustand'
import { toast } from 'sonner'
import { paintProductPricesService } from '@/services/paint-product-prices'
import {
  PaintProductPrice,
  PaintProductPriceCreate,
  PaintProductPriceUpdate,
  PaintProductPricesResponse,
} from '@/types/paint-product-prices'

interface PaintProductPricesState {
  paintProductPrices: PaintProductPrice[]
  currentPaintProductPrice: PaintProductPrice | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface PaintProductPricesActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentPaintProductPrice: (paintProductPrice: PaintProductPrice | null) => void
  clearError: () => void

  // Actions CRUD
  fetchPaintProductPrices: (page?: number) => Promise<void>
  fetchPaintProductPriceById: (id: number) => Promise<void>
  createPaintProductPrice: (data: PaintProductPriceCreate) => Promise<boolean>
  updatePaintProductPrice: (id: number, data: PaintProductPriceUpdate) => Promise<boolean>
  deletePaintProductPrice: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: PaintProductPricesState = {
  paintProductPrices: [],
  currentPaintProductPrice: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const usePaintProductPricesStore = create<PaintProductPricesState & PaintProductPricesActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPaintProductPrice: (paintProductPrice) => set({ currentPaintProductPrice: paintProductPrice }),
  clearError: () => set({ error: null }),

  fetchPaintProductPrices: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: PaintProductPricesResponse = await paintProductPricesService.getAll(page)
      
      set({
        paintProductPrices: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement des tarifs' })
      console.error('Error fetching paint product prices:', error)
    }
  },

  fetchPaintProductPriceById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await paintProductPricesService.getById(id)
      set({ currentPaintProductPrice: response.data, loading: false })
    } catch (error) {
      set({ loading: false, error: 'Erreur lors du chargement du tarif' })
      console.error('Error fetching paint product price:', error)
    }
  },

  createPaintProductPrice: async (data: PaintProductPriceCreate) => {
    try {
      set({ loading: true, error: null })
      await paintProductPricesService.create(data)
      
      // Recharger la liste
      await get().fetchPaintProductPrices(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Tarif créé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la création du tarif' })
      console.error('Error creating paint product price:', error)
      return false
    }
  },

  updatePaintProductPrice: async (id: number, data: PaintProductPriceUpdate) => {
    try {
      set({ loading: true, error: null })
      await paintProductPricesService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchPaintProductPrices(get().pagination.currentPage)
      await get().fetchPaintProductPriceById(id)
      
      set({ loading: false })
      toast.success('Tarif mis à jour avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour du tarif' })
      console.error('Error updating paint product price:', error)
      return false
    }
  },

  deletePaintProductPrice: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await paintProductPricesService.delete(id)
      
      // Recharger la liste
      await get().fetchPaintProductPrices(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Tarif supprimé avec succès')
      return true
    } catch (error) {
      set({ loading: false, error: 'Erreur lors de la suppression du tarif' })
      console.error('Error deleting paint product price:', error)
      return false
    }
  },

  reset: () => set(initialState),
})) 