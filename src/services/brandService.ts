import axiosInstance from '@/lib/axios'
import { Brand, BrandCreate, BrandUpdate, BrandApiResponse, BrandFilters } from '@/types/brands'
import { API_CONFIG } from '@/config/api'

class BrandService {
  /**
   * Récupérer la liste des marques avec pagination et filtres
   */
  async getBrands(page: number = 1, filters?: BrandFilters): Promise<BrandApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
    })

    const response = await axiosInstance.get<BrandApiResponse>(`${API_CONFIG.ENDPOINTS.BRANDS}?${params}&per_page=1000000`)
    return response.data
  }

  /**
   * Récupérer une marque par son ID
   */
  async getBrand(id: number): Promise<Brand> {
    const response = await axiosInstance.get<Brand>(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`)
    return response.data
  }

  /**
   * Créer une nouvelle marque
   */
  async createBrand(brandData: BrandCreate): Promise<Brand> {
    const response = await axiosInstance.post<Brand>(API_CONFIG.ENDPOINTS.BRANDS, brandData)
    return response.data
  }

  /**
   * Mettre à jour une marque
   */
  async updateBrand(id: number, brandData: BrandUpdate): Promise<Brand> {
    const response = await axiosInstance.put<Brand>(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`, brandData)
    return response.data
  }

  /**
   * Supprimer une marque
   */
  async deleteBrand(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.BRANDS}/${id}`)
  }
}

// Export d'une instance singleton
export const brandService = new BrandService()
export default brandService 