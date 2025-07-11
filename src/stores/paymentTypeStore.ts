import { create } from 'zustand'
import { PaymentType, CreatePaymentTypeData, UpdatePaymentTypeData } from '@/types/comptabilite'
import { paymentTypeService } from '@/services/paymentTypeService'
import { toast } from 'sonner'

interface PaymentTypeState {
  // État
  paymentTypes: PaymentType[]
  loading: boolean
  error: string | null
  selectedPaymentType: PaymentType | null
  
  // Actions
  fetchPaymentTypes: () => Promise<void>
  createPaymentType: (data: CreatePaymentTypeData) => Promise<void>
  updatePaymentType: (id: number, data: UpdatePaymentTypeData) => Promise<void>
  deletePaymentType: (id: number) => Promise<void>
  setSelectedPaymentType: (paymentType: PaymentType | null) => void
  clearError: () => void
}

export const usePaymentTypeStore = create<PaymentTypeState>((set) => ({
  // État initial
  paymentTypes: [],
  loading: false,
  error: null,
  selectedPaymentType: null,

  // Actions
  fetchPaymentTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await paymentTypeService.getAll()
      set({ paymentTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des types de paiement'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createPaymentType: async (data: CreatePaymentTypeData) => {
    try {
      set({ loading: true })
      const newPaymentType = await paymentTypeService.create(data)
      set(state => ({ 
        paymentTypes: [...state.paymentTypes, newPaymentType], 
        loading: false 
      }))
      toast.success('Type de paiement créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updatePaymentType: async (id: number, data: UpdatePaymentTypeData) => {
    try {
      set({ loading: true })
      const updatedPaymentType = await paymentTypeService.update(id, data)
      set(state => ({
        paymentTypes: state.paymentTypes.map(paymentType =>
          paymentType.id === id ? updatedPaymentType : paymentType
        ),
        loading: false
      }))
      toast.success('Type de paiement mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deletePaymentType: async (id: number) => {
    try {
      set({ loading: true })
      await paymentTypeService.delete(id)
      set(state => ({
        paymentTypes: state.paymentTypes.filter(paymentType => paymentType.id !== id),
        loading: false
      }))
      toast.success('Type de paiement supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedPaymentType: (paymentType: PaymentType | null) => {
    set({ selectedPaymentType: paymentType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 