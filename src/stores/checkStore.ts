import { create } from 'zustand'
import { Check, CreateCheckData, UpdateCheckData, CheckFilters } from '@/types/comptabilite'
import { checkService } from '@/services/checkService'
import { toast } from 'sonner'

interface CheckState {
  // État
  checks: Check[]
  loading: boolean
  error: string | null
  selectedCheck: Check | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  } | null
  
  // Actions
  fetchChecks: (filters?: CheckFilters) => Promise<void>
  fetchCheckById: (id: string) => Promise<Check | null>
  createCheck: (data: CreateCheckData) => Promise<string>
  updateCheck: (id: string, data: UpdateCheckData) => Promise<string>
  deleteCheck: (id: string) => Promise<void>
  setSelectedCheck: (check: Check | null) => void
  clearError: () => void
}

export const useCheckStore = create<CheckState>((set) => ({
  // État initial
  checks: [],
  loading: false,
  error: null,
  selectedCheck: null,
  pagination: null,

  // Actions
  fetchChecks: async (filters?: CheckFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await checkService.getAll(filters)
      set({ 
        checks: response.data, 
        pagination: {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
          from: response.meta.from,
          to: response.meta.to
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des chèques'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  fetchCheckById: async (id: string) => {
    try {
      set({ loading: true, error: null })
      const check = await checkService.getById(id)
      set({ loading: false })
      return check
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement du chèque'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  createCheck: async (data: CreateCheckData) => {
    try {
      set({ loading: true })
      const result = await checkService.create(data)
      set(state => ({ 
        checks: [...state.checks, result.check], 
        loading: false 
      }))
      return result.message
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  updateCheck: async (id: number, data: UpdateCheckData) => {
    try {
      set({ loading: true })
      const result = await checkService.update(id, data)
      set(state => ({
        checks: state.checks.map(check =>
          check.id === id ? result.check : check
        ),
        loading: false
      }))
      return result.message
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  deleteCheck: async (id: string) => {
    try {
      set({ loading: true })
      await checkService.delete(id)
      set(state => ({
        checks: state.checks.filter(check => check.id !== id),
        loading: false
      }))
      toast.success('Chèque supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedCheck: (check: Check | null) => {
    set({ selectedCheck: check })
  },

  clearError: () => {
    set({ error: null })
  },
})) 