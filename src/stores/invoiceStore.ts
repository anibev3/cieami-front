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
  
  // Statistiques
  totalAmount: string
  exportUrl: string | null
  
  // Actions
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>
  fetchInvoiceById: (id: number) => Promise<void>
  createInvoice: (data: CreateInvoiceData) => Promise<Invoice>
  updateInvoice: (id: number, data: UpdateInvoiceData) => Promise<void>
  deleteInvoice: (id: number) => Promise<void>
  setSelectedInvoice: (invoice: Invoice | null) => void
  clearError: () => void
  cancelInvoice: (id: number) => Promise<string>
  generateInvoice: (id: number) => Promise<string>
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
  
  // Statistiques initiales
  totalAmount: "0.00",
  exportUrl: null,

  // Actions
  fetchInvoices: async (filters?: InvoiceFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await invoiceService.getAll(filters)
      const { data, meta, total_amount, export_url } = response
      
      set({ 
        invoices: data, 
        pagination: {
          current_page: meta.current_page,
          last_page: meta.last_page,
          per_page: meta.per_page,
          total: meta.total
        },
        totalAmount: total_amount || "0.00",
        exportUrl: export_url || null,
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
      set({ loading: false })
      // L'erreur est gérée par l'intercepteur axios
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

  cancelInvoice: async (id: number): Promise<string> => {
    try {
      set({ loading: true })
      const updatedInvoice = await invoiceService.cancelInvoice(id)
      set(state => ({
        invoices: state.invoices.map(invoice => invoice.id === id ? updatedInvoice : invoice),
        selectedInvoice: state.selectedInvoice?.id === id ? updatedInvoice : state.selectedInvoice,
        loading: false
      }))
      const updatedInvoiceAny = updatedInvoice as { message?: string }
      return updatedInvoiceAny.message || 'Facture annulée avec succès'
    } catch (error: unknown) {
      set({ loading: false })
      const err = error as { response?: { data?: { errors?: { detail?: string }[] } } }
      if (err?.response?.data?.errors?.[0]?.detail) {
        return err.response.data.errors[0].detail
      }
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'annulation'
      return errorMessage
    }
  },

  generateInvoice: async (id: number): Promise<string> => {
    try {
      set({ loading: true })
      const updatedInvoice = await invoiceService.generateInvoice(id)
      set(state => ({
        invoices: state.invoices.map(invoice => invoice.id === id ? updatedInvoice : invoice),
        selectedInvoice: state.selectedInvoice?.id === id ? updatedInvoice : state.selectedInvoice,
        loading: false
      }))
      const updatedInvoiceAny = updatedInvoice as { message?: string }
      return updatedInvoiceAny.message || 'Facture générée avec succès'
    } catch (error: unknown) {
      set({ loading: false })
      const err = error as { response?: { data?: { errors?: { detail?: string }[] } } }
      if (err?.response?.data?.errors?.[0]?.detail) {
        return err.response.data.errors[0].detail
      }
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération'
      return errorMessage
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 