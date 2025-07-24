import axiosInstance from '@/lib/axios'

export interface WorkforceUpdateData {
  workforce_type_id: string
  nb_hours: number
  discount: number
  hourly_rate_id?: string
  paint_type_id?: string
  with_tax?: boolean
}

export interface WorkforceCreateData {
  shock_id: number
  workforce_type_id: string
  nb_hours: number
  discount: number
  hourly_rate_id?: string
  paint_type_id?: string
  with_tax?: boolean
}

class WorkforceService {
  async createWorkforce(data: WorkforceCreateData) {
    const response = await axiosInstance.post('/workforces', data)
    return response.data
  }

  async updateWorkforce(workforceId: number, data: WorkforceUpdateData) {
    const response = await axiosInstance.put(`/workforces/${workforceId}`, data)
    return response.data
  }

  async getWorkforce(workforceId: number) {
    const response = await axiosInstance.get(`/workforces/${workforceId}`)
    return response.data
  }

  async deleteWorkforce(workforceId: number) {
    const response = await axiosInstance.delete(`/workforces/${workforceId}`)
    return response.data
  }
}

// Export d'une instance singleton
export const workforceService = new WorkforceService()
export default workforceService 