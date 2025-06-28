import { create } from 'zustand'
import { Payment, CreatePaymentData, UpdatePaymentData } from '@/types/comptabilite'
import { paymentService } from '@/services/paymentService'
import { toast } from 'sonner'

interface PaymentState {
  // État
  payments: Payment[]
  loading: boolean
  error: string | null
  selectedPayment: Payment | null
  
  // Actions
  fetchPayments: () => Promise<void>
  createPayment: (data: CreatePaymentData) => Promise<void>
  updatePayment: (id: number, data: UpdatePaymentData) => Promise<void>
  deletePayment: (id: number) => Promise<void>
  setSelectedPayment: (payment: Payment | null) => void
  clearError: () => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  // État initial
  payments: [],
  loading: false,
  error: null,
  selectedPayment: null,

  // Actions
  fetchPayments: async () => {
    try {
      set({ loading: true, error: null })
      const response = await paymentService.getAll()
      set({ payments: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des paiements'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createPayment: async (data: CreatePaymentData) => {
    try {
      set({ loading: true })
      const newPayment = await paymentService.create(data)
      set(state => ({ 
        payments: [...state.payments, newPayment], 
        loading: false 
      }))
      toast.success('Paiement créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updatePayment: async (id: number, data: UpdatePaymentData) => {
    try {
      set({ loading: true })
      const updatedPayment = await paymentService.update(id, data)
      set(state => ({
        payments: state.payments.map(payment =>
          payment.id === id ? updatedPayment : payment
        ),
        loading: false
      }))
      toast.success('Paiement mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deletePayment: async (id: number) => {
    try {
      set({ loading: true })
      await paymentService.delete(id)
      set(state => ({
        payments: state.payments.filter(payment => payment.id !== id),
        loading: false
      }))
      toast.success('Paiement supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedPayment: (payment: Payment | null) => {
    set({ selectedPayment: payment })
  },

  clearError: () => {
    set({ error: null })
  },
})) 