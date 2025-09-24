import axiosInstance from '@/lib/axios'
import {
  OtherCostType,
  OtherCostTypeResponse,
  CreateOtherCostTypeData,
  UpdateOtherCostTypeData,
  OtherCostTypeFilters,
  OtherCostTypeCreateResponse,
  OtherCostTypeUpdateResponse,
  OtherCostTypeDeleteResponse
} from '@/types/administration'

class OtherCostTypeService {
  private baseUrl = '/other-cost-types'

  async getAll(filters?: OtherCostTypeFilters): Promise<OtherCostTypeResponse> {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.per_page) params.append('per_page', filters.per_page.toString())
    const response = await axiosInstance.get<OtherCostTypeResponse>(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getById(id: number): Promise<OtherCostType> {
    const response = await axiosInstance.get<OtherCostType>(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: CreateOtherCostTypeData): Promise<OtherCostType> {
    const response = await axiosInstance.post<OtherCostTypeCreateResponse>(this.baseUrl, data)
    return response.data.data
  }

  async update(id: number | string, data: UpdateOtherCostTypeData): Promise<OtherCostType> {
    const response = await axiosInstance.put<OtherCostTypeUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  async delete(id: number | string): Promise<void> {
    const response = await axiosInstance.delete<OtherCostTypeDeleteResponse>(`${this.baseUrl}/${id}`)
    // La réponse de suppression peut ne pas contenir de data, donc on ne retourne rien
  }

  // Méthodes qui retournent les réponses complètes avec messages
  async createWithResponse(data: CreateOtherCostTypeData): Promise<OtherCostTypeCreateResponse> {
    const response = await axiosInstance.post<OtherCostTypeCreateResponse>(this.baseUrl, data)
    return response.data
  }

  async updateWithResponse(id: number | string, data: UpdateOtherCostTypeData): Promise<OtherCostTypeUpdateResponse> {
    const response = await axiosInstance.put<OtherCostTypeUpdateResponse>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteWithResponse(id: number | string): Promise<OtherCostTypeDeleteResponse> {
    const response = await axiosInstance.delete<OtherCostTypeDeleteResponse>(`${this.baseUrl}/${id}`)
    return response.data
  }
}

export const otherCostTypeService = new OtherCostTypeService()
export default otherCostTypeService 