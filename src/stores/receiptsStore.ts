import { create } from 'zustand'
import { Receipt, CreateReceiptData, UpdateReceiptData } from '@/types/administration'
import { receiptsService } from '@/services/receiptsService'
import { toast } from 'sonner'

interface ReceiptsState {
  receipts: Receipt[]
  loading: boolean
  error: string | null
  selectedReceipt: Receipt | null

  fetchReceipts: () => Promise<void>
  createReceipt: (data: CreateReceiptData) => Promise<void>
  updateReceipt: (id: number | string, data: UpdateReceiptData) => Promise<void>
  deleteReceipt: (id: number | string) => Promise<void>
  setSelectedReceipt: (receipt: Receipt | null) => void
  clearError: () => void
}

export const useReceiptsStore = create<ReceiptsState>((set) => ({
  receipts: [],
  loading: false,
  error: null,
  selectedReceipt: null,

  fetchReceipts: async () => {
    try {
      set({ loading: true, error: null })
      const response = await receiptsService.getAll()
      set({ receipts: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createReceipt: async (data: CreateReceiptData) => {
    try {
      set({ loading: true })
      const response = await receiptsService.createWithResponse(data)
      set(state => ({
        receipts: [...state.receipts, response.data],
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

  updateReceipt: async (id, data) => {
    try {
      set({ loading: true })
      const response = await receiptsService.updateWithResponse(id, data)
      set(state => ({
        receipts: state.receipts.map(item => item.id === response.data.id ? response.data : item),
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

  deleteReceipt: async (id) => {
    try {
      set({ loading: true })
      const response = await receiptsService.deleteWithResponse(id)
      set(state => ({
        receipts: state.receipts.filter(item => item.id !== id),
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

  setSelectedReceipt: (receipt) => {
    set({ selectedReceipt: receipt })
  },

  clearError: () => {
    set({ error: null })
  },
}))
