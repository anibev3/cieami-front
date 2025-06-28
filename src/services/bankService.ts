import axiosInstance from '@/lib/axios'
import { 
  Bank, 
  BankResponse, 
  CreateBankData, 
  UpdateBankData,
  BankFilters 
} from '@/types/comptabilite'

class BankService {
  private baseUrl = '/banks'

  /**
   * Récupérer toutes les banques avec pagination
   */
  async getAll(filters?: BankFilters): Promise<BankResponse> {
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

    const response = await axiosInstance.get<BankResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer une banque par ID
   */
  async getById(id: number): Promise<Bank> {
    const response = await axiosInstance.get<{ data: Bank }>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer une nouvelle banque
   */
  async create(data: CreateBankData): Promise<Bank> {
    const response = await axiosInstance.post<{ data: Bank }>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour une banque
   */
  async update(id: number, data: UpdateBankData): Promise<Bank> {
    const response = await axiosInstance.post<{ data: Bank }>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer une banque
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des banques
   */
  async search(query: string): Promise<BankResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const bankService = new BankService()
export default bankService 