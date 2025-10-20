import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { CreateInsurerRelationshipBody, InsurerRelationshipsResponse, InsurerRelationship } from '@/types/insurer-relationships'

const BASE_URL = API_CONFIG.ENDPOINTS.INSURER_RELATIONSHIPS

class InsurerRelationshipService {
  async list(page: number = 1): Promise<InsurerRelationshipsResponse> {
    const { data } = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return data
  }

  async create(body: CreateInsurerRelationshipBody): Promise<{ status: number; message: string; data: InsurerRelationship } | InsurerRelationship> {
    const { data } = await axiosInstance.post(BASE_URL, body)
    return data
  }

  async enable(id: number | string): Promise<{ status: number; message: string; data: InsurerRelationship } | InsurerRelationship> {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/enable`)
    return data
  }

  async disable(id: number | string): Promise<{ status: number; message: string; data: InsurerRelationship } | InsurerRelationship> {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/disable`)
    return data
  }
}

export const insurerRelationshipService = new InsurerRelationshipService()


