import { create } from 'zustand'
import { OtherCost, CreateOtherCostData, UpdateOtherCostData } from '@/types/administration'
import { otherCostService } from '@/services/otherCostService'
import { toast } from 'sonner'

interface OtherCostsState {
  otherCosts: OtherCost[]
  loading: boolean
  error: string | null
  selectedOtherCost: OtherCost | null

  fetchOtherCosts: () => Promise<void>
  createOtherCost: (data: CreateOtherCostData) => Promise<void>
  updateOtherCost: (id: number | string, data: UpdateOtherCostData) => Promise<void>
  deleteOtherCost: (id: number | string) => Promise<void>
  setSelectedOtherCost: (otherCost: OtherCost | null) => void
  clearError: () => void
}

export const useOtherCostsStore = create<OtherCostsState>((set) => ({
  otherCosts: [],
  loading: false,
  error: null,
  selectedOtherCost: null,

  fetchOtherCosts: async () => {
    try {
      set({ loading: true, error: null })
      const response = await otherCostService.getAll()
      set({ otherCosts: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createOtherCost: async (data: CreateOtherCostData) => {
    try {
      set({ loading: true })
      const response = await otherCostService.createWithResponse(data)
      set(state => ({
        otherCosts: [...state.otherCosts, response.data],
        loading: false
      }))
      // Utiliser le message de l'API
      toast.success(response.message)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateOtherCost: async (id, data) => {
    try {
      set({ loading: true })
      const response = await otherCostService.updateWithResponse(id, data)
      set(state => ({
        otherCosts: state.otherCosts.map(item => item.id === response.data.id ? response.data : item),
        loading: false
      }))
      // Utiliser le message de l'API
      toast.success(response.message)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteOtherCost: async (id) => {
    try {
      set({ loading: true })
      const response = await otherCostService.deleteWithResponse(id)
      set(state => ({
        otherCosts: state.otherCosts.filter(item => item.id !== id),
        loading: false
      }))
      // Utiliser le message de l'API
      toast.success(response.message)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedOtherCost: (otherCost) => {
    set({ selectedOtherCost: otherCost })
  },

  clearError: () => {
    set({ error: null })
  },
}))
