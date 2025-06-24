import { authService } from '@/services/authService'

/**
 * Utilitaire pour tester la protection d'authentification
 */
export const authTest = {
  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    return authService.isAuthenticated()
  },

  /**
   * Obtenir le token d'authentification
   */
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },

  /**
   * Vérifier si le token est valide (présent et non vide)
   */
  hasValidToken: () => {
    const token = authTest.getToken()
    return token && token.length > 0
  },

  /**
   * Simuler une déconnexion (pour les tests)
   */
  simulateLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      // Forcer le rechargement pour tester la protection
      window.location.reload()
    }
  },

  /**
   * Vérifier la protection des routes authentifiées
   */
  checkRouteProtection: () => {
    const isAuth = authTest.isAuthenticated()
    const hasToken = authTest.hasValidToken()
    
    return {
      isAuthenticated: isAuth,
      hasToken,
      isProtected: isAuth && hasToken
    }
  }
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).authTest = authTest
} 