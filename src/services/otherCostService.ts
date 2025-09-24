import axiosInstance from '@/lib/axios'
import {
  OtherCost,
  OtherCostResponse,
  CreateOtherCostData,
  UpdateOtherCostData,
  OtherCostFilters,
  OtherCostCreateResponse,
  OtherCostUpdateResponse,
  OtherCostDeleteResponse
} from '@/types/administration'

class OtherCostService {
  private baseUrl = '/other-costs'

  async getAll(filters?: OtherCostFilters): Promise<OtherCostResponse> {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.other_cost_type_id) params.append('other_cost_type_id', filters.other_cost_type_id.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())
    const response = await axiosInstance.get<OtherCostResponse>(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getById(id: number): Promise<OtherCost> {
    const response = await axiosInstance.get<OtherCost>(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: CreateOtherCostData): Promise<OtherCost> {
    const response = await axiosInstance.post<OtherCostCreateResponse>(this.baseUrl, data)
    return response.data.data
  }

  async update(id: number | string, data: UpdateOtherCostData): Promise<OtherCost> {
    const response = await axiosInstance.put<OtherCostUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  async delete(id: number | string): Promise<void> {
    const response = await axiosInstance.delete<OtherCostDeleteResponse>(`${this.baseUrl}/${id}`)
    // La réponse de suppression peut ne pas contenir de data, donc on ne retourne rien
  }

  // Méthodes qui retournent les réponses complètes avec messages
  async createWithResponse(data: CreateOtherCostData): Promise<OtherCostCreateResponse> {
    const response = await axiosInstance.post<OtherCostCreateResponse>(this.baseUrl, data)
    return response.data
  }

  async updateWithResponse(id: number | string, data: UpdateOtherCostData): Promise<OtherCostUpdateResponse> {
    const response = await axiosInstance.put<OtherCostUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteWithResponse(id: number | string): Promise<OtherCostDeleteResponse> {
    const response = await axiosInstance.delete<OtherCostDeleteResponse>(`${this.baseUrl}/${id}`)
    return response.data
  }
}

export const otherCostService = new OtherCostService()
export default otherCostService
