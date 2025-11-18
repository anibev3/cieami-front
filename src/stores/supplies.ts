import { create } from 'zustand'
import {
  Supply,
  SupplyCreate,
  SupplyUpdate,
  SupplyPrice,
  SupplyPriceRequest,
  // SupplyPriceResponse,
  SupplyPriceFilters,
} from '@/types/supplies'
import * as suppliesService from '@/services/supplies'
import { toast } from 'sonner'

interface SupplyFilters {
  search?: string
  status?: string
}

interface SupplyPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
}

interface SuppliesState {
  supplies: Supply[]
  loading: boolean
  error: string | null
  pagination: SupplyPagination
  filters: SupplyFilters
  fetchSupplies: (page?: number, filters?: SupplyFilters) => Promise<void>
  fetchSupplyById: (id: number | string) => Promise<Supply>
  createSupply: (data: SupplyCreate) => Promise<Supply>
  updateSupply: (id: number | string, data: SupplyUpdate) => Promise<void>
  deleteSupply: (id: number | string) => Promise<void>
  setFilters: (filters: SupplyFilters) => void
  setPage: (page: number) => void
}

interface SupplyPricesState {
  supplyPrices: SupplyPrice[]
  loading: boolean
  error: string | null
  selectedSupplyPrice: SupplyPrice | null
  total: number
  page: number
  perPage: number
  fetchSupplyPrices: (data: SupplyPriceRequest) => Promise<void>
  fetchSupplyPricesWithFilters: (filters: SupplyPriceFilters) => Promise<void>
  setSelectedSupplyPrice: (supplyPrice: SupplyPrice | null) => void
  clearError: () => void
}

export const useSuppliesStore = create<SuppliesState>((set, get) => ({
  supplies: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 25,
  },
  filters: {
    search: '',
    status: '',
  },

  fetchSupplies: async (page = 1, filters = {}) => {
    set({ loading: true, error: null })
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        per_page: 50, // Augmenter pour charger plus de fournitures par défaut
        ...filters,
      }
      const response = await suppliesService.getSupplies(params)
      set({
        supplies: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des fournitures'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  setFilters: (filters) => {
    set({ filters })
  },

  setPage: (page) => {
    set({ pagination: { ...get().pagination, currentPage: page } })
  },

  fetchSupplyById: async (id: number | string) => {
    try {
      const supply = await suppliesService.getSupplyById(id)
      return supply
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de la fourniture'
      set({ error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  createSupply: async (data) => {
    set({ loading: true, error: null })
    try {
      const newSupply = await suppliesService.createSupply(data)
      await get().fetchSupplies(get().pagination.currentPage, get().filters)
      set({ loading: false })
      toast.success('Fourniture créée avec succès')
      return newSupply
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateSupply: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.updateSupply(id, data)
      await get().fetchSupplies(get().pagination.currentPage, get().filters)
      set({ loading: false })
      toast.success('Fourniture mise à jour avec succès')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  deleteSupply: async (id) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.deleteSupply(id)
      await get().fetchSupplies(get().pagination.currentPage, get().filters)
      set({ loading: false })
      toast.success('Fourniture supprimée avec succès')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },
}))

export const useSupplyPricesStore = create<SupplyPricesState>((set) => ({
  supplyPrices: [],
  loading: false,
  error: null,
  selectedSupplyPrice: null,
  total: 0,
  page: 1,
  perPage: 20,

  fetchSupplyPrices: async (data: SupplyPriceRequest) => {
    try {
      set({ loading: true, error: null })
      const response = await suppliesService.getSupplyPrices(data)
      set({
        supplyPrices: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        perPage: response.meta.per_page,
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des prix'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  fetchSupplyPricesWithFilters: async (filters: SupplyPriceFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await suppliesService.getSupplyPricesWithFilters(filters)
      set({
        supplyPrices: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        perPage: response.meta.per_page,
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des prix'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  setSelectedSupplyPrice: (supplyPrice: SupplyPrice | null) => {
    set({ selectedSupplyPrice: supplyPrice })
  },

  clearError: () => {
    set({ error: null })
  },
})) 