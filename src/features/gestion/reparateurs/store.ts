import { create } from 'zustand'
import { Reparateur, ReparateurFilters } from './types'
import * as api from './api'

interface ReparateursState {
  reparateurs: Reparateur[]
  total: number
  loading: boolean
  error: string | null
  selectedReparateur: Reparateur | null
  fetchReparateurs: (filters?: ReparateurFilters, token?: string) => Promise<void>
  fetchReparateur: (id: number, token?: string) => Promise<void>
  createReparateur: (reparateur: Partial<Reparateur>, token?: string) => Promise<void>
  updateReparateur: (id: number, reparateur: Partial<Reparateur>, token?: string) => Promise<void>
  deleteReparateur: (id: number, token?: string) => Promise<void>
  setSelectedReparateur: (reparateur: Reparateur | null) => void
}

export const useReparateursStore = create<ReparateursState>((set, get) => ({
  reparateurs: [],
  total: 0,
  loading: false,
  error: null,
  selectedReparateur: null,

  fetchReparateurs: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getReparateurs(filters, token)
      set({ reparateurs: res.data, total: res.meta.total, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
    }
  },

  fetchReparateur: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const reparateur = await api.getReparateurById(id, token)
      set({ selectedReparateur: reparateur, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
    }
  },

  createReparateur: async (reparateur, token) => {
    set({ loading: true, error: null })
    try {
      await api.createReparateur(reparateur, token)
      await get().fetchReparateurs(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ error: errorMessage, loading: false })
    }
  },

  updateReparateur: async (id, reparateur, token) => {
    set({ loading: true, error: null })
    try {
      await api.updateReparateur(id, reparateur, token)
      await get().fetchReparateurs(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ error: errorMessage, loading: false })
    }
  },

  deleteReparateur: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deleteReparateur(id, token)
      await get().fetchReparateurs(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ error: errorMessage, loading: false })
    }
  },

  setSelectedReparateur: (reparateur) => set({ selectedReparateur: reparateur }),
})) 