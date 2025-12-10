import axiosInstance from '@/lib/axios'
import { 
  FNESetting, 
  FNESettingResponse, 
  CreateFNESettingData, 
  UpdateFNESettingData
} from '@/types/administration'

class FNESettingService {
  private baseUrl = '/fne-settings'

  /**
   * Récupérer tous les paramètres FNE avec pagination
   */
  async getAll(): Promise<FNESettingResponse> {
    const response = await axiosInstance.get<FNESettingResponse>(this.baseUrl)
    return response.data
  }

  /**
   * Récupérer un paramètre FNE par ID
   */
  async getById(id: string): Promise<FNESetting> {
    const response = await axiosInstance.get<{status: number, message: string | null, data: FNESetting}>(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Créer un nouveau paramètre FNE
   */
  async create(data: CreateFNESettingData): Promise<FNESetting> {
    const response = await axiosInstance.post<{status: number, message: string, data: FNESetting}>(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Mettre à jour un paramètre FNE
   */
  async update(id: string, data: UpdateFNESettingData): Promise<FNESetting> {
    const response = await axiosInstance.put<{status: number, message: string, data: FNESetting}>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Supprimer un paramètre FNE
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Activer un paramètre FNE
   */
  async enable(id: string): Promise<FNESetting> {
    const response = await axiosInstance.put<{status: number, message: string, data: FNESetting}>(`${this.baseUrl}/${id}/enable`)
    return response.data.data
  }

  /**
   * Désactiver un paramètre FNE
   */
  async disable(id: string): Promise<FNESetting> {
    const response = await axiosInstance.put<{status: number, message: string, data: FNESetting}>(`${this.baseUrl}/${id}/disable`)
    return response.data.data
  }
}

// Export d'une instance singleton
export const fneSettingService = new FNESettingService()
export default fneSettingService
