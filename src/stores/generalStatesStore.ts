import { create } from 'zustand'
import { GeneralState, CreateGeneralStateData, UpdateGeneralStateData } from '@/types/administration'
import { generalStateService } from '@/services/generalStateService'
import { toast } from 'sonner'

interface GeneralStatesState {
  // État
  generalStates: GeneralState[]
  loading: boolean
  error: string | null
  selectedGeneralState: GeneralState | null
  
  // Actions
  fetchGeneralStates: () => Promise<void>
  createGeneralState: (data: CreateGeneralStateData) => Promise<void>
  updateGeneralState: (id: number, data: UpdateGeneralStateData) => Promise<void>
  deleteGeneralState: (id: number) => Promise<void>
  setSelectedGeneralState: (generalState: GeneralState | null) => void
  clearError: () => void
}

export const useGeneralStatesStore = create<GeneralStatesState>((set) => ({
  // État initial
  generalStates: [],
  loading: false,
  error: null,
  selectedGeneralState: null,

  // Actions
  fetchGeneralStates: async () => {
    try {
      set({ loading: true, error: null })
      const response = await generalStateService.getAll()
      set({ generalStates: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des états généraux'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createGeneralState: async (data: CreateGeneralStateData) => {
    try {
      set({ loading: true })
      const newGeneralState = await generalStateService.create(data)
      set(state => ({ 
        generalStates: [...state.generalStates, newGeneralState], 
        loading: false 
      }))
      toast.success('État général créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateGeneralState: async (id: number, data: UpdateGeneralStateData) => {
    try {
      set({ loading: true })
      const updatedGeneralState = await generalStateService.update(id, data)
      set(state => ({
        generalStates: state.generalStates.map(gs =>
          gs.id === id ? updatedGeneralState : gs
        ),
        loading: false
      }))
      toast.success('État général mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteGeneralState: async (id: number) => {
    try {
      set({ loading: true })
      await generalStateService.delete(id)
      set(state => ({
        generalStates: state.generalStates.filter(gs => gs.id !== id),
        loading: false
      }))
      toast.success('État général supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedGeneralState: (generalState: GeneralState | null) => {
    set({ selectedGeneralState: generalState })
  },

  clearError: () => {
    set({ error: null })
  },
})) 