import axiosInstance from '@/lib/axios'
import { 
  PaymentType, 
  PaymentTypeResponse, 
  CreatePaymentTypeData, 
  UpdatePaymentTypeData,
  PaymentTypeFilters 
} from '@/types/comptabilite'

class PaymentTypeService {
  private baseUrl = '/payment-types'

  /**
   * Récupérer tous les types de paiement avec pagination
   */
  async getAll(filters?: PaymentTypeFilters): Promise<PaymentTypeResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<PaymentTypeResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un type de paiement par ID
   */
  async getById(id: number): Promise<PaymentType> {
    const response = await axiosInstance.get<{ data: PaymentType }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau type de paiement
   */
  async create(data: CreatePaymentTypeData): Promise<PaymentType> {
    const response = await axiosInstance.post<{ data: PaymentType }>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un type de paiement
   */
  async update(id: number, data: UpdatePaymentTypeData): Promise<PaymentType> {
    const response = await axiosInstance.post<{ data: PaymentType }>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un type de paiement
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des types de paiement
   */
  async search(query: string): Promise<PaymentTypeResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const paymentTypeService = new PaymentTypeService()
export default paymentTypeService 