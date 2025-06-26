import { create } from 'zustand'
import { toast } from 'sonner'
import { hourlyRatesService } from '@/services/hourly-rates'
import {
  HourlyRate,
  HourlyRateCreate,
  HourlyRateUpdate,
  HourlyRatesResponse,
} from '@/types/hourly-rates'

interface HourlyRatesState {
  hourlyRates: HourlyRate[]
  currentHourlyRate: HourlyRate | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface HourlyRatesActions {
  // Actions de base
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentHourlyRate: (hourlyRate: HourlyRate | null) => void
  clearError: () => void

  // Actions CRUD
  fetchHourlyRates: (page?: number) => Promise<void>
  fetchHourlyRateById: (id: number) => Promise<void>
  createHourlyRate: (data: HourlyRateCreate) => Promise<boolean>
  updateHourlyRate: (id: number, data: HourlyRateUpdate) => Promise<boolean>
  deleteHourlyRate: (id: number) => Promise<boolean>

  // Actions utilitaires
  reset: () => void
}

const initialState: HourlyRatesState = {
  hourlyRates: [],
  currentHourlyRate: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const useHourlyRatesStore = create<HourlyRatesState & HourlyRatesActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentHourlyRate: (hourlyRate) => set({ currentHourlyRate: hourlyRate }),
  clearError: () => set({ error: null }),

  fetchHourlyRates: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: HourlyRatesResponse = await hourlyRatesService.getAll(page)
      
      set({
        hourlyRates: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement des horaires' })
    }
  },

  fetchHourlyRateById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await hourlyRatesService.getById(id)
      set({ currentHourlyRate: response.data, loading: false })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement de l\'horaire' })
    }
  },

  createHourlyRate: async (data: HourlyRateCreate) => {
    try {
      set({ loading: true, error: null })
      await hourlyRatesService.create(data)
      
      // Recharger la liste
      await get().fetchHourlyRates(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Horaire créé avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la création de l\'horaire' })
      return false
    }
  },

  updateHourlyRate: async (id: number, data: HourlyRateUpdate) => {
    try {
      set({ loading: true, error: null })
      await hourlyRatesService.update(id, data)
      
      // Recharger la liste et l'élément courant
      await get().fetchHourlyRates(get().pagination.currentPage)
      await get().fetchHourlyRateById(id)
      
      set({ loading: false })
      toast.success('Horaire mis à jour avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour de l\'horaire' })
      return false
    }
  },

  deleteHourlyRate: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await hourlyRatesService.delete(id)
      
      // Recharger la liste
      await get().fetchHourlyRates(get().pagination.currentPage)
      
      set({ loading: false })
      toast.success('Horaire supprimé avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la suppression de l\'horaire' })
      return false
    }
  },

  reset: () => set(initialState),
})) 