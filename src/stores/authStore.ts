import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { AuthState, LoginCredentials } from '@/types/auth'
import { authService } from '@/services/authService'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  getUserInfo: () => Promise<void>
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const loginResponse = await authService.login(credentials)
          
          // Sauvegarder le token
          authService.saveToken(loginResponse.token)
          
          // Récupérer les informations utilisateur
          const userResponse = await authService.getUserInfo()
          
          set({
            user: userResponse.data,
            token: loginResponse.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          toast.success('Connexion réussie!')
        } catch (error) {
          set({
            isLoading: false,
            error: 'Échec de la connexion. Vérifiez vos identifiants.',
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        
        try {
          await authService.logout()
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          
          toast.success('Déconnexion réussie')
        } catch (_error) {
          set({ isLoading: false })
          // Même en cas d'erreur, on nettoie l'état local
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      getUserInfo: async () => {
        if (!authService.isAuthenticated()) {
          return
        }

        set({ isLoading: true })
        
        try {
          const userResponse = await authService.getUserInfo()
          
          set({
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (_error) {
          set({
            isLoading: false,
            error: 'Impossible de récupérer les informations utilisateur',
          })
          // En cas d'erreur, on déconnecte l'utilisateur
          await get().logout()
        }
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: async () => {
        if (authService.isAuthenticated()) {
          await get().getUserInfo()
        }
      },
    }),


    {
      name: 'expert_0001_auth_storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hooks utilitaires
export const useAuth = () => useAuthStore((state) => state)
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
