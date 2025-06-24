import { create } from 'zustand'
import { Assureur, AssureurFilters } from './types'
import * as api from './api'

interface AssureursState {
  assureurs: Assureur[]
  total: number
  loading: boolean
  error: string | null
  selectedAssureur: Assureur | null
  fetchAssureurs: (filters?: AssureurFilters, token?: string) => Promise<void>
  fetchAssureur: (id: number, token?: string) => Promise<void>
  createAssureur: (assureur: Partial<Assureur>, token?: string) => Promise<void>
  updateAssureur: (id: number, assureur: Partial<Assureur>, token?: string) => Promise<void>
  deleteAssureur: (id: number, token?: string) => Promise<void>
  setSelectedAssureur: (assureur: Assureur | null) => void
}

export const useAssureursStore = create<AssureursState>((set, get) => ({
  assureurs: [],
  total: 0,
  loading: false,
  error: null,
  selectedAssureur: null,

  fetchAssureurs: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getAssureurs(filters, token)
      set({ assureurs: res.data, total: res.meta.total, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  fetchAssureur: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const assureur = await api.getAssureurById(id, token)
      set({ selectedAssureur: assureur, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  createAssureur: async (assureur, token) => {
    set({ loading: true, error: null })
    try {
      await api.createAssureur(assureur, token)
      await get().fetchAssureurs(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la création', loading: false })
    }
  },

  updateAssureur: async (id, assureur, token) => {
    set({ loading: true, error: null })
    try {
      await api.updateAssureur(id, assureur, token)
      await get().fetchAssureurs(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la modification', loading: false })
    }
  },

  deleteAssureur: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deleteAssureur(id, token)
      await get().fetchAssureurs(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la suppression', loading: false })
    }
  },

  setSelectedAssureur: (assureur) => set({ selectedAssureur: assureur }),
})) 