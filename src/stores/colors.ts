import { create } from 'zustand'
import { colorService } from '@/services/colorService'
import { Color, ColorCreate, ColorUpdate, ColorFilters } from '@/types/colors'

interface ColorsState {
  colors: Color[]
  currentColor: Color | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: ColorFilters
}

interface ColorsActions {
  // Actions
  fetchColors: (filters?: ColorFilters) => Promise<void>
  fetchColor: (id: number) => Promise<void>
  createColor: (colorData: ColorCreate) => Promise<void>
  updateColor: (id: number, colorData: ColorUpdate) => Promise<void>
  deleteColor: (id: number) => Promise<void>
  setCurrentColor: (color: Color | null) => void
  setFilters: (filters: ColorFilters) => void
  clearError: () => void
}

type ColorsStore = ColorsState & ColorsActions

export const useColorsStore = create<ColorsStore>((set, get) => ({
  // État initial
  colors: [],
  currentColor: null,
  loading: false,
  error: null,
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
  fetchColors: async (filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await colorService.getColors(filters)
      
      set({
        colors: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des couleurs',
      })
    }
  },

  fetchColor: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const color = await colorService.getColor(id)
      set({ currentColor: color, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de la couleur',
      })
    }
  },

  createColor: async (colorData) => {
    set({ loading: true, error: null })
    
    try {
      await colorService.createColor(colorData)
      // Recharger la liste après création
      await get().fetchColors()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création de la couleur',
      })
      throw error
    }
  },

  updateColor: async (id, colorData) => {
    set({ loading: true, error: null })
    
    try {
      await colorService.updateColor(id, colorData)
      // Recharger la liste après mise à jour
      await get().fetchColors()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la couleur',
      })
      throw error
    }
  },

  deleteColor: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await colorService.deleteColor(id)
      // Recharger la liste après suppression
      await get().fetchColors()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de la couleur',
      })
      throw error
    }
  },

  setCurrentColor: (color) => {
    set({ currentColor: color })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 