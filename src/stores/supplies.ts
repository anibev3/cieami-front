import { create } from 'zustand'
import {
  Supply,
  SupplyCreate,
  SupplyUpdate,
} from '@/types/supplies'
import * as suppliesService from '@/services/supplies'

interface SuppliesState {
  supplies: Supply[]
  loading: boolean
  error: string | null
  total: number
  page: number
  perPage: number
  fetchSupplies: (params?: Record<string, string | number | undefined>) => Promise<void>
  createSupply: (data: SupplyCreate) => Promise<void>
  updateSupply: (id: number | string, data: SupplyUpdate) => Promise<void>
  deleteSupply: (id: number | string) => Promise<void>
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
      set({ error: error instanceof Error ? error.message : 'Erreur lors du chargement des fournitures', loading: false })
    }
  },

  createSupply: async (data) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.createSupply(data)
      await get().fetchSupplies()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la création', loading: false })
    }
  },

  updateSupply: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.updateSupply(id, data)
      await get().fetchSupplies()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la modification', loading: false })
    }
  },

  deleteSupply: async (id) => {
    set({ loading: true, error: null })
    try {
      await suppliesService.deleteSupply(id)
      await get().fetchSupplies()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la suppression', loading: false })
    }
  },
})) 