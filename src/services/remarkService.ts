import axiosInstance from '@/lib/axios'
import { 
  Remark, 
  RemarkResponse, 
  CreateRemarkData, 
  UpdateRemarkData
} from '@/types/administration'

class RemarkService {
  private baseUrl = '/remarks'

  /**
   * Récupérer toutes les remarques
   */
  async getAll(): Promise<RemarkResponse> {
    const response = await axiosInstance.get<RemarkResponse>(`${this.baseUrl}?per_page=100000`)
    return response.data
  }

  /**
   * Récupérer une remarque par ID
   */
  async getById(id: number): Promise<Remark> {
    const response = await axiosInstance.get<Remark>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle remarque
   */
  async create(data: CreateRemarkData): Promise<Remark> {
    const response = await axiosInstance.post<Remark>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour une remarque
   */
  async update(id: number, data: UpdateRemarkData): Promise<Remark> {
    const response = await axiosInstance.put<Remark>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer une remarque
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

// Export d'une instance singleton
export const remarkService = new RemarkService()
export default remarkService 