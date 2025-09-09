import axiosInstance from '@/lib/axios'

export interface Role {
  name: string
  label: string
  description: string
}

export interface RoleApiResponse {
  data: Role[]
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
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface RoleFilters {
  search?: string
}

class RoleService {
  /**
   * Récupérer la liste des rôles avec pagination et filtres
   */
  async getRoles(page: number = 1, filters?: RoleFilters): Promise<RoleApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters?.search && { search: filters.search }),
    })

    const response = await axiosInstance.get<RoleApiResponse>(`/roles?${params}`)
    return response.data
  }

  /**
   * Récupérer tous les rôles (sans pagination)
   */
  async getAllRoles(filters?: RoleFilters): Promise<Role[]> {
    const params = new URLSearchParams({
      per_page: '1000',
      ...(filters?.search && { search: filters.search }),
    })

    const response = await axiosInstance.get<RoleApiResponse>(`/roles?${params}`)
    return response.data.data
  }
}

// Export d'une instance singleton
export const roleService = new RoleService()
