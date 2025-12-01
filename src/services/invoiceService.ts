import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { 
  Invoice, 
  InvoiceResponse, 
  InvoiceDetailResponse,
  CreateInvoiceData, 
  UpdateInvoiceData,
  InvoiceFilters 
} from '@/types/comptabilite'

class InvoiceService {
  private baseUrl = API_CONFIG.ENDPOINTS.INVOICES

  /**
   * Récupérer toutes les factures avec pagination
   */
  async getAll(filters?: InvoiceFilters): Promise<InvoiceResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.start_date) {
      params.append('start_date', filters.start_date)
    }
    if (filters?.end_date) {
      params.append('end_date', filters.end_date)
    }
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.assignment_reference) {
      params.append('assignment_reference', filters.assignment_reference)
    }
    if (filters?.amount_min) {
      params.append('amount_min', filters.amount_min)
    }
    if (filters?.amount_max) {
      params.append('amount_max', filters.amount_max)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<InvoiceResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer une facture par ID
   */
  async getById(id: number): Promise<Invoice> {
    const response = await axiosInstance.get<InvoiceDetailResponse>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer une nouvelle facture
   */
  async create(data: CreateInvoiceData): Promise<Invoice> {
    const response = await axiosInstance.post<InvoiceDetailResponse>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour une facture
   */
  async update(id: number, data: UpdateInvoiceData): Promise<Invoice> {
    const response = await axiosInstance.put<InvoiceDetailResponse>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer une facture
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des factures
   */
  async search(query: string): Promise<InvoiceResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les factures par date
   */
  async getByDateRange(dateFrom: string, dateTo: string): Promise<InvoiceResponse> {
    return this.getAll({ start_date: dateFrom, end_date: dateTo })
  }

  /**
   * Récupérer les factures par statut
   */
  async getByStatus(status: string): Promise<InvoiceResponse> {
    return this.getAll({ status })
  }

  /**
   * Récupérer les factures par référence d'assignation
   */
  async getByAssignmentReference(reference: string): Promise<InvoiceResponse> {
    return this.getAll({ assignment_reference: reference })
  }

  /**
   * Annuler une facture
   */
  async cancelInvoice(id: number): Promise<Invoice> {
    const response = await axiosInstance.put<InvoiceDetailResponse>(`${this.baseUrl}/${id}/cancel`)
    return response.data.data
  }

  /**
   * Générer une facture (PDF ou autre)
   */
  async generateInvoice(id: number): Promise<Invoice> {
    const response = await axiosInstance.put<InvoiceDetailResponse>(`${this.baseUrl}/${id}/generate`)
    return response.data.data
  }
}

// Export d'une instance singleton
export const invoiceService = new InvoiceService()
export default invoiceService 