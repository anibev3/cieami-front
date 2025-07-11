import { create } from 'zustand'
import { ReceiptType, CreateReceiptTypeData, UpdateReceiptTypeData } from '@/types/administration'
import { receiptTypeService } from '@/services/receiptTypeService'
import { toast } from 'sonner'

interface ReceiptTypesState {
  receiptTypes: ReceiptType[]
  loading: boolean
  error: string | null
  selectedReceiptType: ReceiptType | null

  fetchReceiptTypes: () => Promise<void>
  createReceiptType: (data: CreateReceiptTypeData) => Promise<void>
  updateReceiptType: (id: number | string, data: UpdateReceiptTypeData) => Promise<void>
  deleteReceiptType: (id: number | string) => Promise<void>
  getReceiptTypeById: (id: number | string) => Promise<ReceiptType | null>
  setSelectedReceiptType: (receiptType: ReceiptType | null) => void
  clearError: () => void
}

export const useReceiptTypesStore = create<ReceiptTypesState>((set) => ({
  receiptTypes: [],
  loading: false,
  error: null,
  selectedReceiptType: null,

  fetchReceiptTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await receiptTypeService.getAll()
      set({ receiptTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createReceiptType: async (data: CreateReceiptTypeData) => {
    try {
      set({ loading: true })
      const newItem = await receiptTypeService.create(data)
      set(state => ({
        receiptTypes: [...state.receiptTypes, newItem],
        loading: false
      }))
      toast.success('Type de reçu créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateReceiptType: async (id, data) => {
    try {
      set({ loading: true })
      const updated = await receiptTypeService.update(id, data)
      set(state => ({
        receiptTypes: state.receiptTypes.map(item => item.id === updated.id ? updated : item),
        loading: false
      }))
      toast.success('Type de reçu modifié avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteReceiptType: async (id) => {
    try {
      set({ loading: true })
      await receiptTypeService.delete(id)
      set(state => ({
        receiptTypes: state.receiptTypes.filter(item => item.id !== id),
        loading: false
      }))
      toast.success('Type de reçu supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  getReceiptTypeById: async (id) => {
    try {
      const item = await receiptTypeService.getById(id)
      return item
    } catch (_error) {
      toast.error('Erreur lors de la récupération du type de reçu')
      return null
    }
  },

  setSelectedReceiptType: (receiptType) => {
    set({ selectedReceiptType: receiptType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 