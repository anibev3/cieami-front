import axiosInstance from '@/lib/axios'
import { 
  User, 
  UserResponse, 
  CreateUserData, 
  UpdateUserData,
  UserFilters 
} from '@/types/administration'

export interface UpdateProfileData {
  first_name: string
  last_name: string
  email: string
  telephone?: string | null
  signature?: File | null
}

export interface UpdateProfileResponse {
  status: number
  message: string
  data: {
    user: User
  }
}

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
    // if (filters?.per_page) {
    //   params.append('per_page', filters.per_page.toString())
    // }

    const response = await axiosInstance.get<UserResponse>(
      `${this.baseUrl}?${params.toString()}&per_page=1000000`
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

  /**
   * Activer un utilisateur
   */
  async enable(id: number): Promise<User> {
    const response = await axiosInstance.put<{status: number, message: string, data: User}>(`${this.baseUrl}/${id}/enable`)
    return response.data.data
  }

  /**
   * Désactiver un utilisateur
   */
  async disable(id: number): Promise<User> {
    const response = await axiosInstance.put<{status: number, message: string, data: User}>(`${this.baseUrl}/${id}/disable`)
    return response.data.data
  }

  /**
   * Réinitialiser un utilisateur
   */
  async reset(id: number): Promise<User> {
    const response = await axiosInstance.post<{status: number, message: string, data: User}>(`${this.baseUrl}/${id}/reset`)
    return response.data.data
  }

  /**
   * Mettre à jour le profil de l'utilisateur connecté
   */
  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResponse> {
    const formData = new FormData()
    
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    formData.append('email', data.email)
    
    if (data.telephone) {
      formData.append('telephone', data.telephone)
    }
    
    if (data.signature) {
      formData.append('signature', data.signature)
    }

    const response = await axiosInstance.post<UpdateProfileResponse>(
      `${this.baseUrl}/update-profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  }
}

// Export d'une instance singleton
export const userService = new UserService()
export default userService 