import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth, useUser, useIsAuthenticated, useAuthLoading } from '@/stores/authStore'

/**
 * Hook principal pour l'authentification
 * Combine le store Zustand avec des fonctionnalités de navigation
 */
export const useAuthHook = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  // Initialiser l'authentification au montage du composant uniquement
  useEffect(() => {
    auth.initializeAuth()
  }, []) // Dépendance vide pour éviter les boucles infinies

  // Fonction de connexion avec redirection
  const loginWithRedirect = async (credentials: Parameters<typeof auth.login>[0]) => {
    try {
      await auth.login(credentials)
      navigate({ to: '/' })
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  // Fonction de déconnexion avec redirection
  const logoutWithRedirect = async () => {
    await auth.logout()
    navigate({ to: '/sign-in-2' })
  }

  return {
    ...auth,
    loginWithRedirect,
    logoutWithRedirect,
  }
}

// Export des hooks utilitaires
export { useUser, useIsAuthenticated, useAuthLoading }

/**
 * Hook pour protéger les routes authentifiées
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Sauvegarder la page actuelle pour rediriger après connexion
      const currentPath = window.location.pathname
      const searchParams = new URLSearchParams()
      if (currentPath !== '/sign-in-2') {
        searchParams.set('redirect', currentPath)
      }
      
      navigate({ 
        to: '/sign-in-2',
        search: searchParams.toString() ? { redirect: currentPath } : undefined,
      })
    }
  }, [isAuthenticated, isLoading, navigate])

  return { isAuthenticated, isLoading }
}

/**
 * Hook pour rediriger les utilisateurs déjà connectés
 */
export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Récupérer la page de redirection depuis l'URL
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect') || '/'
      
      // Rediriger vers la page demandée ou la page d'accueil
      navigate({ to: redirectTo as '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  return { isAuthenticated, isLoading }
} 