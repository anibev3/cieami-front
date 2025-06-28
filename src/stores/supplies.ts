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

interface SuppliesState {
  supplies: Supply[]
  loading: boolean
  error: string | null
  total: number
  page: number
  perPage: number
  fetchSupplies: (params?: Record<string, string | number | undefined>) => Promise<void>
  fetchSupplyById: (id: number) => Promise<Supply>
  createSupply: (data: SupplyCreate) => Promise<void>
  updateSupply: (id: number | string, data: SupplyUpdate) => Promise<void>
  deleteSupply: (id: number | string) => Promise<void>
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
  total: 0,
  page: 1,
  perPage: 20,

  fetchSupplies: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await suppliesService.getSupplies(params)
      set({
        supplies: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        perPage: response.meta.per_page,
        loading: false,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des fournitures'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  fetchSupplyById: async (id: number) => {
    try {
      const supply = await suppliesService.getSupplyById(id)
      return supply
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de la fourniture'
      set({ error: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  },

  createSupply: async (data) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.createSupply(data)
      await get().fetchSupplies()
      set({ loading: false })
      toast.success('Fourniture créée avec succès')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  updateSupply: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.updateSupply(id, data)
      await get().fetchSupplies()
      set({ loading: false })
      toast.success('Fourniture mise à jour avec succès')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  deleteSupply: async (id) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.deleteSupply(id)
      await get().fetchSupplies()
      set({ loading: false })
      toast.success('Fourniture supprimée avec succès')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
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
      toast.error(errorMessage)
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
      toast.error(errorMessage)
    }
  },

  setSelectedSupplyPrice: (supplyPrice: SupplyPrice | null) => {
    set({ selectedSupplyPrice: supplyPrice })
  },

  clearError: () => {
    set({ error: null })
  },
})) 