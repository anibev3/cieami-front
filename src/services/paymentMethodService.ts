import axiosInstance from '@/lib/axios'
import { 
  PaymentMethod, 
  PaymentMethodResponse, 
  CreatePaymentMethodData, 
  UpdatePaymentMethodData,
  PaymentMethodFilters 
} from '@/types/comptabilite'

class PaymentMethodService {
  private baseUrl = '/payment-methods'

  /**
   * Récupérer toutes les méthodes de paiement avec pagination
   */
  async getAll(filters?: PaymentMethodFilters): Promise<PaymentMethodResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    // if (filters?.per_page) {
    //   params.append('per_page', filters.per_page.toString())
    // }

    

    const response = await axiosInstance.get<PaymentMethodResponse>(
      `${this.baseUrl}?${params.toString()}&per_page=20`
    )
    return response.data
  }

  /**
   * Récupérer une méthode de paiement par ID
   */
  async getById(id: number): Promise<PaymentMethod> {
    const response = await axiosInstance.get<{ data: PaymentMethod }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer une nouvelle méthode de paiement
   */
  async create(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    const response = await axiosInstance.post<{ data: PaymentMethod }>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour une méthode de paiement
   */
  async update(id: number, data: UpdatePaymentMethodData): Promise<PaymentMethod> {
    const response = await axiosInstance.post<{ data: PaymentMethod }>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer une méthode de paiement
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des méthodes de paiement
   */
  async search(query: string): Promise<PaymentMethodResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const paymentMethodService = new PaymentMethodService()
export default paymentMethodService 