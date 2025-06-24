import { create } from 'zustand'
import {
  ShockPoint,
  ShockPointCreate,
  ShockPointUpdate,
} from '@/types/shock-points'
import * as shockPointsService from '@/services/shock-points'

interface ShockPointsState {
  shockPoints: ShockPoint[]
  loading: boolean
  error: string | null
  total: number
  page: number
  perPage: number
  fetchShockPoints: (params?: Record<string, string | number | undefined>) => Promise<void>
  createShockPoint: (data: ShockPointCreate) => Promise<void>
  updateShockPoint: (id: number | string, data: ShockPointUpdate) => Promise<void>
  deleteShockPoint: (id: number | string) => Promise<void>
}

export const useShockPointsStore = create<ShockPointsState>((set, get) => ({
  shockPoints: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  perPage: 20,

  fetchShockPoints: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await shockPointsService.getShockPoints(params)
      set({
        shockPoints: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        perPage: response.meta.per_page,
        loading: false,
      })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors du chargement des points de choc', loading: false })
    }
  },

  createShockPoint: async (data) => {
    set({ loading: true, error: null })
    try {
      await shockPointsService.createShockPoint(data)
      await get().fetchShockPoints()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la création', loading: false })
    }
  },

  updateShockPoint: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await shockPointsService.updateShockPoint(id, data)
      await get().fetchShockPoints()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la modification', loading: false })
    }
  },

  deleteShockPoint: async (id) => {
    set({ loading: true, error: null })
    try {
      await shockPointsService.deleteShockPoint(id)
      await get().fetchShockPoints()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la suppression', loading: false })
    }
  },
})) 