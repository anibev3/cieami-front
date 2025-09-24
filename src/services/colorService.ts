import axiosInstance from '@/lib/axios'
import { Color, ColorCreate, ColorUpdate, ColorApiResponse, ColorFilters } from '@/types/colors'
import { API_CONFIG } from '@/config/api'

class ColorService {
  /**
   * Récupérer la liste des couleurs avec pagination et filtres
   */
  async getColors(filters?: ColorFilters): Promise<ColorApiResponse> {
    const { data } = await axiosInstance.get(API_CONFIG.ENDPOINTS.COLORS, {
      params: {
        per_page: 25, // Pagination par défaut
        ...filters
      }
    })
    return data
  }

  /**
   * Récupérer une couleur par son ID
   */
  async getColor(id: number): Promise<Color> {
    const response = await axiosInstance.get<Color>(`${API_CONFIG.ENDPOINTS.COLORS}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle couleur
   */
  async createColor(colorData: ColorCreate): Promise<Color> {
    const response = await axiosInstance.post<Color>(API_CONFIG.ENDPOINTS.COLORS, colorData)
    return response.data
  }

  /**
   * Mettre à jour une couleur
   */
  async updateColor(id: number, colorData: ColorUpdate): Promise<Color> {
    const response = await axiosInstance.put<Color>(`${API_CONFIG.ENDPOINTS.COLORS}/${id}`, colorData)
    return response.data
  }

  /**
   * Supprimer une couleur
   */
  async deleteColor(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.COLORS}/${id}`)
  }
}

// Export d'une instance singleton
export const colorService = new ColorService()
export default colorService 