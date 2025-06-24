import axiosInstance from '@/lib/axios'
import { 
  Status, 
  StatusResponse, 
  CreateStatusData, 
  UpdateStatusData,
  StatusFilters 
} from '@/types/administration'

class StatusService {
  private baseUrl = '/statuses'

  /**
   * Récupérer tous les statuts avec pagination
   */
  async getAll(filters?: StatusFilters): Promise<StatusResponse> {
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

    const response = await axiosInstance.get<StatusResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un statut par ID
   */
  async getById(id: number): Promise<Status> {
    const response = await axiosInstance.get<Status>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau statut
   */
  async create(data: CreateStatusData): Promise<Status> {
    const response = await axiosInstance.post<Status>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un statut
   */
  async update(id: number, data: UpdateStatusData): Promise<Status> {
    const response = await axiosInstance.put<Status>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un statut
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des statuts
   */
  async search(query: string): Promise<StatusResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const statusService = new StatusService()
export default statusService 