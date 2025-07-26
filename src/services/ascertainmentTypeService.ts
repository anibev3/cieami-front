import axiosInstance from '@/lib/axios'

export interface User {
  id: number
  hash_id: string
  email: string
  username: string
  name: string
  last_name: string
  first_name: string
  telephone: string
  photo_url: string
  pending_verification: boolean
  signature: string | null
  created_at: string
  updated_at: string
}

export interface AscertainmentType {
  id: number
  code: string
  label: string
  description: string
  status: {
    id: number
    code: string
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}

export interface AscertainmentTypeResponse {
  data: AscertainmentType[]
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

export interface CreateAscertainmentTypeData {
  label: string
  description: string
}

export interface UpdateAscertainmentTypeData {
  label?: string
  description?: string
}

export interface AscertainmentTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

class AscertainmentTypeService {
  private baseUrl = '/ascertainment-types'

  /**
   * Récupérer tous les types de constat avec pagination
   */
  async getAll(filters?: AscertainmentTypeFilters): Promise<AscertainmentTypeResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('q', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    // if (filters?.per_page) {
    //   params.append('per_page', filters.per_page.toString())
    // }

    const response = await axiosInstance.get<AscertainmentTypeResponse>(
      `${this.baseUrl}?${params.toString()}&per_page=100000`
    )
    return response.data
  }

  /**
   * Récupérer un type de constat par ID
   */
  async getById(id: number): Promise<AscertainmentType> {
    const response = await axiosInstance.get<AscertainmentType>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau type de constat
   */
  async create(data: CreateAscertainmentTypeData): Promise<AscertainmentType> {
    const response = await axiosInstance.post<AscertainmentType>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un type de constat
   */
  async update(id: number, data: UpdateAscertainmentTypeData): Promise<AscertainmentType> {
    const response = await axiosInstance.put<AscertainmentType>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un type de constat
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des types de constat
   */
  async search(query: string): Promise<AscertainmentTypeResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const ascertainmentTypeService = new AscertainmentTypeService()
export default ascertainmentTypeService 