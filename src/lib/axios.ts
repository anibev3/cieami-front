import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { ApiError } from '@/types/auth'
import { API_CONFIG } from '@/config/api'

// Création de l'instance axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Accept': 'application/json',
  },
})

// Fonction pour obtenir le token depuis le localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('expert_0001_auth_token')
  }
  return null
}

// Fonction pour sauvegarder le token
const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('expert_0001_auth_token', token)
  }
}

// Fonction pour supprimer le token
const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('expert_0001_auth_token')
    localStorage.removeItem('expert_0001_auth_storage')
  }
}

// Intercepteur pour ajouter automatiquement le token d'authentification
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Gestion du Content-Type :
    // - Pour FormData : laisser axios définir automatiquement avec la bonne boundary
    // - Pour les méthodes avec body (POST, PUT, PATCH) : définir application/json si pas déjà défini
    // - Pour GET/DELETE : ne pas définir de Content-Type (pas nécessaire)
    const methodsWithBody = ['post', 'put', 'patch']
    const hasBody = config.data !== undefined && config.data !== null
    const isFormData = config.data instanceof FormData
    const method = config.method?.toLowerCase() || ''
    const hasContentType = config.headers['Content-Type'] !== undefined
    
    if (hasBody && !isFormData && methodsWithBody.includes(method) && !hasContentType) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses et les erreurs
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError<ApiError>) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      // Supprimer le token invalide
      removeAuthToken()
      
      // Rediriger vers la page de connexion si on n'y est pas déjà
      if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in-2') {
        window.location.href = '/sign-in-2'
      }
      
      toast.error('Session expirée. Veuillez vous reconnecter.')
    }

    // Gestion des erreurs 403 (accès interdit)
    if (error.response?.status === 403) {
      toast.error('Accès interdit. Vous n\'avez pas les permissions nécessaires.')
    }

    // Gestion des erreurs 404 (non trouvé)
    if (error.response?.status === 404) {
      toast.error('Ressource non trouvée.')
    }

    // Gestion des erreurs 422 (validation)
    if (error.response?.status === 422) {
      const errorData = error.response.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Structure: { errors: [{ status, title, detail }] }
        errorData.errors.forEach((error: { status?: number; title?: string; detail?: string }) => {
          if (error.detail) {
            toast.error(error.detail)
          } else if (error.title) {
            toast.error(error.title)
          }
        })
      } else if (errorData?.errors && typeof errorData.errors === 'object') {
        // Structure: { errors: { field: [messages] } }
        const errorMessages = Object.values(errorData.errors).flat()
        errorMessages.forEach((message) => toast.error(message))
      } else if (errorData?.message) {
        toast.error(errorData.message)
      } else {
        toast.error('Erreur de validation')
      }
    }

    // Gestion des erreurs 500 (erreur serveur)
    if (error.response?.status && error.response.status >= 500) {
      toast.error('Erreur serveur. Veuillez réessayer plus tard.')
    }

    // Gestion des erreurs réseau
    if (!error.response) {
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.')
    }

    return Promise.reject(error)
  }
)

// Export des fonctions utilitaires
export { getAuthToken, setAuthToken, removeAuthToken }

// Export de l'instance axios configurée
export default axiosInstance 