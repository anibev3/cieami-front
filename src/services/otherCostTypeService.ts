import axiosInstance from '@/lib/axios'
import {
  OtherCostType,
  OtherCostTypeResponse,
  CreateOtherCostTypeData,
  UpdateOtherCostTypeData,
  OtherCostTypeFilters
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
    const response = await axiosInstance.post<OtherCostType>(this.baseUrl, data)
    return response.data
  }

  async update(id: number | string, data: UpdateOtherCostTypeData): Promise<OtherCostType> {
    const response = await axiosInstance.put<OtherCostType>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async delete(id: number | string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

export const otherCostTypeService = new OtherCostTypeService()
export default otherCostTypeService 