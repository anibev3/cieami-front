import axiosInstance from '@/lib/axios'
import { Vehicle, VehicleCreate, VehicleUpdate, VehicleApiResponse, VehicleFilters } from '@/types/vehicles'
import { API_CONFIG } from '@/config/api'

class VehicleService {
  /**
   * Récupérer la liste des véhicules avec pagination et filtres
   */
  async getVehicles(page: number = 1, filters?: VehicleFilters): Promise<VehicleApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.brand_id && { brand_id: filters.brand_id }),
      ...(filters?.vehicle_model_id && { vehicle_model_id: filters.vehicle_model_id }),
      ...(filters?.color_id && { color_id: filters.color_id }),
      ...(filters?.bodywork_id && { bodywork_id: filters.bodywork_id }),
    })

    const response = await axiosInstance.get<VehicleApiResponse>(`${API_CONFIG.ENDPOINTS.VEHICLES}?${params}`)
    return response.data
  }

  /**
   * Récupérer un véhicule par son ID
   */
  async getVehicle(id: number): Promise<Vehicle> {
    const response = await axiosInstance.get<Vehicle>(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau véhicule
   */
  async createVehicle(vehicleData: VehicleCreate): Promise<Vehicle> {
    console.log('vehicleService.createVehicle called with:', vehicleData)
    console.log('API endpoint:', API_CONFIG.ENDPOINTS.VEHICLES)
    const response = await axiosInstance.post<Vehicle>(API_CONFIG.ENDPOINTS.VEHICLES, vehicleData)
    console.log('API response:', response.data)
    return response.data
  }

  /**
   * Mettre à jour un véhicule
   */
  async updateVehicle(id: number, vehicleData: VehicleUpdate): Promise<Vehicle> {
    const response = await axiosInstance.put<Vehicle>(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`, vehicleData)
    return response.data
  }

  /**
   * Supprimer un véhicule
   */
  async deleteVehicle(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`)
  }
}

// Export d'une instance singleton
export const vehicleService = new VehicleService()
export default vehicleService 