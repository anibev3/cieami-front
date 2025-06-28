import { create } from 'zustand'
import { Check, CreateCheckData, UpdateCheckData } from '@/types/comptabilite'
import { checkService } from '@/services/checkService'
import { toast } from 'sonner'

interface CheckState {
  // État
  checks: Check[]
  loading: boolean
  error: string | null
  selectedCheck: Check | null
  
  // Actions
  fetchChecks: () => Promise<void>
  createCheck: (data: CreateCheckData) => Promise<void>
  updateCheck: (id: number, data: UpdateCheckData) => Promise<void>
  deleteCheck: (id: number) => Promise<void>
  setSelectedCheck: (check: Check | null) => void
  clearError: () => void
}

export const useCheckStore = create<CheckState>((set) => ({
  // État initial
  checks: [],
  loading: false,
  error: null,
  selectedCheck: null,

  // Actions
  fetchChecks: async () => {
    try {
      set({ loading: true, error: null })
      const response = await checkService.getAll()
      set({ checks: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des chèques'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createCheck: async (data: CreateCheckData) => {
    try {
      set({ loading: true })
      const newCheck = await checkService.create(data)
      set(state => ({ 
        checks: [...state.checks, newCheck], 
        loading: false 
      }))
      toast.success('Chèque créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateCheck: async (id: number, data: UpdateCheckData) => {
    try {
      set({ loading: true })
      const updatedCheck = await checkService.update(id, data)
      set(state => ({
        checks: state.checks.map(check =>
          check.id === id ? updatedCheck : check
        ),
        loading: false
      }))
      toast.success('Chèque mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteCheck: async (id: number) => {
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
      toast.error(errorMessage)
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