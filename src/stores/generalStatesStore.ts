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
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: {
    search: string
    page: number
  }
  
  // Actions
  fetchGeneralStates: (filters?: { search?: string; page?: number }) => Promise<void>
  createGeneralState: (data: CreateGeneralStateData) => Promise<void>
  updateGeneralState: (id: number, data: UpdateGeneralStateData) => Promise<void>
  deleteGeneralState: (id: number) => Promise<void>
  setSelectedGeneralState: (generalState: GeneralState | null) => void
  setFilters: (filters: { search: string; page: number }) => void
  clearError: () => void
}

export const useGeneralStatesStore = create<GeneralStatesState>((set, get) => ({
  // État initial
  generalStates: [],
  loading: false,
  error: null,
  selectedGeneralState: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    from: 1,
    to: 1,
    total: 0,
  },
  filters: {
    search: '',
    page: 1
  },

  // Actions
  fetchGeneralStates: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await generalStateService.getAll(filters)
      set({ 
        generalStates: response.data, 
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false 
      })
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
      await get().fetchGeneralStates()
      set({ loading: false })
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
      await get().fetchGeneralStates()
      set({ loading: false })
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
      await get().fetchGeneralStates()
      set({ loading: false })
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

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 