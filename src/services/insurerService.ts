import axiosInstance from '@/lib/axios'

export interface Insurer {
  id: number
  code: string
  name: string
  email: string | null
  telephone: string | null
  address: string | null
  status: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  entity_type: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

export interface InsurerFilters {
  search?: string
  page?: number
}

export interface InsurersResponse {
  data: Insurer[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

const API_URL = 'https://back.roomcodetraining.com/api/v1/insurers'

export const insurerService = {
  getAll: async (filters?: InsurerFilters): Promise<InsurersResponse> => {
    const { data } = await axiosInstance.get(`${API_URL}?per_page=100000`, {
      params: filters
    })
    return data
  }
} 