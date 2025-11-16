import { ReactNode, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { AuthLoadingIndicator } from './AuthLoadingIndicator'

interface StrictProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function StrictProtectedRoute({ children, fallback }: StrictProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Vérification immédiate au niveau du service
    if (!authService.isAuthenticated()) {
      // Redirection immédiate si aucun token n'est présent
      navigate({ to: '/sign-in-2' })
      return
    }

    // Si on a un token mais que l'état n'est pas encore synchronisé
    if (!isLoading && !isAuthenticated && authService.isAuthenticated()) {
      // Forcer la récupération des informations utilisateur
      // Cette logique est déjà gérée dans le store
    }
  }, [isAuthenticated, isLoading, navigate])

  // Si l'utilisateur n'est pas authentifié et que le chargement est terminé, ne rien afficher
  // La redirection est gérée par useEffect
  if (!isLoading && !isAuthenticated) {
    return null
  }

  // Affichage d'un indicateur discret en haut à droite pendant la vérification
  // Les enfants sont toujours affichés pour éviter le flash de contenu
  return (
    <>
      {isLoading && (fallback || <AuthLoadingIndicator />)}
      {children}
    </>
  )
} 