import { ReactNode, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { Loader2 } from 'lucide-react'

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

  // Affichage d'un loader pendant la vérification
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Vérification de l'authentification...</p>
          </div>
        </div>
      )
    )
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher
  // La redirection est gérée par useEffect
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 