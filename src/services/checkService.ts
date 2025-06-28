import axiosInstance from '@/lib/axios'
import { 
  Check, 
  CheckResponse, 
  CreateCheckData, 
  UpdateCheckData,
  CheckFilters 
} from '@/types/comptabilite'

class CheckService {
  private baseUrl = '/checks'

  /**
   * Récupérer tous les chèques avec pagination
   */
  async getAll(filters?: CheckFilters): Promise<CheckResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.payment_id) {
      params.append('payment_id', filters.payment_id)
    }
    if (filters?.bank_id) {
      params.append('bank_id', filters.bank_id)
    }
    if (filters?.date_from) {
      params.append('date_from', filters.date_from)
    }
    if (filters?.date_to) {
      params.append('date_to', filters.date_to)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<CheckResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un chèque par ID
   */
  async getById(id: number): Promise<Check> {
    const response = await axiosInstance.get<{ data: Check }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau chèque
   */
  async create(data: CreateCheckData): Promise<Check> {
    const formData = new FormData()
    formData.append('payment_id', data.payment_id)
    formData.append('bank_id', data.bank_id)
    formData.append('date', data.date)
    formData.append('amount', data.amount.toString())
    
    if (data.photo) {
      formData.append('photo', data.photo)
    }

    const response = await axiosInstance.post<{ data: Check }>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Mettre à jour un chèque
   */
  async update(id: number, data: UpdateCheckData): Promise<Check> {
    const formData = new FormData()
    
    if (data.payment_id) {
      formData.append('payment_id', data.payment_id)
    }
    if (data.bank_id) {
      formData.append('bank_id', data.bank_id)
    }
    if (data.date) {
      formData.append('date', data.date)
    }
    if (data.amount) {
      formData.append('amount', data.amount.toString())
    }
    if (data.photo) {
      formData.append('photo', data.photo)
    }

    const response = await axiosInstance.post<{ data: Check }>(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Supprimer un chèque
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des chèques
   */
  async search(query: string): Promise<CheckResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les chèques par paiement
   */
  async getByPayment(paymentId: string): Promise<CheckResponse> {
    return this.getAll({ payment_id: paymentId })
  }

  /**
   * Récupérer les chèques par banque
   */
  async getByBank(bankId: string): Promise<CheckResponse> {
    return this.getAll({ bank_id: bankId })
  }

  /**
   * Récupérer les chèques par période
   */
  async getByDateRange(dateFrom: string, dateTo: string): Promise<CheckResponse> {
    return this.getAll({ date_from: dateFrom, date_to: dateTo })
  }
}

// Export d'une instance singleton
export const checkService = new CheckService()
export default checkService 