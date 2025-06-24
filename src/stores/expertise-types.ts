import { create } from 'zustand'
import {
  ExpertiseType,
  ExpertiseTypeCreate,
  ExpertiseTypeUpdate,
} from '@/types/expertise-types'
import * as expertiseTypesService from '@/services/expertise-types'

interface ExpertiseTypesState {
  expertiseTypes: ExpertiseType[]
  loading: boolean
  error: string | null
  total: number
  page: number
  perPage: number
  fetchExpertiseTypes: (params?: Record<string, string | number | undefined>) => Promise<void>
  createExpertiseType: (data: ExpertiseTypeCreate) => Promise<void>
  updateExpertiseType: (id: number | string, data: ExpertiseTypeUpdate) => Promise<void>
  deleteExpertiseType: (id: number | string) => Promise<void>
}

export const useExpertiseTypesStore = create<ExpertiseTypesState>((set, get) => ({
  expertiseTypes: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  perPage: 20,

  fetchExpertiseTypes: async (params) => {
    set({ loading: true, error: null })
    try {
      const response = await expertiseTypesService.getExpertiseTypes(params)
      set({
        expertiseTypes: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        perPage: response.meta.per_page,
        loading: false,
      })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors du chargement des types d\'expertise', loading: false })
    }
  },

  createExpertiseType: async (data) => {
    set({ loading: true, error: null })
    try {
      await expertiseTypesService.createExpertiseType(data)
      await get().fetchExpertiseTypes()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la création', loading: false })
    }
  },

  updateExpertiseType: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await expertiseTypesService.updateExpertiseType(id, data)
      await get().fetchExpertiseTypes()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la modification', loading: false })
    }
  },

  deleteExpertiseType: async (id) => {
    set({ loading: true, error: null })
    try {
      await expertiseTypesService.deleteExpertiseType(id)
      await get().fetchExpertiseTypes()
      set({ loading: false })
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de la suppression', loading: false })
    }
  },
})) 