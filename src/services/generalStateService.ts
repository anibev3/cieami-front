import axiosInstance from '@/lib/axios'
import { 
  GeneralState, 
  GeneralStateResponse, 
  CreateGeneralStateData, 
  UpdateGeneralStateData,
  GeneralStateFilters 
} from '@/types/administration'

class GeneralStateService {
  private baseUrl = '/general-states'

  /**
   * Récupérer tous les états généraux avec pagination
   */
  async getAll(filters?: GeneralStateFilters): Promise<GeneralStateResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.status) {
      params.append('status', filters.status)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<GeneralStateResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un état général par ID
   */
  async getById(id: number): Promise<GeneralState> {
    const response = await axiosInstance.get<GeneralState>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouvel état général
   */
  async create(data: CreateGeneralStateData): Promise<GeneralState> {
    const response = await axiosInstance.post<GeneralState>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un état général
   */
  async update(id: number, data: UpdateGeneralStateData): Promise<GeneralState> {
    const response = await axiosInstance.put<GeneralState>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un état général
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des états généraux
   */
  async search(query: string): Promise<GeneralStateResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les états généraux par statut
   */
  async getByStatus(status: string): Promise<GeneralStateResponse> {
    return this.getAll({ status })
  }
}

// Export d'une instance singleton
export const generalStateService = new GeneralStateService()
export default generalStateService 