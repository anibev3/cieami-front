import axiosInstance from '@/lib/axios'
import { 
  User, 
  UserResponse, 
  CreateUserData, 
  UpdateUserData,
  UserFilters 
} from '@/types/administration'

class UserService {
  private baseUrl = '/users'

  /**
   * Récupérer tous les utilisateurs avec pagination
   */
  async getAll(filters?: UserFilters): Promise<UserResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.entity) {
      params.append('entity', filters.entity)
    }
    if (filters?.role) {
      params.append('role', filters.role)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }

    const response = await axiosInstance.get<UserResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get<User>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouvel utilisateur
   */
  async create(data: CreateUserData): Promise<User> {
    const response = await axiosInstance.post<User>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: number, data: UpdateUserData): Promise<User> {
    const response = await axiosInstance.post<User>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un utilisateur
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des utilisateurs
   */
  async search(query: string): Promise<UserResponse> {
    return this.getAll({ search: query })
  }

  /**
   * Récupérer les utilisateurs par entité
   */
  async getByEntity(entity: string): Promise<UserResponse> {
    return this.getAll({ entity })
  }

  /**
   * Récupérer les utilisateurs par rôle
   */
  async getByRole(role: string): Promise<UserResponse> {
    return this.getAll({ role })
  }
}

// Export d'une instance singleton
export const userService = new UserService()
export default userService 