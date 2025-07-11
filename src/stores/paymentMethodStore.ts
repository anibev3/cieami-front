import { create } from 'zustand'
import { PaymentMethod, CreatePaymentMethodData, UpdatePaymentMethodData } from '@/types/comptabilite'
import { paymentMethodService } from '@/services/paymentMethodService'
import { toast } from 'sonner'

interface PaymentMethodState {
  // État
  paymentMethods: PaymentMethod[]
  loading: boolean
  error: string | null
  selectedPaymentMethod: PaymentMethod | null
  
  // Actions
  fetchPaymentMethods: () => Promise<void>
  createPaymentMethod: (data: CreatePaymentMethodData) => Promise<void>
  updatePaymentMethod: (id: number, data: UpdatePaymentMethodData) => Promise<void>
  deletePaymentMethod: (id: number) => Promise<void>
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod | null) => void
  clearError: () => void
}

export const usePaymentMethodStore = create<PaymentMethodState>((set) => ({
  // État initial
  paymentMethods: [],
  loading: false,
  error: null,
  selectedPaymentMethod: null,

  // Actions
  fetchPaymentMethods: async () => {
    try {
      set({ loading: true, error: null })
      const response = await paymentMethodService.getAll()
      set({ paymentMethods: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des méthodes de paiement'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createPaymentMethod: async (data: CreatePaymentMethodData) => {
    try {
      set({ loading: true })
      const newPaymentMethod = await paymentMethodService.create(data)
      set(state => ({ 
        paymentMethods: [...state.paymentMethods, newPaymentMethod], 
        loading: false 
      }))
      toast.success('Méthode de paiement créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updatePaymentMethod: async (id: number, data: UpdatePaymentMethodData) => {
    try {
      set({ loading: true })
      const updatedPaymentMethod = await paymentMethodService.update(id, data)
      set(state => ({
        paymentMethods: state.paymentMethods.map(paymentMethod =>
          paymentMethod.id === id ? updatedPaymentMethod : paymentMethod
        ),
        loading: false
      }))
      toast.success('Méthode de paiement mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deletePaymentMethod: async (id: number) => {
    try {
      set({ loading: true })
      await paymentMethodService.delete(id)
      set(state => ({
        paymentMethods: state.paymentMethods.filter(paymentMethod => paymentMethod.id !== id),
        loading: false
      }))
      toast.success('Méthode de paiement supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedPaymentMethod: (paymentMethod: PaymentMethod | null) => {
    set({ selectedPaymentMethod: paymentMethod })
  },

  clearError: () => {
    set({ error: null })
  },
})) 