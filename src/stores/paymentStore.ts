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
  
  // Pagination
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  
  // Actions
  fetchPayments: (page?: number, perPage?: number, search?: string) => Promise<void>
  fetchPaymentById: (id: number) => Promise<Payment | null>
  createPayment: (data: CreatePaymentData) => Promise<Payment>
  updatePayment: (id: number, data: UpdatePaymentData) => Promise<void>
  deletePayment: (id: number) => Promise<void>
  setSelectedPayment: (payment: Payment | null) => void
  clearError: () => void
  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  // État initial
  payments: [],
  loading: false,
  error: null,
  selectedPayment: null,

  // Pagination initiale
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  perPage: 20,
  hasNextPage: false,
  hasPrevPage: false,

  // Actions
  fetchPayments: async (page = 1, perPage = 20, search = '') => {
    try {
      set({ loading: true, error: null })
      const response = await paymentService.getAll({ page, per_page: perPage, search })
      
      // Extraire les données de pagination de la réponse API
      const { data, meta, links } = response
      
      set({ 
        payments: data, 
        loading: false,
        currentPage: meta.current_page,
        totalPages: meta.last_page,
        totalItems: meta.total,
        perPage: meta.per_page,
        hasNextPage: !!links.next,
        hasPrevPage: !!links.prev
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des paiements'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  fetchPaymentById: async (id: number): Promise<Payment | null> => {
    try {
      set({ loading: true, error: null })
      const payment = await paymentService.getById(id)
      set({ loading: false, selectedPayment: payment })
      return payment
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement du paiement'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      return null
    }
  },

  createPayment: async (data: CreatePaymentData): Promise<Payment> => {
    try {
      set({ loading: true })
      const newPayment = await paymentService.create(data)
      set(state => ({ 
        payments: [...state.payments, newPayment], 
        loading: false 
      }))
      return newPayment
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
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
      toast.error(errorMessage, {
        duration: 1000,
      })
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
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  setSelectedPayment: (payment: Payment | null) => {
    set({ selectedPayment: payment })
  },

  clearError: () => {
    set({ error: null })
  },

  setPage: (page: number) => {
    set({ currentPage: page })
  },

  setPerPage: (perPage: number) => {
    set({ perPage, currentPage: 1 }) // Retour à la première page lors du changement de taille
  },
})) 