import axiosInstance from '@/lib/axios'
import { 
  StatusDeadline, 
  StatusDeadlineResponse, 
  CreateStatusDeadlineData, 
  UpdateStatusDeadlineData
} from '@/types/administration'

class StatusDeadlineService {
  private baseUrl = '/status-deadlines'

  /**
   * Récupérer tous les délais de statuts avec pagination
   */
  async getAll(): Promise<StatusDeadlineResponse> {
    const response = await axiosInstance.get<StatusDeadlineResponse>(this.baseUrl)
    return response.data
  }

  /**
   * Récupérer un délai de statut par ID
   */
  async getById(id: string): Promise<StatusDeadline> {
    const response = await axiosInstance.get<{status: number, message: string | null, data: StatusDeadline}>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau délai de statut
   */
  async create(data: CreateStatusDeadlineData): Promise<StatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: StatusDeadline}>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un délai de statut
   */
  async update(id: string, data: UpdateStatusDeadlineData): Promise<StatusDeadline> {
    const response = await axiosInstance.put<{status: number, message: string, data: StatusDeadline}>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un délai de statut
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Activer un délai de statut
   */
  async enable(id: string): Promise<StatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: StatusDeadline}>(`${this.baseUrl}/${id}/enable`)
    return response.data.data
  }

  /**
   * Désactiver un délai de statut
   */
  async disable(id: string): Promise<StatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: StatusDeadline}>(`${this.baseUrl}/${id}/disable`)
    return response.data.data
  }
}

// Export d'une instance singleton
export const statusDeadlineService = new StatusDeadlineService()
export default statusDeadlineService
