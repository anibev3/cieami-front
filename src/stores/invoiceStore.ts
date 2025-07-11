import { create } from 'zustand'
import { Invoice, CreateInvoiceData, UpdateInvoiceData, InvoiceFilters } from '@/types/comptabilite'
import { invoiceService } from '@/services/invoiceService'
import { toast } from 'sonner'

interface InvoiceState {
  // État
  invoices: Invoice[]
  loading: boolean
  error: string | null
  selectedInvoice: Invoice | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  
  // Actions
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>
  fetchInvoiceById: (id: number) => Promise<void>
  createInvoice: (data: CreateInvoiceData) => Promise<Invoice>
  updateInvoice: (id: number, data: UpdateInvoiceData) => Promise<void>
  deleteInvoice: (id: number) => Promise<void>
  setSelectedInvoice: (invoice: Invoice | null) => void
  clearError: () => void
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  // État initial
  invoices: [],
  loading: false,
  error: null,
  selectedInvoice: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  },

  // Actions
  fetchInvoices: async (filters?: InvoiceFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await invoiceService.getAll(filters)
      set({ 
        invoices: response.data, 
        pagination: {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des factures'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  fetchInvoiceById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const invoice = await invoiceService.getById(id)
      set({ selectedInvoice: invoice, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de la facture'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createInvoice: async (data: CreateInvoiceData) => {
    try {
      set({ loading: true })
      const response = await invoiceService.create(data)
      // La réponse API ne contient que les informations de base
      // On ne peut pas l'ajouter directement à la liste car il manque les détails
      // La liste sera rechargée après création
      set({ loading: false })
      toast.success('Facture créée avec succès')
      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateInvoice: async (id: number, data: UpdateInvoiceData) => {
    try {
      set({ loading: true })
      const updatedInvoice = await invoiceService.update(id, data)
      set(state => ({
        invoices: state.invoices.map(invoice =>
          invoice.id === id ? updatedInvoice : invoice
        ),
        selectedInvoice: state.selectedInvoice?.id === id ? updatedInvoice : state.selectedInvoice,
        loading: false
      }))
      toast.success('Facture mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteInvoice: async (id: number) => {
    try {
      set({ loading: true })
      await invoiceService.delete(id)
      set(state => ({
        invoices: state.invoices.filter(invoice => invoice.id !== id),
        selectedInvoice: state.selectedInvoice?.id === id ? null : state.selectedInvoice,
        loading: false
      }))
      toast.success('Facture supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedInvoice: (invoice: Invoice | null) => {
    set({ selectedInvoice: invoice })
  },

  clearError: () => {
    set({ error: null })
  },
})) 