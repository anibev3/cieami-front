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
    const response = await axiosInstance.get<ClaimNatureResponse>(`${this.baseUrl}?per_page=100000`)
    return response.data
  }

  /**
   * Récupérer une nature de sinistre par ID
   */
  async getById(id: number): Promise<ClaimNature> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`)
    // Certaines API renvoient { status, message, data }
    return (response.data?.data ?? response.data) as ClaimNature
  }

  /**
   * Créer une nouvelle nature de sinistre
   */
  async create(data: CreateClaimNatureData): Promise<ClaimNature> {
    const response = await axiosInstance.post(this.baseUrl, data)
    // Gérer les réponses enveloppées: { status, message, data }
    return (response.data?.data ?? response.data) as ClaimNature
  }

  /**
   * Mettre à jour une nature de sinistre
   */
  async update(id: number, data: UpdateClaimNatureData): Promise<ClaimNature> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data)
    return (response.data?.data ?? response.data) as ClaimNature
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