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
   * Ajouter un statut par défaut si absent
   */
  private addDefaultStatus(bank: Bank): Bank {
    if (!bank.status) {
      bank.status = {
        id: 1,
        code: 'active',
        label: 'Actif(ve)',
        description: 'Actif(ve)'
      }
    }
    return bank
  }

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
    
    // Ajouter un statut par défaut pour chaque banque si absent
    const banksWithStatus = response.data.data.map(bank => this.addDefaultStatus(bank))
    
    return {
      ...response.data,
      data: banksWithStatus
    }
  }

  /**
   * Récupérer une banque par ID
   */
  async getById(id: number): Promise<Bank> {
    const response = await axiosInstance.get<{ data: Bank }>(`${this.baseUrl}/${id}`)
    const bankData = response.data.data
    return this.addDefaultStatus(bankData)
  }

  /**
   * Créer une nouvelle banque
   */
  async create(data: CreateBankData): Promise<Bank> {
    const response = await axiosInstance.post<{ data: Bank }>(this.baseUrl, data)
    // L'API retourne directement l'objet banque dans data
    const bankData = response.data.data
    return this.addDefaultStatus(bankData)
  }

  /**
   * Mettre à jour une banque
   */
  async update(id: number, data: UpdateBankData): Promise<Bank> {
    const response = await axiosInstance.put<{ data: Bank }>(`${this.baseUrl}/${id}`, data)
    const bankData = response.data.data
    return this.addDefaultStatus(bankData)
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