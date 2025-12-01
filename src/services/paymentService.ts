import axiosInstance from '@/lib/axios'
import { 
  Payment, 
  PaymentResponse, 
  CreatePaymentData, 
  UpdatePaymentData,
  PaymentFilters 
} from '@/types/comptabilite'

class PaymentService {
  private baseUrl = '/payments'

  /**
   * Récupérer tous les paiements avec pagination
   */
  async getAll(filters?: PaymentFilters): Promise<PaymentResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.assignment_id) {
      params.append('assignment_id', filters.assignment_id)
    }
    if (filters?.payment_type_id) {
      params.append('payment_type_id', filters.payment_type_id)
    }
    if (filters?.payment_method_id) {
      params.append('payment_method_id', filters.payment_method_id)
    }
    if (filters?.start_date) {
      params.append('start_date', filters.start_date)
    }
    if (filters?.end_date) {
      params.append('end_date', filters.end_date)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<PaymentResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un paiement par ID
   */
  async getById(id: string): Promise<Payment> {
    const response = await axiosInstance.get<{ data: Payment }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau paiement
   */
  async create(data: CreatePaymentData): Promise<Payment> {
    const response = await axiosInstance.post<{ data: Payment }>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un paiement
   */
  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    const response = await axiosInstance.put<{ data: Payment }>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un paiement
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des paiements
   */
  async search(query: string): Promise<PaymentResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les paiements par dossier
   */
  async getByAssignment(assignmentId: string): Promise<PaymentResponse> {
    return this.getAll({ assignment_id: assignmentId })
  }

  /**
   * Récupérer les paiements par type
   */
  async getByPaymentType(paymentTypeId: string): Promise<PaymentResponse> {
    return this.getAll({ payment_type_id: paymentTypeId })
  }

  /**
   * Récupérer les paiements par méthode
   */
  async getByPaymentMethod(paymentMethodId: string): Promise<PaymentResponse> {
    return this.getAll({ payment_method_id: paymentMethodId })
  }

  /**
   * Récupérer les paiements par période
   */
  async getByDateRange(dateFrom: string, dateTo: string): Promise<PaymentResponse> {
    return this.getAll({ start_date: dateFrom, end_date: dateTo })
  }
}

// Export d'une instance singleton
export const paymentService = new PaymentService()
export default paymentService 