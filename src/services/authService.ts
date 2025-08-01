import axiosInstance, { setAuthToken, removeAuthToken } from '@/lib/axios'
import { LoginCredentials, LoginResponse, UserResponse } from '@/types/auth'
import { API_CONFIG } from '@/config/api'

class AuthService {
  /**
   * Authentifier un utilisateur
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getUserInfo(): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>(API_CONFIG.ENDPOINTS.AUTH.USER_INFO)
    return response.data
  }

  /**
   * Déconnecter l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      // await axiosInstance.delete(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
    } catch (_error) {
      // Même en cas d'erreur, on supprime le token local
      // L'erreur sera gérée par l'intercepteur axios
    } finally {
      // Toujours supprimer le token local
      removeAuthToken()
    }
  }

  /**
   * Sauvegarder le token d'authentification
   */
  saveToken(token: string): void {
    setAuthToken(token)
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('expert_0001_auth_token')
    }
    return false
  }
}

// Export d'une instance singleton
export const authService = new AuthService()
export default authService 