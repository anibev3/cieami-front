import axiosInstance from '@/lib/axios'
import { VehicleModel, VehicleModelCreate, VehicleModelUpdate, VehicleModelApiResponse, VehicleModelFilters } from '@/types/vehicle-models'
import { API_CONFIG } from '@/config/api'

class VehicleModelService {
  /**
   * Récupérer la liste des modèles de véhicules avec pagination et filtres
   */
  async getVehicleModels(page: number = 1, filters?: VehicleModelFilters): Promise<VehicleModelApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.brand_id && { brand_id: filters.brand_id }),
    })

    const isSelectedParam = filters?.is_selected ? `&per_page=100000` : '';
    const response = await axiosInstance.get<VehicleModelApiResponse>(`${API_CONFIG.ENDPOINTS.VEHICLE_MODELS}?${params}${isSelectedParam}`)
    return response.data
  }

  /**
   * Récupérer un modèle de véhicule par son ID
   */
  async getVehicleModel(id: number): Promise<VehicleModel> {
    const response = await axiosInstance.get<VehicleModel>(`${API_CONFIG.ENDPOINTS.VEHICLE_MODELS}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau modèle de véhicule
   */
  async createVehicleModel(vehicleModelData: VehicleModelCreate): Promise<VehicleModel> {
    const response = await axiosInstance.post<VehicleModel>(API_CONFIG.ENDPOINTS.VEHICLE_MODELS, vehicleModelData)
    return response.data
  }

  /**
   * Mettre à jour un modèle de véhicule
   */
  async updateVehicleModel(id: number, vehicleModelData: VehicleModelUpdate): Promise<VehicleModel> {
    const response = await axiosInstance.put<VehicleModel>(`${API_CONFIG.ENDPOINTS.VEHICLE_MODELS}/${id}`, vehicleModelData)
    return response.data
  }

  /**
   * Supprimer un modèle de véhicule
   */
  async deleteVehicleModel(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.VEHICLE_MODELS}/${id}`)
  }
}

// Export d'une instance singleton
export const vehicleModelService = new VehicleModelService()
export default vehicleModelService 