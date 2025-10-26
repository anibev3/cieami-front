import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { CreateRepairerRelationshipBody, RepairerRelationshipsResponse, RepairerRelationship } from '@/types/repairer-relationships'

const BASE_URL = API_CONFIG.ENDPOINTS.REPAIRER_RELATIONSHIPS

class RepairerRelationshipService {
  async list(page: number = 1, queryParams?: string): Promise<RepairerRelationshipsResponse> {
    const url = queryParams ? `${BASE_URL}?page=${page}&${queryParams}` : `${BASE_URL}?page=${page}`
    const { data } = await axiosInstance.get(url)
    return data
  }

  async create(body: CreateRepairerRelationshipBody): Promise<{ status: number; message: string; data: RepairerRelationship } | RepairerRelationship> {
    const { data } = await axiosInstance.post(BASE_URL, body)
    return data
  }

  async enable(id: number | string): Promise<{ status: number; message: string; data: RepairerRelationship } | RepairerRelationship> {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/enable`)
    return data
  }

  async disable(id: number | string): Promise<{ status: number; message: string; data: RepairerRelationship } | RepairerRelationship> {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/disable`)
    return data
  }
}

export const repairerRelationshipService = new RepairerRelationshipService()


