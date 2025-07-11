import { create } from 'zustand'
import { OtherCostType, CreateOtherCostTypeData, UpdateOtherCostTypeData } from '@/types/administration'
import { otherCostTypeService } from '@/services/otherCostTypeService'
import { toast } from 'sonner'

interface OtherCostTypesState {
  otherCostTypes: OtherCostType[]
  loading: boolean
  error: string | null
  selectedOtherCostType: OtherCostType | null

  fetchOtherCostTypes: () => Promise<void>
  createOtherCostType: (data: CreateOtherCostTypeData) => Promise<void>
  updateOtherCostType: (id: number | string, data: UpdateOtherCostTypeData) => Promise<void>
  deleteOtherCostType: (id: number | string) => Promise<void>
  setSelectedOtherCostType: (otherCostType: OtherCostType | null) => void
  clearError: () => void
}

export const useOtherCostTypesStore = create<OtherCostTypesState>((set) => ({
  otherCostTypes: [],
  loading: false,
  error: null,
  selectedOtherCostType: null,

  fetchOtherCostTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await otherCostTypeService.getAll()
      set({ otherCostTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createOtherCostType: async (data: CreateOtherCostTypeData) => {
    try {
      set({ loading: true })
      const newItem = await otherCostTypeService.create(data)
      set(state => ({
        otherCostTypes: [...state.otherCostTypes, newItem],
        loading: false
      }))
      toast.success('Type de coût créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateOtherCostType: async (id, data) => {
    try {
      set({ loading: true })
      const updated = await otherCostTypeService.update(id, data)
      set(state => ({
        otherCostTypes: state.otherCostTypes.map(item => item.id === updated.id ? updated : item),
        loading: false
      }))
      toast.success('Type de coût modifié avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteOtherCostType: async (id) => {
    try {
      set({ loading: true })
      await otherCostTypeService.delete(id)
      set(state => ({
        otherCostTypes: state.otherCostTypes.filter(item => item.id !== id),
        loading: false
      }))
      toast.success('Type de coût supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedOtherCostType: (otherCostType) => {
    set({ selectedOtherCostType: otherCostType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 