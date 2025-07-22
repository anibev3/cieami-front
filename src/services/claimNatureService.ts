import axiosInstance from '@/lib/axios'
import { 
  ClaimNature, 
  ClaimNatureResponse, 
  CreateClaimNatureData, 
  UpdateClaimNatureData
} from '@/types/administration'

class ClaimNatureService {
  private baseUrl = '/claim-natures'

  /**
   * Récupérer toutes les natures de sinistres
   */
  async getAll(): Promise<ClaimNatureResponse> {
    const response = await axiosInstance.get<ClaimNatureResponse>(this.baseUrl)
    return response.data
  }

  /**
   * Récupérer une nature de sinistre par ID
   */
  async getById(id: number): Promise<ClaimNature> {
    const response = await axiosInstance.get<ClaimNature>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle nature de sinistre
   */
  async create(data: CreateClaimNatureData): Promise<ClaimNature> {
    const response = await axiosInstance.post<ClaimNature>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour une nature de sinistre
   */
  async update(id: number, data: UpdateClaimNatureData): Promise<ClaimNature> {
    const response = await axiosInstance.put<ClaimNature>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer une nature de sinistre
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

// Export d'une instance singleton
export const claimNatureService = new ClaimNatureService()
export default claimNatureService 