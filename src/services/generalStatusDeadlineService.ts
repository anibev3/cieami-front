import axiosInstance from '@/lib/axios'
import { 
  GeneralStatusDeadline, 
  GeneralStatusDeadlineResponse, 
  CreateGeneralStatusDeadlineData, 
  UpdateGeneralStatusDeadlineData
} from '@/types/administration'

class GeneralStatusDeadlineService {
  private baseUrl = '/general-status-deadlines'

  /**
   * Récupérer tous les délais de statuts généraux avec pagination
   */
  async getAll(): Promise<GeneralStatusDeadlineResponse> {
    const response = await axiosInstance.get<GeneralStatusDeadlineResponse>(this.baseUrl)
    return response.data
  }

  /**
   * Récupérer un délai de statut général par ID
   */
  async getById(id: string): Promise<GeneralStatusDeadline> {
    const response = await axiosInstance.get<{status: number, message: string | null, data: GeneralStatusDeadline}>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau délai de statut général
   */
  async create(data: CreateGeneralStatusDeadlineData): Promise<GeneralStatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: GeneralStatusDeadline}>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un délai de statut général
   */
  async update(id: string, data: UpdateGeneralStatusDeadlineData): Promise<GeneralStatusDeadline> {
    const response = await axiosInstance.put<{status: number, message: string, data: GeneralStatusDeadline}>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un délai de statut général
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Activer un délai de statut général
   */
  async enable(id: string): Promise<GeneralStatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: GeneralStatusDeadline}>(`${this.baseUrl}/${id}/enable`)
    return response.data.data
  }

  /**
   * Désactiver un délai de statut général
   */
  async disable(id: string): Promise<GeneralStatusDeadline> {
    const response = await axiosInstance.post<{status: number, message: string, data: GeneralStatusDeadline}>(`${this.baseUrl}/${id}/disable`)
    return response.data.data
  }
}

// Export d'une instance singleton
export const generalStatusDeadlineService = new GeneralStatusDeadlineService()
export default generalStatusDeadlineService
