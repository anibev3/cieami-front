import axiosInstance from '@/lib/axios'
import {
  TechnicalConclusionCreate,
  TechnicalConclusionUpdate,
  TechnicalConclusionsResponse,
  TechnicalConclusionResponse,
} from '@/types/technical-conclusions'

class TechnicalConclusionsService {
  private baseUrl = '/technical-conclusions'

  async getAll(page = 1): Promise<TechnicalConclusionsResponse> {
    const response = await axiosInstance.get(`${this.baseUrl}?page=${page}`)
    return response.data
  }

  async getById(id: number): Promise<TechnicalConclusionResponse> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: TechnicalConclusionCreate): Promise<TechnicalConclusionResponse> {
    const response = await axiosInstance.post(this.baseUrl, data)
    return response.data
  }

  async update(id: number, data: TechnicalConclusionUpdate): Promise<TechnicalConclusionResponse> {
    const response = await axiosInstance.put(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

export const technicalConclusionsService = new TechnicalConclusionsService() 