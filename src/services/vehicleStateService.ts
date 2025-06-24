import axiosInstance from '@/lib/axios'
import { VehicleState, VehicleStateCreate, VehicleStateUpdate, VehicleStateApiResponse, VehicleStateFilters } from '@/types/vehicle-states'
import { API_CONFIG } from '@/config/api'

class VehicleStateService {
  /**
   * Récupérer la liste des états de véhicules avec pagination et filtres
   */
  async getVehicleStates(page: number = 1, filters?: VehicleStateFilters): Promise<VehicleStateApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
    })

    const response = await axiosInstance.get<VehicleStateApiResponse>(`${API_CONFIG.ENDPOINTS.VEHICLE_STATES}?${params}`)
    return response.data
  }

  /**
   * Récupérer un état de véhicule par son ID
   */
  async getVehicleState(id: number): Promise<VehicleState> {
    const response = await axiosInstance.get<VehicleState>(`${API_CONFIG.ENDPOINTS.VEHICLE_STATES}/${id}`)
    return response.data
  }

  /**
   * Créer un nouvel état de véhicule
   */
  async createVehicleState(vehicleStateData: VehicleStateCreate): Promise<VehicleState> {
    const response = await axiosInstance.post<VehicleState>(API_CONFIG.ENDPOINTS.VEHICLE_STATES, vehicleStateData)
    return response.data
  }

  /**
   * Mettre à jour un état de véhicule
   */
  async updateVehicleState(id: number, vehicleStateData: VehicleStateUpdate): Promise<VehicleState> {
    const response = await axiosInstance.put<VehicleState>(`${API_CONFIG.ENDPOINTS.VEHICLE_STATES}/${id}`, vehicleStateData)
    return response.data
  }

  /**
   * Supprimer un état de véhicule
   */
  async deleteVehicleState(id: number): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.VEHICLE_STATES}/${id}`)
  }
}

// Export d'une instance singleton
export const vehicleStateService = new VehicleStateService()
export default vehicleStateService 